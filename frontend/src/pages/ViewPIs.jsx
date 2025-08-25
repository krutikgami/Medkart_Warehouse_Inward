import { useState, useEffect } from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewPIs = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseInvoices = async () => {
      try {
        const response = await fetch("/api/purchaseInvoice/getAll-purchase-invoices");
        const data = await response.json();
        setPurchaseInvoices(data.data || []);
      } catch (error) {
        console.error("Error fetching Purchase Invoices:", error);
      }
    };
    fetchPurchaseInvoices();
  }, []);

  const handleEditPI = (pi) => {
    navigate("/add-pi", { state: { grn : pi, isEdit: true } });
  };

  const handleDeletePI = async (piCode) => {
    try {
      const response = await fetch("/api/purchaseInvoice/delete-purchase-invoice", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_invoice_code: piCode }),
      });

      const data = await response.json();

      if (data.success) {
        setPurchaseInvoices(
          purchaseInvoices.filter((pi) => pi.purchase_invoice_code !== piCode)
        );
      } else {
        console.error("Failed to delete PI:", data.message);
      }
    } catch (error) {
      console.error("Error deleting PI:", error);
    }
  };

  const filteredPIs = purchaseInvoices.filter((pi) => {
    const matchesSearch =
      pi.purchase_invoice_code
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      pi.grn_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pi.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      pi.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Purchase Invoice Master</h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by PI, GRN, Vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Partially Completed">Partially Completed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">PI Code</th>
              <th className="p-2 border">GRN Code</th>
              <th className="p-2 border">Vendor Code</th>
              <th className="p-2 border">Invoice Date</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredPIs.length > 0 ? (
              filteredPIs.map((pi, idx) => (
                <tr key={pi.id} className="text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{pi.purchase_invoice_code}</td>
                  <td className="p-2 border">{pi.grn_code}</td>
                  <td className="p-2 border">{pi.vendor_code}</td>
                  <td className="p-2 border">
                    {pi.invoice_date.split("T")[0]}
                  </td>
                  <td className="p-2 border">₹{pi.total_amount}</td>
                  <td className="p-2 border">{pi.status}</td>
                  <td className="p-2 border flex items-center justify-center gap-2">
                    <button
                      className="text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600 cursor-pointer"
                      onClick={() => handleEditPI(pi)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this Purchase Invoice?"
                          )
                        ) {
                          handleDeletePI(pi.purchase_invoice_code);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate("/view-items", {
                          state: {
                            items: pi.items,
                            label: "purchaseInvoice",
                            code: pi.purchase_invoice_code,
                          },
                        })
                      }
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center" colSpan={9}>
                  No Purchase Invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPIs;
