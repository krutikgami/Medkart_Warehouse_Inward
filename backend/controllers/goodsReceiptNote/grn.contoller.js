import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();
import {v4 as uuidv4} from 'uuid';


const addGrn = async(req,res)=>{
    try {
        const {purchase_order_code,vendor_code,grn_date ,status,total_amount,total_damage_qty,total_shortage_qty,items} =req.body;
        console.log("Received GRN data:", req.body);

        if(purchase_order_code == null || vendor_code == null || grn_date == null || total_amount == null || total_damage_qty == null || total_shortage_qty == null || status == null || !items  || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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

        const UniqCode = uuidv4().replace(/-/g, "").slice(2, 10).toUpperCase();
        const grnCode = `grn-${UniqCode}`;

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
                
                if (item.cost_price > maxAllowedPrice) {
                    return res.status(400).json({
                        success: false,
                        message: `Cost price for ${item.product_code} exceeds the allowed limit`
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
                status,
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

export {addGrn};

  