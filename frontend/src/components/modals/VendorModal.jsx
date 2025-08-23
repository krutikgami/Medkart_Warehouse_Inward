import { useEffect, useState } from "react";

export default function VendorModal({ isOpen, onClose, onSave ,editVendor }) {
  const [formData, setFormData] = useState({
    vendor_name: "",
    contact_person: "",
    contact_number: "",
    vendor_email: "",
    gst_number: "",
    address: "",
    status: "Active", 
  });

  useEffect(()=>{
    if (editVendor) {
      setFormData(editVendor);
    }else{
      setFormData({
        vendor_name: "",
        contact_person: "",
        contact_number: "",
        vendor_email: "",
        gst_number: "",
        address: "",
        status: "Active", 
      });
    }
  }, [editVendor]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {

      const url  = editVendor ? '/api/vendorMaster/update-vendor' : '/api/vendorMaster/vendor';
      const method = editVendor ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to add vendor');
        }

        const data = await response.json();
        console.log(data);
        onSave(data.data);
        onClose();
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] border border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Add Vendor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Name</label>
            <input
              type="text"
              name="vendor_name"
              placeholder="Enter vendor name"
              value={formData.vendor_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              placeholder="Enter contact person"
              value={formData.contact_person}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="number"
              name="contact_number"
              placeholder="Enter contact number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vendor Email</label>
            <input
              type="email"
              name="vendor_email"
              placeholder="Enter vendor email"
              value={formData.vendor_email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GST Number</label>
            <input
              type="text"
              name="gst_number"
              placeholder="Enter GST number"
              value={formData.gst_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
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
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-2 flex justify-end space-x-3 mt-4 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

  );
}
