import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function PurchaseOrderForm() {
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

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state && state.order) {
      setFormData({
        ...state.order,
        items: state.order.items || [],
      });
    } else {
      setFormData({
        vendor_code: "",
        purchase_date: "",
        expected_date: "",
        status: "Pending",
        total_amount: 0,
        items: [],
      });
    }
  }, [state]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = state && state.order
        ? "/api/purchaseOrder/update-purchase-order"
        : "/api/purchaseOrder/purchase-order";
      const method = state && state.order ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save purchase order");
      }
      const data = await response.json();
      console.log(data);
      navigate('/purchase-orders')
    } catch (error) {
      console.log("Error in PurchaseOrderForm:", error.message);
    }
  };

  const searchVendors = async (name) => {
    try {
      const res = await fetch(
        `/api/purchaseOrder/searchVendor?vendorName=${name}`
      );
      const data = await res.json();
      if (data.success) setVendorResults(data.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const searchProducts = async (name) => {
    try {
      const res = await fetch(
        `/api/purchaseOrder/searchProduct?productName=${name}`
      );
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
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="mx-auto max-w-4xl px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Purchase Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor name
            </label>
            <input
              type="text"
              value={state && state.order ? state.order.vendor_code : vendorSearch}
              onChange={handleVendorInput}
              placeholder="Search vendor..."
              className="w-full p-2 border rounded"
            />
            {vendorResults.length > 0 && (
              <ul className="border rounded mt-1 bg-white max-h-40 overflow-y-auto w-full">
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
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="datetime-local"
              name="purchase_date"
              value={state && state.order ? state.order.purchase_date.slice(0, 16) : formData.purchase_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Date
            </label>
            <input
              type="datetime-local"
              name="expected_date"
              value={state && state.order ? state.order.expected_date.slice(0, 16) : formData.expected_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Items</h3>

          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={handleProductInput}
                placeholder="Search product..."
                className="w-full p-2 border rounded"
              />
              {productResults.length > 0 && (
                <ul className="border rounded mt-1 bg-white max-h-40 overflow-y-auto w-full">
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
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                placeholder="Qty"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRP
              </label>
              <input
                type="number"
                step="0.01"
                name="mrp"
                value={newItem.mrp}
                onChange={handleItemChange}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price
              </label>
              <input
                type="number"
                step="0.01"
                name="cost_price"
                value={newItem.cost_price}
                onChange={handleItemChange}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Add Item
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {formData.items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>
                  Product {item.product_code} | Qty: {item.quantity} | Cost: {item.cost_price} | Total: {item.total_price}
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

        <div className="flex justify-end">
          <div className="w-48">
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

        <div className="flex items-center justify-between">
          <Link
            to="/purchase-orders"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
