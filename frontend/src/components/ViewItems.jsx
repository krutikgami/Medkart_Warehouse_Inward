import { useLocation } from "react-router-dom";

const ViewItems = () => {
    const location = useLocation();
    const {items,label,code} = location?.state || {};
  const columnsConfig = {
    purchaseOrder: [
      { key: "product_code", label: "Product Code" },
      { key: "quantity", label: "Quantity" },
      { key: "mrp", label: "MRP" },
      { key: "cost_price", label: "Cost Price" },
      { key: "total_price", label: "Total Price" },
    ],
    grn: [
      { key: "product_code", label: "Product Code" },
      { key: "quantity", label: "Quantity" },
      { key: "mrp", label: "MRP" },
      { key: "cost_price", label: "Cost Price" },
      { key: "total_price", label: "Total Price" },
      { key: "damage_qty", label: "Damage Qty" },
      { key: "shortage_qty", label: "Shortage Qty" },
      { key: "batch_number", label: "Batch No." },
      { key: "mfg_date", label: "MFG Date" },
      { key: "exp_date", label: "EXP Date" },
    ],
    purchaseInvoice: [
      { key: "product_code", label: "Product Code" },
      { key: "quantity", label: "Quantity" },
      { key: "mrp", label: "MRP" },
      { key: "cost_price", label: "Cost Price" },
      { key: "total_price", label: "Total Price" },
    ],
  };

  const selectedColumns = columnsConfig[label] || [];

  const labelCode = {
    purchaseOrder: "Purchase Order Code",
    grn: "GRN Code",
    purchaseInvoice: "Invoice Code",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items Details</h1>
      <div className="mb-6">
        <button className="bg-gray-300 text-black px-4 py-2 rounded mb-4 cursor-pointer" onClick={() => window.history.back()}>
          &larr; Back
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {labelCode[label]}
        </label>
        <input
          type="text"
          value={code || ""}
          readOnly
          className="w-56 border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {selectedColumns.map((col) => (
                <th
                  key={col.key}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {selectedColumns.map((col) => (
                    <td
                      key={col.key}
                      className="border border-gray-300 px-4 py-2 text-sm"
                    >
                      {col.key === 'mfg_date' || col.key === 'exp_date' ? (
                        <span>
                          {item[col.key] ? item[col.key].split('T')[0] : ''}
                        </span>
                      ) : (
                        <span>
                          {item[col.key] ?? ""}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={selectedColumns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewItems;
