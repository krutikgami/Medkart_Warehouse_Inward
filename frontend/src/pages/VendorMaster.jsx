import { useState, useEffect } from "react";
import VendorModal from "../components/modals/VendorModal";
import { Pencil, Trash2 } from "lucide-react";

const VendorMaster = () => {
  const [vendors, setVendors] = useState([]);
  const [editVendor, setEditVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await fetch("/api/vendorMaster/all-vendors");
      const data = await response.json();
      setVendors(data.data || []);
    };
    fetchVendors();
  }, []);

  const handleSave = (newVendor) => {
    if (editVendor) {
      setVendors((prev) =>
        prev.map((v) => (v.vendor_code === newVendor.vendor_code ? newVendor : v))
      );
      setEditVendor(null);
    } else {
      setVendors([newVendor, ...vendors]);
    }
  };

  const handleEdit = (vendor) => {
    setEditVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = async (vendorCode) => {
    try {
      const response = await fetch("/api/vendorMaster/delete-vendor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_code: vendorCode }),
      });

      const data = await response.json();

      if (data.success) {
        setVendors(vendors.filter((v) => v.vendor_code !== vendorCode));
      } else {
        console.error("Failed to delete vendor:", data.message);
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gst_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || v.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Vendor Master</h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by code, name, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            onClick={() => {
              setEditVendor(null);
              setIsModalOpen(true);
            }}
          >
            + Add New Vendor
          </button>
        </div>
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditVendor(null);
        }}
        onSave={handleSave}
        editVendor={editVendor}
      />

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contact Person</th>
              <th className="p-2 border">Contact Number</th>
              <th className="p-2 border">Vendor Email</th>
              <th className="p-2 border">GST</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((v,idx) => (
                <tr key={v.id} className="text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{v.vendor_code}</td>
                  <td className="p-2 border">{v.vendor_name}</td>
                  <td className="p-2 border">{v.contact_person}</td>
                  <td className="p-2 border">{v.contact_number}</td>
                  <td className="p-2 border">{v.vendor_email}</td>
                  <td className="p-2 border">{v.gst_number}</td>
                  <td className="p-2 border">{v.address}</td>
                  <td className="p-2 border">{v.status}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 cursor-pointer"
                      onClick={() => handleEdit(v)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this vendor?")) {
                          handleDelete(v.vendor_code);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center" colSpan={9}>
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorMaster;
