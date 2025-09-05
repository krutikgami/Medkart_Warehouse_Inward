export const defaultEndPoint = "http://localhost:3000";
export const literal = "/api";
export const AllEndPoints = Object.freeze({
    productEndPoints:{
        getProducts : `${literal}/productMaster/all-products`,
        createProduct : `${literal}/productMaster/product`,
        updateProduct : `${literal}/productMaster/update-product`,
        deleteProduct : `${literal}/productMaster/delete-product`,
    },
    vendorEndPoints:{
        getVendors : `${literal}/vendorMaster/all-vendors`,
        createVendor : `${literal}/vendorMaster/vendor`,
        updateVendor : `${literal}/vendorMaster/update-vendor`,
        deleteVendor : `${literal}/vendorMaster/delete-vendor`,
    },
    purchaseOrderEndPoints:{
        getPurchaseOrders : `${literal}/purchaseOrder/allPurchaseOrder`,
        createPurchaseOrder : `${literal}/purchaseOrder/purchase-order`,
        updatePurchaseOrder : `${literal}/purchaseOrder/update-purchase-order`,
        deletePurchaseOrder : `${literal}/purchaseOrder/delete-purchase-order`,
    },
    grnEndPoints:{
        getGrns : `${literal}/goodsReceiptNote/get-all-grns`,
        createGrn : `${literal}/goodsReceiptNote/add-grn`,
        updateGrn : `${literal}/goodsReceiptNote/edit-grn`,
        deleteGrn : `${literal}/goodsReceiptNote/delete-grn`,
    },
    purchaseInvoiceEndpoints:{
        getPurchaseInvoices : `${literal}/purchaseInvoice/getAll-purchase-invoices`,
        createPurchaseInvoice : `${literal}/purchaseInvoice/create-purchase-invoice`,
        updatePurchaseInvoice : `${literal}/purchaseInvoice/update-purchase-invoice`,
        deletePurchaseInvoice : `${literal}/purchaseInvoice/delete-purchase-invoice`,
    },

});