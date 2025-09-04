export const ProductHeading = [
  { key: 'id', label: 'ID' },
  { key: 'product_code', label: 'Code' },
  { key: 'product_name', label: 'Name' },
  { key: 'product_description', label: 'Description' },
  { key: 'product_price', label: 'Price', render: (val) => `₹${val}` },
  { key: 'product_mrp', label: 'MRP' },
  { key: 'product_last_purchase_price', label: 'Last Price' },
  { key: 'hsn_code', label: 'HSN Code' },
  { key: 'gst_percent', label: 'GST %' },
  { key: 'category', label: 'Category' },
  {
    key: 'combination',
    label: 'Combination',
    render: (val) => (Array.isArray(val) ? val.join(', ') : ''),
  },
  { key: 'unit_of_measure', label: 'Unit' },
  { key: 'status', label: 'Status' },
  { key: 'operations', label: 'Operations', isAction: true },
]

export const VendorHeading = [
  { key: 'id', label: 'ID' },
  { key: 'vendor_code', label: 'Code' },
  { key: 'vendor_name', label: 'Name' },
  { key: 'contact_person', label: 'Contact Person' },
  { key: 'contact_number', label: 'Contact Number' },
  { key: 'vendor_email', label: 'Vendor Email' },
  { key: 'gst_number', label: 'GST' },
  { key: 'address', label: 'Address' },
  { key: 'status', label: 'Status' },
  { key: 'operations', label: 'Operations', isAction: true },
]

export const PurchaseOrderHeading = [
  { key: 'id', label: 'ID' },
  { key: 'purchase_order_code', label: 'PO Code' },
  { key: 'vendor_code', label: 'Vendor Code' },
  { key: 'vendor_name', label: 'Vendor Name' },
  {
    key: 'purchase_date',
    label: 'Purchase Date',
    render: (val) => val?.split('T')[0],
  },
  { key: 'total_amount', label: 'Total Amount', render: (val) => `₹${val}` },
  {
    key: 'expected_date',
    label: 'Expected Date',
    render: (val) => val?.split('T')[0],
  },
  { key: 'status', label: 'Status' },
  { key: 'operations', label: 'Operations', isAction: true },
  { key: 'grn', label: 'GRN', isAction: true },
]

export const GrnHeading = [
  { key: 'id', label: 'ID' },
  { key: 'grn_code', label: 'GRN Code' },
  { key: 'purchase_order_code', label: 'PO Code' },
  { key: 'vendor_code', label: 'Vendor Code' },
  { key: 'vendor_name', label: 'Vendor Name' },
  { key: 'grn_date', label: 'GRN Date',
    render: (val) => val?.split('T')[0]
   },
  { key: 'total_amount', label: 'Total Amount' },
  { key: 'status', label: 'Status' },
  { key: 'total_damage_qty', label: 'Damage Qty' },
  { key: 'total_shortage_qty', label: 'Shortage Qty' },
  { key: 'operations', label: 'Operations', isAction: true },
  { key: 'pi', label: 'PI', isAction: true },
]

export const PurchaseInvoiceHeading = [
  { key: 'id', label: 'ID' },
  { key: 'purchase_invoice_code', label: 'PI Code' },
  { key: 'grn_code', label: 'GRN Code' },
  { key: 'vendor_code', label: 'Vendor Code' },
    { key: 'vendor_name', label: 'Vendor Name' },
  { key: 'invoice_date', label: 'Invoice Date',
    render: (val) => val?.split('T')[0]
  },
  { key: 'total_amount', label: 'Total Amount' },
  { key: 'status', label: 'Status' },
  { key: 'operations', label: 'Operations', isAction: true },
]
