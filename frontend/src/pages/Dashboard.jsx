import { useState, useEffect } from "react";

const Dashboard = () => {
  const [totalCounts, setTotalCounts] = useState({
    purchaseOrders: 0,
    vendors: 0,
    products: 0,
    grns: 0,
    purchaseInvoices: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/total-counts");
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

  const cards = [
    { title: "Total Purchase Orders", value: totalCounts.purchaseOrders },
    { title: "Total Vendors", value: totalCounts.vendors },
    { title: "Total Products", value: totalCounts.products },
    { title: "Total GRNs", value: totalCounts.grns },
    { title: "Total Purchase Invoices", value: totalCounts.purchaseInvoices },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#1E3A8A] text-white shadow-lg rounded-2xl p-6 transition-transform transform hover:scale-105"
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
