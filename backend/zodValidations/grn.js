import { z } from "zod"

export const addGrnSchema = z.object({
  purchase_order_code: z.string().min(1, "Purchase order code is required"),
  vendor_code: z.string().min(1, "Vendor code is required"),
  grn_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid GRN date",
  }),
  total_amount: z.number().positive("Total amount must be greater than 0"),
  total_damage_qty: z.number().int().min(0, "Total damage qty cannot be negative"),
  total_shortage_qty: z.number().int().min(0, "Total shortage qty cannot be negative"),
  items: z.array(grnItemSchema).min(1, "At least one item is required"),
})

export const editGrnSchema = z.object({
  grn_code: z.string().min(1, "GRN code is required"),
  purchase_order_code: z.string().min(1, "Purchase order code is required"),
  vendor_code: z.string().min(1, "Vendor code is required"),
  grn_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid GRN date",
  }),
  total_amount: z.number().positive("Total amount must be greater than 0"),
  total_damage_qty: z.number().int().min(0, "Total damage qty cannot be negative"),
  total_shortage_qty: z.number().int().min(0, "Total shortage qty cannot be negative"),
  items: z.array(grnItemSchema).min(1, "At least one item is required"),
})


const grnItemSchema = z.object({
  product_code: z.string().min(1, "Product code is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  damage_qty: z.number().int().min(0, "Damage quantity cannot be negative"),
  shortage_qty: z.number().int().min(0, "Shortage quantity cannot be negative"),
  batch_number: z.string().min(1, "Batch number is required"),
  mfg_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid manufacturing date",
  }),
  exp_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid expiry date",
  }),
  mrp: z.number().positive("MRP must be greater than 0"),
  cost_price: z.number().positive("Cost Price must be greater than 0"),
  total_price: z.number().positive("Total Price must be greater than 0"),
})
