import { z } from "zod"

export const vendorSchema = z.object({
  vendor_name: z.string().min(5, "Vendor name is required"),
  contact_person: z.string().min(5, "Contact person is required"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long"),
  gst_number: z
    .string()
    .min(15, "GST number must be 15 characters")
    .max(15, "GST number must be 15 characters"),
  address: z.string().min(9, "Address is required"),
  status: z.string().min(4, "Status is required"),
  vendor_email: z.email("Invalid email address"),
})


export const updateVendorSchema = z.object({
  vendor_code: z.string().min(1, "Vendor code is required"),
  vendor_name: z.string().min(5, "Vendor name is required").optional(),
  contact_person: z.string().min(5, "Contact person is required").optional(),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long")
    .optional(),
  gst_number: z
    .string()
    .min(15, "GST number must be 15 characters")
    .max(15, "GST number must be 15 characters")
    .optional(),
  address: z.string().min(9, "Address is required").optional(),
  status: z.string().min(4, "Status is required").optional(),
  vendor_email: z.email("Invalid email address").optional(),
})