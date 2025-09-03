import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import {createPurchaseOrderSchema,updatePurchaseOrderSchema} from '../../zodValidations/purchaseOrder.js'
import { ZodError } from '../../utilities/zodError.js'

const prisma = new PrismaClient()

const createPurchaseOrder = async (req, res) => {
  try {
      const validations = createPurchaseOrderSchema.parse(req.body);

    for (let item of validations.items) {
      if (parseFloat(item.mrp) < parseFloat(item.cost_price)) {
        return res.status(400).json({
          success: false,
          message: `For product code ${item.product_code}, MRP should be greater than or equal to Cost Price`,
        })
      }
    }

    const orderCode = `PO-${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`

    const exist_OrderCode = await prisma.purchaseOrder.findFirst({
      where:{
        purchase_order_code : orderCode
      }
    })

    if(exist_OrderCode){
      return res.status(400).json({
        success : false,
        message : "Purchase order Code already exists"
      })
    }

    

     const newOrder = await prisma.purchaseOrder.create({
      data: {
        vendor_code: validatedData.vendor_code,
        purchase_date: new Date(validatedData.purchase_date),
        purchase_order_code: orderCode,
        expected_date: new Date(validatedData.expected_date),
        status: "Pending",
        total_amount: validatedData.total_amount,
        items: {
          create: validatedData.items.map((item) => ({
            product_code: item.product_code,
            quantity: item.quantity,
            mrp: item.mrp,
            cost_price: item.cost_price,
            total_price: item.total_price,
          })),
        },
      },
      include: { items: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: newOrder,
    })
  } catch (error) {
    if(error instanceof z.ZodError){
        const res = ZodError(error);
        return res.status(400).json({
          success : false,
          message: "Validation failed",
          errors: res,
        })
    }
    console.log('Error creating purchase order', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}
const getAllPurchaseOrder = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const totalRecords = await prisma.purchaseOrder.count({
      where: {
        deletedAt: null,
      },
    });

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        vendor_code: true,
        purchase_order_code: true,
        purchase_date: true,
        expected_date: true,
        status: true,
        total_amount: true,
        items: true,
      },
    });

    if (!purchaseOrders || purchaseOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Purchase Orders Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase Orders fetched successfully",
      data: purchaseOrders,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit,
        hasNextPage: page * limit < totalRecords,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log("Error in getAllPurchaseOrder:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const deletePurchaseOrder = async (req, res) => {
  try {
    const { purchase_order_code } = req.body
    if (!purchase_order_code) {
      return res.status(400).json({
        success: false,
        message: 'Purchase order code is required',
      })
    }

    const deleteItems = await prisma.purchaseOrderItem.updateMany({
      where: { purchase_order_code },
      data:{
        deletedAt : new Date()
      }
    })

    if (!deleteItems) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order items not Deleted',
      })
    }

    const deletedOrder = await prisma.purchaseOrder.update({
      where: { purchase_order_code },
      data:{
        deletedAt: new Date()
      }
    })

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not Deleted',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Purchase order with its items deleted successfully',
      data: deletedOrder,
    })
  } catch (error) {
    console.log('Error in deletePurchaseOrder controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

const updatePurchaseOrder = async (req, res) => {
  try {
    const validations = updatePurchaseOrderSchema.parse(req.body);

    for (let item of validations.items) {
      if (item.mrp< item.cost_price) {
        return res.status(400).json({
          success: false,
          message: `For product code ${item.product_code}, MRP should be greater than or equal to Cost Price`,
        })
      }
    }

    const existingOrder = await prisma.purchaseOrder.findUnique({
      where: {purchase_order_code: validations.purchase_order_code },
      include: { items: true },
    })

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found',
      })
    }

    const updatedOrder = await prisma.purchaseOrder.update({
      where: { purchase_order_code: validations.purchase_order_code },
      data: {
        vendor_code: validations.vendor_code || existingOrder.vendor_code,
        purchase_date: validations.purchase_date
          ? new Date(purchase_date)
          : existingOrder.purchase_date,
        expected_date:validations.expected_date
          ? new Date(expected_date)
          : existingOrder.expected_date,
        status: existingOrder.status,
        total_amount: validations.total_amount || existingOrder.total_amount,
        ...(validations.items &&
          validations.items.length > 0 && {
            items: {
              deleteMany: { purchase_order_code : validations.purchase_order_code},
              create: validations.items.map((item) => ({
                product_code: item.product_code,
                quantity: parseInt(item.quantity),
                mrp: parseFloat(item.mrp),
                cost_price: parseFloat(item.cost_price),
                total_price: parseFloat(item.total_price),
              })),
            },
          }),
      },
      include: {
        items: true,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Purchase order updated successfully',
      data: updatedOrder,
    })
  } catch (error) {
    if(error instanceof z.ZodError){
        const res = ZodError(error);
        return res.status(400).json({
          success : false,
          message: "Validation failed",
          errors: res,
        })
    }
    console.log('Error in updatePurchaseOrder controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

const searchVendor = async (req, res) => {
  try {
    const { vendorName } = req.query
    if (!vendorName) {
      return res
        .status(400)
        .json({ success: false, message: 'vendor_name query required' })
    }
    
    const vendors = await prisma.vendorMaster.findMany({
      where: {
        vendor_name: {
          contains: vendorName,
          mode: 'insensitive',
        },
        status: 'Active',
        deletedAt : null
      },
      select: {
        vendor_code: true,
        vendor_name: true,
      },
      take: 10,
    })
    return res.status(200).json({ success: true, data: vendors })
  } catch (error) {
    console.error('Error searching vendors:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' })
  }
}

const searchProduct = async (req, res) => {
  try {
    const { productName } = req.query

    if (!productName) {
      return res
        .status(400)
        .json({ success: false, message: 'product_name query required' })
    }
    const products = await prisma.productMaster.findMany({
      where: {
        product_name: {
          contains: productName,
          mode: 'insensitive',
        },
        status: 'Active',
        deletedAt : null
      },
      select: {
        product_code: true,
        product_name: true,
      },
      take: 10,
    })

    return res.status(200).json({ success: true, data: products })
  } catch (error) {
    console.error('Error searching products:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' })
  }
}

export {
  createPurchaseOrder,
  getAllPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrder,
  searchVendor,
  searchProduct,
}
