import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GrnForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let order ;
  const isEdit = location.state?.isEdit || false;
  if(isEdit){
    order = location.state?.grn || {};
  }else{
    order = location.state?.order || {};
  }
  const [formData, setFormData] = useState({
    purchase_order_code: order?.purchase_order_code || "",
    vendor_code: order?.vendor_code || "",
    grn_date: new Date().toISOString().slice(0, 16),
    total_amount: order?.total_amount || 0,
    total_damage_qty: 0,
    total_shortage_qty: 0,
    grn_code: order?.grn_code || "",
    items: order?.items?.map((item) => ({
      product_code: item.product_code,
      quantity: item.quantity,
      mrp: item.mrp,
      cost_price: item.cost_price,
      total_price: item.total_price,
      damage_qty: 0,
      shortage_qty: 0,
      batch_number: "",
      mfg_date: isEdit ? order.items.find(i => i.product_code === item.product_code)?.mfg_date?.split('T')[0] || "" : "",
      exp_date: isEdit ? order.items.find(i => i.product_code === item.product_code)?.exp_date?.split('T')[0] || "" : "",
    })) || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "cost_price") {
      newItems[index].total_price =
        (parseFloat(newItems[index].quantity) || 0) *
        (parseFloat(newItems[index].cost_price) || 0);
    }

    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce(
        (sum, item) => sum + (parseFloat(item.total_price) || 0),
        0
      ),
      total_damage_qty: newItems.reduce(
        (sum, item) => sum + (parseInt(item.damage_qty) || 0),
        0
      ),
      total_shortage_qty: newItems.reduce(
        (sum, item) => sum + (parseInt(item.shortage_qty) || 0),
        0
      ),
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const url = isEdit ? "/api/goodsReceiptNote/edit-grn" : "/api/goodsReceiptNote/add-grn";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (isEdit) {
          console.log("GRN updated successfully:", data);
          alert("GRN updated successfully");
        } else {
          console.log("GRN created successfully:", data);
          alert("GRN created successfully");
        }

        isEdit ? navigate("/view-grns") : navigate("/purchase-orders");
      } else {
        if (isEdit) {
          console.error("Failed to update GRN:", data.message);
          alert("Failed to update GRN: " + data.message);
          return;
        }
        console.error("Failed to create GRN:", data.message);
        alert("Failed to create GRN: " + data.message);
      }
    } catch (error) {
      console.error("Error creating GRN:", error);
      alert("Error creating GRN. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Goods Receipt Note (GRN)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order
              </label>
              <input
                type="text"
                name="purchase_order_code"
                value={formData.purchase_order_code}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
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
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GRN Date
              </label>
              <input
                type="datetime-local"
                name="grn_date"
                value={formData.grn_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        
          <div>
            <h3 className="text-lg font-medium mb-3">Items</h3>
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
                  <div className="col-span-1">
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
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-700">MRP</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.mrp}
                      onChange={(e) =>
                        handleItemChange(index, "mrp", e.target.value)
                      }
                      className="w-full p-2 border rounded bg-gray-100 text-center"
                    />
                  </div>
                  <div className="col-span-1">
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
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-700">Damage</label>
                    <input
                      type="number"
                      value={item.damage_qty}
                      onChange={(e) =>
                        handleItemChange(index, "damage_qty", e.target.value)
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-700">Shortage</label>
                    <input
                      type="number"
                      value={item.shortage_qty}
                      onChange={(e) =>
                        handleItemChange(index, "shortage_qty", e.target.value)
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700">Batch No.</label>
                    <input
                      type="text"
                      value={item.batch_number}
                      onChange={(e) =>
                        handleItemChange(index, "batch_number", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-700">MFG</label>
                    <input
                      type="date"
                      value={item.mfg_date}
                      onChange={(e) =>
                        handleItemChange(index, "mfg_date", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-700">EXP</label>
                    <input
                      type="date"
                      value={item.exp_date}
                      onChange={(e) =>
                        handleItemChange(index, "exp_date", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-1">
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
            <div className="col-span-3">
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
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Damage Qty
              </label>
              <input
                type="number"
                readOnly
                value={formData.total_damage_qty}
                className="w-full p-2 border rounded bg-gray-100 text-right"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Shortage Qty
              </label>
              <input
                type="number"
                readOnly
                value={formData.total_shortage_qty}
                className="w-full p-2 border rounded bg-gray-100 text-right"
              />
            </div>
            {/* <div className="col-span-3">
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
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div> */}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => isEdit ? navigate("/view-grns") : navigate("/purchase-orders")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save GRN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrnForm;
