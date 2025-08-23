import { useEffect, useState } from "react";

export default function PurchaseOrderModal({ isOpen, onClose, onSave ,editOrder }) {
  const [formData, setFormData] = useState({
    vendor_code: "",
    purchase_date: "",
    expected_date: "",
    status: "Pending",
    total_amount: 0,
    items: [],
  });

  const [newItem, setNewItem] = useState({
    product_code: "",
    quantity: "",
    mrp: "",
    cost_price: "",
    total_price: "",
  });


  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorResults, setVendorResults] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);

  useEffect(()=> {
    if (editOrder) {
      setFormData({ ...editOrder ,
        items: editOrder.items || [],
      });
    }else{
      setFormData({
        vendor_code: "",
        purchase_date: "",
        expected_date: "",
        status: "Pending",
        total_amount: 0,
        items: [],
      });
    }
  }, [editOrder]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (
      newItem.product_code &&
      newItem.quantity &&
      newItem.mrp &&
      newItem.cost_price
    ) {
      const total_price = newItem.quantity * newItem.cost_price;
      const updatedItem = { ...newItem, total_price };
      const updatedItems = [...formData.items, updatedItem];

      const total_amount = updatedItems.reduce(
        (sum, item) => sum + Number(item.total_price),
        0
      );

      setFormData({ ...formData, items: updatedItems, total_amount });
      setNewItem({
        product_code: "",
        quantity: "",
        mrp: "",
        cost_price: "",
        total_price: "",
      });
      setProductSearch(""); 
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);

    const total_amount = updatedItems.reduce(
      (sum, item) => sum + Number(item.total_price),
      0
    );

    setFormData({ ...formData, items: updatedItems, total_amount });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const url  = editOrder ? '/api/purchaseOrder/update-purchase-order' : '/api/purchaseOrder/purchase-order';
      const method = editOrder ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(formData)
      })

       if (!response.ok) {
            throw new Error('Failed to add vendor');
        }
        const data = await response.json();
        console.log(data);
        onSave(data.data);
        onClose();
    } catch (error) {
      console.log("Error in PurchaseOrderModal:", error.message);
    }
  };

  const searchVendors = async (name) => {
    try {
      const res = await fetch(`/api/purchaseOrder/searchVendor?vendorName=${name}`);
      const data = await res.json();
      if (data.success) setVendorResults(data.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const searchProducts = async (name) => {
    try {
      const res = await fetch(`/api/purchaseOrder/searchProduct?productName=${name}`);
      const data = await res.json();
      if (data.success) setProductResults(data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleVendorInput = (e) => {
    const val = e.target.value;
    setVendorSearch(val);
    if (val.length > 1) searchVendors(val);
    else setVendorResults([]);
  };

  const handleProductInput = (e) => {
    const val = e.target.value;
    setProductSearch(val);
    if (val.length > 1) searchProducts(val);
    else setProductResults([]);
  };

  const handleVendorSelect = (vendor) => {
    setFormData((prev) => ({
      ...prev,
      vendor_code: vendor.vendor_code,
    }));
    setVendorSearch(vendor.vendor_name);
    setVendorResults([]);
  };

  const handleProductSelect = (product) => {
    setNewItem((prev) => ({
      ...prev,
      product_code: product.product_code,
    }));
    setProductSearch(product.product_name);
    setProductResults([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[550px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Purchase Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor name
            </label>
            <input
              type="text"
              value={editOrder ? editOrder.vendor_code : vendorSearch}
              onChange={handleVendorInput}
              placeholder="Search vendor..."
              className="w-full p-2 border rounded"
            />
            {vendorResults.length > 0 && (
              <ul className="border rounded mt-1 bg-white max-h-40 overflow-y-auto">
                {vendorResults.map((vendor) => (
                  <li
                    key={vendor.vendor_code}
                    onClick={() => handleVendorSelect(vendor)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {vendor.vendor_name} ({vendor.vendor_code})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="datetime-local"
              name="purchase_date"
              value={editOrder ? editOrder.purchase_date.slice(0, 16) : formData.purchase_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expected Date
            </label>
            <input
              type="datetime-local"
              name="expected_date"
              value={editOrder ? editOrder.expected_date.slice(0, 16) : formData.expected_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
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
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Items</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={productSearch}
                onChange={handleProductInput}
                placeholder="Search product..."
                className="p-2 border rounded"
              />
              {productResults.length > 0 && (
                <ul className="border rounded mt-1 bg-white max-h-40 overflow-y-auto col-span-2">
                  {productResults.map((product) => (
                    <li
                      key={product.product_code}
                      onClick={() => handleProductSelect(product)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {product.product_name} ({product.product_code})
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                placeholder="Quantity"
                className="p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                name="mrp"
                value={newItem.mrp}
                onChange={handleItemChange}
                placeholder="MRP"
                className="p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                name="cost_price"
                value={newItem.cost_price}
                onChange={handleItemChange}
                placeholder="Cost Price"
                className="p-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Add Item
            </button>

            <ul className="mt-3 space-y-2">
              {formData.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>
                    Product {item.product_code} | Qty: {item.quantity} | Cost:{" "}
                    {item.cost_price} | Total: {item.total_price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="number"
              readOnly
              value={formData.total_amount}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
