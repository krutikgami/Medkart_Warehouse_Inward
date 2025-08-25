import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();
import {v4 as uuidv4} from 'uuid';


const addGrn = async(req,res)=>{
    try {
        const {purchase_order_code,vendor_code,grn_date ,total_amount,total_damage_qty,total_shortage_qty,items} =req.body;
        console.log("Received GRN data:", req.body);

        if(purchase_order_code == null || vendor_code == null || grn_date == null || total_amount == null || total_damage_qty == null || total_shortage_qty == null || !items  || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        for(let item of items){
            if(parseFloat(item.mrp) < parseFloat(item.cost_price)){
                return res.status(400).json({
                    success: false,
                    message: `For product code ${item.product_code}, MRP should be greater than or equal to Cost Price`
                });
            }
        }

        const existingPO = await prisma.purchaseOrder.findUnique({
            where: { purchase_order_code },
            include: { items: true }
        });

        if(!existingPO){
            return res.status(404).json({
                success: false,
                message: "Purchase Order not found"
            });
        }

        const UniqCode = uuidv4().replace(/-/g, "").slice(2, 10).toUpperCase();
        const grnCode = `grn-${UniqCode}`;

        for (const item of items) {
            const poItem = existingPO.items.find(i => i.product_code === item.product_code);
            if (poItem && item.quantity > poItem.quantity) {
                const cancelledStatusPO = await prisma.purchaseOrder.update({
                    where :{
                        purchase_order_code,
                    },
                    data: {
                        status: "Cancelled"
                    } 
                })
                if(!cancelledStatusPO){
                    return req.status(400).json({
                        success : false,
                        message : "Error in updating PO status"
                    })
                }  
                return res.status(400).json({
                    success: false,
                    message: `Received quantity for ${item.product_code} exceeds ordered quantity`
                });
            }
            const product = await prisma.productMaster.findUnique({
                where: { product_code: item.product_code },
                select: {
                    product_last_purchase_price:true
                }
            });
            if (product) {
                const maxAllowedPrice = product.product_last_purchase_price * 1.2;
                
                if (item.mrp > maxAllowedPrice) {
                    return res.status(400).json({
                        success: false,
                        message: `MRP for ${item.product_code} exceeds the allowed limit`
                    });
                }
            }
        }

        const newGrn = await prisma.grn.create({
            data:{
                grn_code : grnCode,
                purchase_order_code,
                vendor_code,
                grn_date : new Date(grn_date),
                total_amount : parseFloat(total_amount),
                status : "Pending",
                total_damage_qty : parseInt(total_damage_qty) || 0,
                total_shortage_qty : parseInt(total_shortage_qty) || 0,
                items:{
                    create: items.map(item => ({
                        product_code: item.product_code,
                        quantity: parseInt(item.quantity),
                        damage_qty: parseInt(item.damage_qty),
                        shortage_qty: parseInt(item.shortage_qty),
                        batch_number: item.batch_number,
                        mfg_date: new Date(item.mfg_date),
                        exp_date: new Date(item.exp_date),
                        mrp: parseFloat(item.mrp),
                        cost_price: parseFloat(item.cost_price),
                        total_price: parseFloat(item.total_price)
                    }))
                }
            },
            include:{
                items:true
            }
        });

        if(!newGrn){
            return res.status(400).json({
                success: false,
                message: "GRN creation failed"
            });
        }

        const purchaseOrderQuantity = existingPO.items.reduce((sum,item)=> sum + Number(item.quantity), 0);
        const newGrnItemsQuantity = newGrn.items.reduce((sum,item)=> sum + Number(item.quantity), 0);
        
        let stat;
        if(purchaseOrderQuantity === newGrnItemsQuantity){
            stat = "Completed";
        }else{
            stat = "Partial Completed";
        }

        const updateStatus=  await prisma.purchaseOrder.update({
            where: { purchase_order_code },
            data: { status: stat }
        });

        if(!updateStatus){
            return res.status(400).json({
                success: false,
                message: "Purchase Order status update failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "GRN added successfully",
            data: newGrn
        });

    } catch (error) {
        console.error("Error in addGrn controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllGrns = async(req,res)=>{
    try {
        const grns = await prisma.grn.findMany({
            include:{
                items:true
            },
            orderBy:{
                updated_at:'desc'
            }
        });
        if (!grns || grns.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No GRNs found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "GRNs fetched successfully",
            data: grns
        });

    } catch (error) {
        console.error("Error in getAllGrns controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const editGrn = async(req,res)=>{
    try {
        const {grn_code,purchase_order_code,vendor_code,grn_date ,total_amount,total_damage_qty,total_shortage_qty,items} =req.body;

        if(grn_code == null || purchase_order_code == null || vendor_code == null || grn_date == null || total_amount == null || total_damage_qty == null || total_shortage_qty == null || !items  || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        for(let item of items){
            if(parseFloat(item.mrp) < parseFloat(item.cost_price)){
                return res.status(400).json({
                    success: false,
                    message: `For product code ${item.product_code}, MRP should be greater than or equal to Cost Price`
                });
            }
        }
        
        const existingGRN = await prisma.grn.findUnique({
            where: { grn_code },
            include: { items: true }
        });

        if(!existingGRN){
            return res.status(404).json({
                success: false,
                message: "GRN not found"
            });
        }

        const existingPO = await prisma.purchaseOrder.findUnique({
            where: { purchase_order_code },
            include: { items: true }
        });

        if(!existingPO){
            return res.status(404).json({
                success: false,
                message: "Purchase Order not found"
            });
        }

        for (const item of items) {
            const poItem = existingPO.items.find(i => i.product_code === item.product_code);
            if (poItem && item.quantity > poItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Received quantity for ${item.product_code} exceeds ordered quantity`
                });
            }
            const product = await prisma.productMaster.findUnique({
                where: { product_code: item.product_code },
                select: {
                    product_last_purchase_price:true
                }
            });
            if (product) {
                const maxAllowedPrice = product.product_last_purchase_price * 1.2;
                
                if (item.mrp > maxAllowedPrice) {
                    return res.status(400).json({
                        success: false,
                        message: `MRP for ${item.product_code} exceeds the allowed limit`
                    });
                }
            }
        }

        const updatedGrn = await prisma.grn.update({
            where: { grn_code },
            data: {
                purchase_order_code,
                vendor_code,
                grn_date: new Date(grn_date),
                total_amount: parseFloat(total_amount),
                status : "Pending",
                total_damage_qty: parseInt(total_damage_qty) || 0,
                total_shortage_qty: parseInt(total_shortage_qty) || 0,
                items: {
                    deleteMany: { grn_code },
                    create: items.map(item => ({
                        product_code: item.product_code,
                        quantity: parseInt(item.quantity),
                        damage_qty: parseInt(item.damage_qty),
                        shortage_qty: parseInt(item.shortage_qty),
                        batch_number: item.batch_number,
                        mfg_date: new Date(item.mfg_date),
                        exp_date: new Date(item.exp_date),
                        mrp: parseFloat(item.mrp),
                        cost_price: parseFloat(item.cost_price),
                        total_price: parseFloat(item.total_price)
                    }))
                }
            },
            include: {
                items: true
            }
        });

        if(!updatedGrn){
            return res.status(400).json({
                success: false,
                message: "GRN update failed"
            });
        }

        const newGrnItemsQuantity = updatedGrn.items.reduce((sum,item)=> sum + Number(item.quantity), 0);
        const purchaseOrderQuantity = existingPO.items.reduce((sum,item)=> sum + Number(item.quantity), 0);
        let stat;

        if(newGrnItemsQuantity === purchaseOrderQuantity){
            stat = "Completed";
        }else{
            stat = "Partial Completed";
        }

        const updateStatus=  await prisma.purchaseOrder.update({
            where: { purchase_order_code },
            data: { status: stat }
        });

        if(!updateStatus){
            return res.status(400).json({
                success: false,
                message: "Purchase Order status update failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "GRN updated successfully",
            data: updatedGrn
        });

    } catch (error) {
        console.error("Error in editGrn controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const deleteGrn = async(req,res)=>{
    const { grn_code } = req.body;

    try {

        const deleteGrnItms = await prisma.grnItem.deleteMany({
            where: { grn_code }
        });

        if (!deleteGrnItms) {
            return res.status(404).json({
                success: false,
                message: "GRN items not found"
            });
        }

        const deletedGrn = await prisma.grn.delete({
            where: { grn_code }
        });

        if(!deletedGrn){
            return res.status(404).json({
                success: false,
                message: "GRN not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "GRN and its items deleted successfully",
        });

    } catch (error) {
        console.error("Error in deleteGrn controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export {addGrn,getAllGrns,editGrn,deleteGrn};
