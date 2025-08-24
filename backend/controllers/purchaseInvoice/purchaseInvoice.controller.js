import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();
import {v4 as uuidv4} from 'uuid'

const createPurchaseInvoice  = async(req,res)=>{
    try {
        const {grn_code, vendor_code, invoice_date, total_amount, status, items} = req.body;

        if(grn_code==null || vendor_code==null || invoice_date==null || total_amount==null ||!items || items.length===0){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const grn = await prisma.grn.findUnique({
            where: { grn_code }
        });

        if (!grn) {
            return res.status(404).json({
                success: false,
                message: "GRN not found"
            });
        }

        const invoiceCode = `INV-${uuidv4().replace(/-/g, "").substring(2, 12).toUpperCase()}`;

        const newInvoice = await prisma.purchaseInvoice.create({
            data: {
                purchase_invoice_code: invoiceCode,
                grn_code,
                vendor_code,
                invoice_date: new Date(invoice_date),
                total_amount,
                status,
                items: {
                    create: items.map(item => ({
                        product_code: item.product_code,
                        quantity: parseInt(item.quantity),
                        mrp: item.mrp,
                        cost_price: item.cost_price,
                        total_price: item.total_price,
                        tax_amount: item.tax_amount,
                        tax_percentage: item.tax_percentage
                    }))
                }
            },
            include: {
                items: true
            }
        });

        if (!newInvoice) {
            return res.status(500).json({
                success: false,
                message: "Failed to create purchase invoice"
            });
        }

        return res.status(201).json({
            data: newInvoice,
            success: true,
            message: "Purchase Invoice created successfully"
        });
    } catch (error) {
        console.log('Error creating in Purchase Invoice',error.message);
        return res.status(500).json({
            error : error.message,
            success : false,
            message : "Internal Server Error"
        })
    }
}

const getAllPurchaseInvoices = async(req,res)=>{
    try {
    
        const purchaseInvoices = await prisma.purchaseInvoice.findMany({
            orderBy :{
                updated_at : 'desc'
            },
            include: {
                items: true
            }
        });

        if (!purchaseInvoices) {
            return res.status(404).json({
                success: false,
                message: "Purchase Invoice not found"
            });
        }

        return res.status(200).json({
            data: purchaseInvoices,
            success: true,
            message: "Purchase Invoice fetched successfully"
        });
    } catch (error) {
        console.log('Error fetching Purchase Invoices',error.message);
        return res.status(500).json({
            error : error.message,
            success : false,
            message : "Internal Server Error"
        })
    }
}

const updatePurchaseInvoice = async(req,res)=>{
    try {
        const {purchase_invoice_code, invoice_date, total_amount,status, items} = req.body;
        if(purchase_invoice_code==null || invoice_date==null || total_amount==null ||!items || items.length===0){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingInvoice = await prisma.purchaseInvoice.findUnique({
            where:{purchase_invoice_code}
        })

        if(!existingInvoice){
            return res.status(404).json({
                success: false,
                message: "Purchase Invoice not found"
            });
        }

        const updatedInvoice = await prisma.purchaseInvoice.update({
            where:{purchase_invoice_code},
            data:{
                invoice_date: new Date(invoice_date),
                total_amount,
                status,
                items: {
                    deleteMany: { purchase_invoice_code },
                    create: items.map(item => ({
                        product_code: item.product_code,
                        quantity: parseInt(item.quantity),
                        mrp: item.mrp,
                        cost_price: item.cost_price,
                        total_price: item.total_price,
                        tax_amount: item.tax_amount,
                        tax_percentage: item.tax_percentage
                    }))
                }
            },
            include: {
                items: true
            }
        })

        if(!updatedInvoice){
            return res.status(500).json({
                success: false,
                message: "Failed to update purchase invoice"
            });
        }

        return res.status(200).json({
            data: updatedInvoice,
            success: true,
            message: "Purchase Invoice updated successfully"
        })

    } catch (error) {
        console.log('Error updating Purchase Invoice',error.message);
        return res.status(500).json({
            error : error.message,
            success : false,
            message : "Internal Server Error"
        })
    }
}

const deletePurchaseInvoice = async(req,res)=>{
    try {
        const { purchase_invoice_code } = req.body;

        if (!purchase_invoice_code) {
            return res.status(400).json({
                success: false,
                message: "Purchase invoice code is required"
            });
        }

        const deleteItems = await prisma.purchaseInvoiceItem.deleteMany({
            where: { purchase_invoice_code }
        });

        if (!deleteItems) {
            return res.status(404).json({
                success: false,
                message: "Purchase invoice items not found"
            });
        }
        
        const deletedInvoice = await prisma.purchaseInvoice.delete({
            where: { purchase_invoice_code }
        });

        if (!deletedInvoice) {
            return res.status(404).json({
                success: false,
                message: "Purchase invoice not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase invoice with its items deleted successfully",
        });
    } catch (error) {
        console.log('Error deleting Purchase Invoice',error.message);
        return res.status(500).json({
            error : error.message,
            success : false,
            message : "Internal Server Error"
        })
    }
}

export { createPurchaseInvoice , getAllPurchaseInvoices , updatePurchaseInvoice, deletePurchaseInvoice};