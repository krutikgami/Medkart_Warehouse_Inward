import { useEffect, useState } from "react";

export default function ProductModal({ isOpen, onClose, onSave, editProduct }) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_mrp: "",
    hsn_code: "",
    gst_percent: 0,
    category: "",
    unit_of_measure: "",
    product_last_purchase_price: "",
    status: "Active", 
    combination: [],
  });

  const [newCombination, setNewCombination] = useState("");

  useEffect(()=>{
    if (editProduct) {
      setFormData(editProduct);
    }else{
      setFormData({
        product_name: "",
        product_description: "",
        product_price: "",
        product_mrp: "",
        hsn_code: "",
        gst_percent: 0,
        category: "",
        unit_of_measure: "",
        product_last_purchase_price: "",
        status: "Active", 
        combination: [],
      });
    }
  }, [editProduct]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCombination = () => {
    if (newCombination.trim() !== "") {
      setFormData({
        ...formData,
        combination: [...formData.combination, newCombination],
      });
      setNewCombination("");
    }
  };

  const handleRemoveCombination = (index) => {
    const updated = [...formData.combination];
    updated.splice(index, 1);
    setFormData({ ...formData, combination: updated });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
       const url = editProduct
      ? "/api/productMaster/update-product"
      : "/api/productMaster/product";
    const method = editProduct ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onSave(data.data);
        onClose();
      } else {
        alert(data.message || "Error saving product");
        console.error("Error saving:", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (

 <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm z-50">
  <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] border border-gray-500">

  <h2 className="text-xl font-semibold mb-4">Add Product</h2>
  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <label className="block text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Product Description</label>
        <textarea
          name="product_description"
          placeholder="Product Description"
          rows={2}
          value={formData.product_description}
          onChange={handleChange}
          className="w-full p-2 border rounded resize-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Product Price</label>
        <input
          type="number"
          step="0.01"
          name="product_price"
          placeholder="Price"
          value={formData.product_price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Product MRP</label>
        <input
          type="number"
          name="product_mrp"
          placeholder="MRP"
          value={formData.product_mrp}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Last Purchase Price</label>
        <input
          type="number"
          name="product_last_purchase_price"
          placeholder="Last Purchase Price"
          value={formData.product_last_purchase_price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">HSN Code</label>
        <input
          type="text"
          name="hsn_code"
          placeholder="HSN Code"
          value={formData.hsn_code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>


      <div>
        <label className="block text-gray-700 mb-1">GST %</label>
        <input
          type="text"
          name="gst_percent"
          placeholder="GST %"
          value={formData.gst_percent}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>


      <div>
        <label className="block text-gray-700 mb-1">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Unit of Measure</label>
        <input
          type="text"
          name="unit_of_measure"
          placeholder="Unit of Measure"
          value={formData.unit_of_measure}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

        <div className="col-span-2">
        <label className="block text-gray-700 mb-1">Combinations</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newCombination}
            onChange={(e) => setNewCombination(e.target.value)}
            placeholder="Add Combination"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddCombination}
            className="px-3 py-2 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.combination.map((combo, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-gray-200 border rounded-full px-3 py-1 text-sm"
            >
              {combo}
              <button
                type="button"
                onClick={() => handleRemoveCombination(index)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        </div>

      <div className="col-span-2 flex justify-end gap-3 mt-4 border-t pt-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
      </div>
    </div>
  );
}
