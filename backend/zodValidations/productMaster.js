import {z} from 'zod'

export const productSchema  =  z.object({
  product_name: z.string().min(5, "Product Name is required"),
  product_description: z.string().min(10, "Product Description is required"),
  product_price: z.preprocess((val) => parseFloat(val), z.float32().positive("Product Price must be positive")),
  product_mrp: z.preprocess((val) => parseFloat(val), z.float32().positive("MRP must be positive")),
  hsn_code: z.preprocess((val) => parseInt(val), z.number().int("HSN code must be an integer")),
  gst_percent: z.preprocess((val) => parseFloat(val), z.float32().min(0).max(100, "GST must be between 0 and 100")),
  category: z.string().min(3, "Category is required"),
  combination: z.union([z.string(), z.array(z.string())]), 
  unit_of_measure: z.string().min(1, "Unit of measure is required"),
  status: z.string().min(4, "Status is required"),
  product_last_purchase_price: z.preprocess((val) => parseFloat(val), z.float32().nonnegative().optional()),
})


export const updateProductSchema = z.object({
  product_code: z.string().min(1, "Product code is required"),
  product_name: z.string().min(5, "Product Name is required").optional(),
  product_description: z.string().min(10, "Product Description is required").optional(),
  product_price: z.preprocess(
    (val) => (val !== undefined && val !== "" ? parseFloat(val) : undefined),
    z.number().positive("Product Price must be positive").optional()
  ),
  product_mrp: z.preprocess(
    (val) => (val !== undefined && val !== "" ? parseFloat(val) : undefined),
    z.number().positive("MRP must be positive").optional()
  ),
  hsn_code: z.preprocess(
    (val) => (val !== undefined && val !== "" ? parseInt(val) : undefined),
    z.number().int("HSN code must be an integer").optional()
  ),
  gst_percent: z.preprocess(
    (val) => (val !== undefined && val !== "" ? parseFloat(val) : undefined),
    z.number().min(0).max(100, "GST must be between 0 and 100").optional()
  ),
  category: z.string().optional(),
  combination: z.union([z.string(), z.array(z.string())]).optional(),
  unit_of_measure: z.string().optional(),
  status: z.string().optional(),
  product_last_purchase_price: z.preprocess(
    (val) => (val !== undefined && val !== "" ? parseFloat(val) : undefined),
    z.number().nonnegative().optional()
  ),
})