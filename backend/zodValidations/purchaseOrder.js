import {z} from 'zod'

const purchaseOrderItemSchema = z.object({
  product_code: z.string().min(1, "Product code is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  mrp: z.float32().positive("MRP must be greater than 0"),
  cost_price: z.float32().positive("Cost Price must be greater than 0"),
  total_price: z.number().positive("Total price must be greater than 0"),
})

export const createPurchaseOrderSchema = z.object({
  vendor_code: z.string().min(1, "Vendor code is required"),
  purchase_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid purchase date",
  }),
  expected_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid expected date",
  }),
  total_amount: z.number().positive("Total amount must be greater than 0"),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "At least one item is required"),
}).strict();

export const updatePurchaseOrderSchema = z.object({
  purchase_order_code: z.string().min(1, "Purchase order code is required"),
  vendor_code: z.string().optional(),
  purchase_date: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid purchase date",
    })
    .optional(),
  expected_date: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid expected date",
    })
    .optional(),
  total_amount: z.number().positive("Total amount must be greater than 0").optional(),
  items: z.array(purchaseOrderItemSchema).optional(),
})

