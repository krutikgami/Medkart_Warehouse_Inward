import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isView, setIsView] = useState({
    status: false,
    value: null
  });


  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      const response = await fetch("/api/purchaseOrder/allPurchaseOrder");
      const data = await response.json();
      setOrders(data.data || []);
    };
    fetchPurchaseOrder();
  }, []);

  const handleEdit = (order) => {
    navigate('/add-purchase-order', { state: { grn: order } });
  };

  const handleDelete = async (orderCode) => {
    try {
      const response = await fetch("/api/purchaseOrder/delete-purchase-order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchase_order_code: orderCode }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(orders.filter((o) => o.purchase_order_code !== orderCode));
      } else {
        console.error("Failed to delete order:", data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.purchase_order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || o.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h1 className="text-2xl font-bold">Purchase Orders</h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by vendor, code, status..."
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
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            onClick={() => {
              navigate('/add-purchase-order')
            }}
          >
            + Add New Order
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Vendor Code</th>
              <th className="p-2 border">PO Code</th>
              <th className="p-2 border">Purchase Date</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Expected Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Operations</th>
              <th className="p-2 border">Products</th>
              <th className="p-2 border">GRN</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o,idx) => (
                <tr key={o.id} className="text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{o.vendor_code}</td>
                  <td className="p-2 border">{o.purchase_order_code}</td>
                  <td className="p-2 border">
                    {o.purchase_date?.split("T")[0]}
                  </td>
                  <td className="p-2 border">₹{o.total_amount}</td>
                  <td className="p-2 border">
                    {o.expected_date?.split("T")[0]}
                  </td>
                  <td className="p-2 border">{o.status}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 cursor-pointer"
                      onClick={() => handleEdit(o)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to delete this order?")
                        ) {
                          handleDelete(o.purchase_order_code);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  <td className="p-2 border">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => setIsView({
                      status: true,
                      value: idx
                    })}>View</button>
                  </td>
                  <td className="p-2 border">
                    <button className="bg-purple-500 text-white px-2 py-1 rounded" onClick={() => navigate('/add-grn', { state: { order: o } })}>
                      + Add GRN
                    </button>
                  </td>
                </tr>
              
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center" colSpan={8}>
                  No purchase orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isView.status && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              {orders[isView.value]?.items.map(item => (
                <div key={item.id} className="border-b py-2">
                  <p><strong>Product Code:</strong> {item.product_code}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>MRP:</strong> ₹{item.mrp}</p>
                  <p><strong>Cost Price:</strong> ₹{item.cost_price}</p>
                  <p><strong>Total Price:</strong> ₹{item.total_price}</p>
                </div>
              ))}
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setIsView(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
    </>
  );
};

export default PurchaseOrder;
