import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getTotalCount = async (req, res) => {
  try {
    const vendorCount = await prisma.vendorMaster.count({
      where : {
        deletedAt : null
      }
    })
    const productCount = await prisma.productMaster.count({
      where : {
        deletedAt : null
      }
    })
    const purchaseOrderCount = await prisma.purchaseOrder.count({
      where : {
        deletedAt : null
      }
    })
    const grnCount = await prisma.grn.count({
      where : {
        deletedAt : null
      }
    })
    const purchaseInvoiceCount = await prisma.purchaseInvoice.count({
      where : {
        deletedAt : null
      }
    })

    return res.status(200).json({
      success: true,
      data: {
        vendors: vendorCount,
        products: productCount,
        purchaseOrders: purchaseOrderCount,
        grns: grnCount,
        purchaseInvoices: purchaseInvoiceCount,
      },
    })
  } catch (error) {
    console.error('Error in getTotalCount controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export { getTotalCount }
