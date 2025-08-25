import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import ProductMaster from "./pages/ProductMaster";
import VendorMaster from "./pages/VendorMaster";
import PurchaseOrder from "./pages/PurchaseOrder";
import PurchaseOrderForm from "./pages/AddPurchaseOrder";
import GrnForm from "./pages/GrnForm";
import ViewGrns from "./pages/ViewGrns";
import ViewPIs from "./pages/ViewPIs";
import PurchaseInvoiceForm from "./pages/PurchaseInvoiceForm";
import ViewItems from "./components/ViewItems";

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
            <Route path="/view-grns" element={<ViewGrns />} />
            <Route path="/add-pi" element={<PurchaseInvoiceForm />} />
            <Route path="/view-invoices" element={<ViewPIs />} />
            <Route path="/view-items" element={<ViewItems />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
