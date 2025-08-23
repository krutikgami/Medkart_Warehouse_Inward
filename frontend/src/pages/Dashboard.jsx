import { useState,useEffect } from "react";
const Dashboard = () => {

const [totalCounts, setTotalCounts] = useState({
    purchaseOrders: 0,
    vendors: 0,
    products: 0
});


useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('/api/total-counts');
            const data = await response.json();
            if (data.success) {
                setTotalCounts(data.data);
            } else {
                console.error("Failed to fetch total counts:", data.message);
            }
        } catch (error) {
            console.error("Error fetching total counts:", error);
        }
    };

    fetchData();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold">Total Purchase Orders</h2>
          <p className="text-3xl font-bold mt-2">{totalCounts.purchaseOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold">Total Vendors</h2>
          <p className="text-3xl font-bold mt-2">{totalCounts.vendors}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{totalCounts.products}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
