import { useState, useEffect } from "react";
import { Eye, Trash2,Pencil} from "lucide-react";
import { useNavigate } from "react-router-dom";


const ViewGrns = () => {
  const [grns, setGrns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewOpen, setViewOpen] = useState({
    status : false,
    items : []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const response = await fetch("/api/goodsReceiptNote/get-all-grns");
        const data = await response.json();
        setGrns(data.data || []);
      } catch (error) {
        console.error("Error fetching GRNs:", error);
      }
    };
    fetchGrns();
  }, []);

  const handleEditGrn = async (grn) => {
    navigate('/add-grn', { state: { grn, isEdit: true } });
  };

  const handleDeleteGrn = async (grnCode) => {
    try {
      const response = await fetch("/api/goodsReceiptNote/delete-grn", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grn_code: grnCode }),
      });

      const data = await response.json();

      if (data.success) {
        setGrns(grns.filter((g) => g.grn_code !== grnCode));
      } else {
        console.error("Failed to delete GRN:", data.message);
      }
    } catch (error) {
      console.error("Error deleting GRN:", error);
    }
  };

  const filteredGrns = grns.filter((g) => {
    const matchesSearch =
      g.grn_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.purchase_order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || g.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">GRN Master</h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by GRN, PO, Vendor..."
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
              <th className="p-2 border">GRN Code</th>
              <th className="p-2 border">PO Code</th>
              <th className="p-2 border">Vendor Code</th>
              <th className="p-2 border">GRN Date</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Damage Qty</th>
              <th className="p-2 border">Shortage Qty</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Operations</th>
              <th className="p-2 border">PI</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrns.length > 0 ? (
              filteredGrns.map((g, idx) => (
                <tr key={g.id} className="text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{g.grn_code}</td>
                  <td className="p-2 border">{g.purchase_order_code}</td>
                  <td className="p-2 border">{g.vendor_code}</td>
                  <td className="p-2 border">
                    {g.grn_date.split('T')[0]}
                  </td>
                  <td className="p-2 border">₹{g.total_amount}</td>
                  <td className="p-2 border">{g.status}</td>
                  <td className="p-2 border">{g.total_damage_qty}</td>
                  <td className="p-2 border">{g.total_shortage_qty}</td>
                    <td className="p-2 border">
                        <button
                            className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                            onClick={()=>setViewOpen({
                                status : true,
                                items : g.items
                            })}
                        >
                            <Eye size={16} />
                        </button>
                    </td>
                    <td className="p-2 border justify-center gap-2 flex">
                        <button
                            className="text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600 cursor-pointer"
                            onClick={() => handleEditGrn(g)}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this GRN?")) {
                                    handleDeleteGrn(g.grn_code);
                                }
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                    <td className="p-2 border">
                        <button className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 cursor-pointer" onClick={() => navigate('/add-pi', { state: { grn: g ,isEdit:false} })}>
                           + PI
                        </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center" colSpan={9}>
                  No GRNs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
         {viewOpen.status && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Grn items Details</h2>
              {viewOpen.items.map(item => (
                <div key={item.id} className="border-b py-2">
                  <p><strong>Product Code:</strong> {item.product_code}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>MRP:</strong> ₹{item.mrp}</p>
                  <p><strong>Cost Price:</strong> ₹{item.cost_price}</p>
                  <p><strong>Total Price:</strong> ₹{item.total_price}</p>
                    <p><strong>Damage Qty:</strong> {item.damage_qty}</p>
                    <p><strong>Shortage Qty:</strong> {item.shortage_qty}</p>
                    <p><strong>Batch Number:</strong> {item.batch_number}</p>
                    <p><strong>Mfg Date:</strong> {item.mfg_date.split('T')[0]}</p>
                    <p><strong>Exp Date:</strong> {item.exp_date.split('T')[0]}</p>
                </div>
              ))}
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setViewOpen({ status: false, items: [] })}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGrns;
