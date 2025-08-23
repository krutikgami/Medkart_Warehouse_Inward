import {PrismaClient} from  '@prisma/client'
import {v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

const createPurchaseOrder = async (req, res) => {
    try {
        const { vendor_code, items, purchase_date, expected_date,status, total_amount} = req.body;
        if (!vendor_code || !items || items.length === 0 || !purchase_date || !expected_date || !status || !total_amount) {
            return res.status(400).json({
                success: false,
                message: "Vendor code and items are required"
            });
        }

        const orderCode = `PO-${uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase()}`;

        const newOrder = await prisma.purchaseOrder.create({
            data: {
                vendor_code :  vendor_code,
                purchase_date : new Date(purchase_date),
                purchase_order_code : orderCode,
                expected_date : new Date(expected_date),
                status,
                total_amount,
                items: {
                    create: items.map(item => ({
                        product_code: item.product_code,
                        quantity: parseInt(item.quantity),
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

        return res.status(201).json({
            success: true,
            message: "Purchase order created successfully",
            data: newOrder
        });
    } catch (error) {
        console.log("Error creating purchase order", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllPurchaseOrder = async (req,res)=>{
    try {
        const getPurchaseOrder = await prisma.purchaseOrder.findMany({
            orderBy:{
                updated_at : 'desc'
            },
            select : {
                id : true,
                vendor_code : true,
                purchase_order_code : true,
                purchase_date : true,
                expected_date : true,
                status : true,
                total_amount : true,
                items : true
            }
        })
        if(!getPurchaseOrder || getPurchaseOrder.length === 0){
            return res.status(400).json({
                success : false,
                message : "No Purchase Order Found",
            })
        }

        return res.status(200).json({
            success : true,
            message : "Purchase Order Fetched Successfully",
            data : getPurchaseOrder
        })
    } catch (error) {
        console.log("Error in get All Purchase order",error.message)
        return res.status(500).json({
            success: false,
            error : error.message,
            message : "Internal server error"
        })
    }
}

const deletePurchaseOrder = async(req,res)=>{
    try {
        const { purchase_order_code } = req.body;
        if (!purchase_order_code) {
            return res.status(400).json({
                success: false,
                message: "Purchase order code is required"
            });
        }

        const deleteItems = await prisma.purchaseOrderItem.deleteMany({
            where: { purchase_order_code }
        });

        if (!deleteItems) {
            return res.status(404).json({
                success: false,
                message: "Purchase order items not found"
            });
        }
        
        const deletedOrder = await prisma.purchaseOrder.delete({
            where: { purchase_order_code }
        });

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase order with its items deleted successfully",
            data: deletedOrder
        });
    } catch (error) {
        console.log("Error in deletePurchaseOrder controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const updatePurchaseOrder = async (req, res) => {
    try {
        const { purchase_order_code, vendor_code, items, purchase_date, expected_date, status, total_amount } = req.body;
        if (!purchase_order_code) {
            return res.status(400).json({
                success: false,
                message: "Purchase order code is required"
            });
        }

        const existingOrder = await prisma.purchaseOrder.findUnique({
            where: { purchase_order_code },
            include: { items: true }
        });

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        const updatedOrder = await prisma.purchaseOrder.update({
            where: { purchase_order_code },
            data: {
                vendor_code: vendor_code || existingOrder.vendor_code,
                purchase_date: purchase_date ? new Date(purchase_date) : existingOrder.purchase_date,
                expected_date: expected_date ? new Date(expected_date) : existingOrder.expected_date,
                status: status || existingOrder.status,
                total_amount: total_amount || existingOrder.total_amount,
                ...(items && items.length > 0 && {
                items: {
                    deleteMany: { purchase_order_code }, 
                    create: items.map(item => ({
                    product_code: item.product_code,
                    quantity: parseInt(item.quantity),
                    mrp: parseFloat(item.mrp),
                    cost_price: parseFloat(item.cost_price),
                    total_price: parseFloat(item.total_price),
                    })),
                }
                })
            },
            include: {
                items: true
            }
});


        return res.status(200).json({
            success: true,
            message: "Purchase order updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.log("Error in updatePurchaseOrder controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const searchVendor = async(req,res) => {
    try {
        const {vendorName} = req.query;
        if (!vendorName) {
        return res.status(400).json({ success: false, message: "vendor_name query required" });
        }

    const vendors = await prisma.vendorMaster.findMany({
      where: {
        vendor_name: {
          contains: vendorName,
          mode: "insensitive",
        },
      },
      select: {
        vendor_code: true,
        vendor_name: true,
      },
      take: 10, 
    });

    return res.status(200).json({ success: true, data: vendors });
    } catch (error) {
         console.error("Error searching vendors:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const searchProduct = async(req,res)=>{
    try {
        const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({ success: false, message: "product_name query required" });
    }
    const products = await prisma.productMaster.findMany({
      where: {
        product_name: {
          contains: productName,
          mode: "insensitive",
        },
      },
      select: {
        product_code: true,
        product_name: true,
      },
      take: 10,
    });

    return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export {createPurchaseOrder,getAllPurchaseOrder,deletePurchaseOrder,updatePurchaseOrder,searchVendor,searchProduct};