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
    "PO" : ["vendor_code","purchase_order_code","status","created_at","vendorMaster.vendor_name"],
    "PI" : ["purchase_invoice_code","grn_code","vendor_code","vendorMaster.vendor_name"],
    "GRN" : ["grn_code","purchase_order_code","vendor_code","vendorMaster.vendor_name"]
}

export const dbFiltercols = {
    'PM' : {
        "Name" : "product_name",
        "Description" : "product_description",
        "Code" : "product_code",
        "Category" : "category",
        "UnitOfMeasure" : "unit_of_measure",
        "GST%" : "gst_percent"
    },
    "VM" : {
        "Name" : "vendor_name",
        "Code" : "vendor_code",
        "Phone no" : "contact_number",
        "Email" : "vendor_email",
        "Gst No" : "gst_number",
        "address" : "address"
    },
    "PO" : {
        "VEN Code" : "vendor_code",
        "PO Code" : "purchase_order_code",
        "VEN Name" : "vendorMaster.vendor_name"
    },
    "GRN" : {
        "Code" : "grn_code",
        "PO Code" : "purchase_order_code",
        "VEN Code" : "vendor_code",
        "VEN Name" : "vendorMaster.vendor_name"
    },
    "PI" : {
        "Code" : "purchase_invoice_code",
        "GRN Code" : "grn_code",
        "VEN Code" : "vendor_code",
        "VEN Name" : "vendorMaster.vendor_name"
    }
}