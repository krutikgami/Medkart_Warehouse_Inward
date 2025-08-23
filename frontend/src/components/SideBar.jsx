import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold">Open Admin</div>
      <nav className="flex-1">
        <ul>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-6 py-3 ${
                  isActive ? "bg-white text-gray-900 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block px-6 py-3 ${
                  isActive ? "bg-white text-gray-900 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Product Master
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendors"
              className={({ isActive }) =>
                `block px-6 py-3 ${
                  isActive ? "bg-white text-gray-900 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Vendor Master
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/purchase-orders"
              className={({ isActive }) =>
                `block px-6 py-3 ${
                  isActive ? "bg-white text-gray-900 font-semibold" : "hover:bg-gray-700"
                }`
              }
            >
              Purchase Order
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
