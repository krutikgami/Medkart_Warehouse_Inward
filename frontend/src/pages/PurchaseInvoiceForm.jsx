import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PurchaseInvoiceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {grn} = location.state || {};
  const isEdit = location.state?.isEdit || false;

  console.log('GRN ' , grn)

  const [formData, setFormData] = useState({
    purchase_invoice_code: isEdit ? grn?.purchase_invoice_code : "",
    grn_code: grn?.grn_code || "",
    purchase_order_code: grn?.purchase_order_code || "",
    vendor_code: grn?.vendor_code || "",
    invoice_date: new Date().toISOString().slice(0, 16),
    total_amount: grn?.total_amount || 0,
    status: grn?.status || "Pending",
    items:
      grn?.items?.map((item) => ({
        product_code: item.product_code,
        quantity: item.quantity,
        mrp: item.mrp,
        cost_price: item.cost_price,
        total_price: item.total_price,
      })) || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (["quantity", "cost_price"].includes(field)) {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const cost = parseFloat(newItems[index].cost_price) || 0;
      const subtotal = qty * cost;
      newItems[index].total_price = subtotal;
    }

    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce(
        (sum, item) => sum + (parseFloat(item.total_price) || 0),
        0
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit
        ? "/api/purchaseInvoice/update-purchase-invoice"
        : "/api/purchaseInvoice/create-purchase-invoice";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEdit ? "Invoice updated successfully" : "Invoice created successfully");
        navigate("/view-invoices");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving Invoice:", error);
      alert("Error saving Invoice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Purchase Invoice
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GRN Code
              </label>
              <input
                type="text"
                name="grn_code"
                value={formData.grn_code}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                readOnly={isEdit}
              />
            </div>
            {!isEdit && (<div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order Code
              </label>
              <input
                type="text"
                name="purchase_order_code"
                value={formData.purchase_order_code}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            )}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Code
              </label>
              <input
                type="text"
                name="vendor_code"
                value={formData.vendor_code}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="datetime-local"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded"
                >
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Product</label>
                    <input
                      type="text"
                      value={item.product_code}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Qty</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Mrp</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.mrp}
                      onChange={(e) =>
                        handleItemChange(index, "mrp", e.target.value)
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.cost_price}
                      onChange={(e) =>
                        handleItemChange(index, "cost_price", e.target.value)
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Total</label>
                    <input
                      type="number"
                      readOnly
                      value={item.total_price}
                      className="w-full p-2 border rounded bg-gray-100 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                readOnly
                value={formData.total_amount}
                className="w-full p-2 border rounded bg-gray-100 text-right"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/view-invoices")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseInvoiceForm;
