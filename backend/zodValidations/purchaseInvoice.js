import { z } from "zod"

const purchaseInvoiceItemSchema = z.object({
  product_code: z.string().min(1, "Product code is required"),
  quantity: z.preprocess((val) => Number(val), z.number().int().positive("Quantity must be greater than 0")),
  mrp: z.preprocess((val) => parseFloat(val), z.float32().positive("MRP must be greater than 0")),
  cost_price: z.preprocess((val) => parseFloat(val), z.float32().positive("Cost Price must be greater than 0")),
  total_price: z.preprocess((val) => parseFloat(val), z.float32().positive("Total Price must be greater than 0")),
})

export const createPurchaseInvoiceSchema = z.object({
  grn_code: z.string().min(1, "GRN code is required"),
  vendor_code: z.string().min(1, "Vendor code is required"),
  invoice_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid invoice date",
  }),
  status: z.enum(["Pending", "Completed", "Cancelled"]).optional(),
  items: z.array(purchaseInvoiceItemSchema).min(1, "At least one item is required"),
})

export const updatePurchaseInvoiceSchema = z.object({
  purchase_invoice_code: z.string().min(1, "Purchase Invoice code is required"),
  invoice_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid invoice date",
  }),
  status: z.enum(["Pending", "Completed", "Cancelled"]).optional(),
  items: z.array(purchaseInvoiceItemSchema).min(1, "At least one item is required"),
})