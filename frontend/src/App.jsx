import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import ProductMaster from "./pages/ProductMaster";
import VendorMaster from "./pages/VendorMaster";
import PurchaseOrder from "./pages/PurchaseOrder";
import PurchaseOrderForm from "./pages/AddPurchaseOrder";
import GrnForm from "./pages/GrnForm";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductMaster />} />
            <Route path="/vendors" element={<VendorMaster />} />
            <Route path="/purchase-orders" element={<PurchaseOrder />} />
            <Route path="/add-purchase-order" element={<PurchaseOrderForm />} />
            <Route path="/add-grn" element={<GrnForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
