import ProductModal from '../components/modals/ProductModal'
import { useState, useEffect } from 'react'
import DataTable from '../components/common/DataTable'
import { ProductHeading } from '../components/common/TableHeadings'

const ProductMaster = () => {
  const [products, setProducts] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editProduct, setEditProduct] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const handleSave = (newProduct) => {
    setProducts([newProduct, ...products])
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/productMaster/all-products')
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error('Error in Product Master: ', error.message)
        alert('Error in Product Master: ', error.message)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (productCode) => {
    try {
      const response = await fetch('/api/productMaster/delete-product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_code: productCode }),
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.filter((p) => p.product_code !== productCode))
      } else {
        console.error('Failed to delete product:', data.message)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.product_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unit_of_measure?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      p.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2">
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
            setEditProduct(null)
            setIsModalOpen(true)
          }}
        >
          + Add New
        </button>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editProduct={editProduct}
      />
      <DataTable
        title={'Product Master'}
        columns={ProductHeading}
        data={filteredProducts}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row.product_code)}
      />
    </div>
  )
}
export default ProductMaster
