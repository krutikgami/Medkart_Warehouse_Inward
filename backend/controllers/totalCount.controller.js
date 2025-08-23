import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getTotalCount = async (req, res) => {
    try {
        const vendorCount = await prisma.vendorMaster.count();
        const productCount = await prisma.productMaster.count();
        const purchaseOrderCount = await prisma.purchaseOrder.count();

        return res.status(200).json({
            success: true,
            data: {
                vendors: vendorCount,
                products: productCount,
                purchaseOrders: purchaseOrderCount
            }
        });
    } catch (error) {
        console.error("Error in getTotalCount controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export { getTotalCount };