import ProductModal from "../components/modals/ProductModal";
import { useState,useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
const ProductMaster = () => {
    const [products, setProducts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

   const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleSave = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/productMaster/all-products');
      const data = await response.json();
      setProducts(data.data || []);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productCode) => {
    try {
      const response = await fetch('/api/productMaster/delete-product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_code: productCode }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setProducts(products.filter((p) => p.product_code !== productCode));
      } else {
        console.error("Failed to delete product:", data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


   const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unit_of_measure?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || p.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Product Master</h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            onClick={() => {
              setEditProduct(null);
              setIsModalOpen(true);
            }}
          >
            + Add New
          </button>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editProduct={editProduct}
      />

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">MRP</th>
              <th className="p-2 border">Last Price</th>
              <th className="p-2 border">HSN Code</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Combination</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Operations</th>
            </tr>
          </thead>
          <tbody>
             {filteredProducts.length > 0 ? (
              filteredProducts.map((p,idx) => (
                <tr key={p.id} className="text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{p.product_code}</td>
                  <td className="p-2 border">{p.product_name}</td>
                  <td className="p-2 border">{p.product_description}</td>
                  <td className="p-2 border">₹{p.product_price}</td>
                  <td className="p-2 border">{p.product_mrp}</td>
                  <td className="p-2 border">{p.product_last_purchase_price}</td>
                  <td className="p-2 border">{p.hsn_code}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">
                    {Array.isArray(p.combination) ? p.combination.join(", ") : ""}
                  </td>
                  <td className="p-2 border">{p.unit_of_measure}</td>
                  <td className="p-2 border">{p.status}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 cursor-pointer"
                      onClick={() => handleEdit(p)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to delete this product?")
                        ) {
                          handleDelete(p.product_code);
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
                <td className="p-4 border text-center" colSpan={12}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductMaster;
