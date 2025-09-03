export const dbname = {
    'PM' : "productMaster",
    "VM" : "vendorMaster",
    "PO" : "purchaseOrder",
    "PI" : "purchaseInvoice",
    "GRN" : "grn"
}

export const dbcols = {
    'PM' :  ["product_name","product_description","product_code","category","unit_of_measure"],
    "VM" :["vendor_code","vendor_name","contact_person","contact_number","vendor_email","gst_number","address"],
    "PO" : ["vendor_code","purchase_order_code","status","created_at"],
    "PI" : ["purchase_invoice_code","grn_code","vendor_code"],
    "GRN" : ["grn_code","purchase_order_code","vendor_code"]
}