import ProductModal from '../components/modals/ProductModal'
import { useState, useEffect } from 'react'
import DataTable from '../components/common/DataTable'
import { ProductHeading } from '../components/common/TableHeadings'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { ProductStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { searchProductCol } from '../components/common/SearchColumns'
import { useToast } from '../components/common/ToastContainer'

const ProductMaster = () => {
  const {showToast} = useToast();
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
      
        if (response.ok) {
          setProducts(data.data || [])
          showToast(data.message,data.success)
        }else{
           showToast(data.message,data.success)
        }
      } catch (error) {
        console.error('Error in Product Master: ', error.message)
        showToast("Error in Product Fetching",false)
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
        showToast(data.message,data.success)
      } else {
        console.error('Failed to delete product:', data.message)
        showToast(data.message,data.success)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('Error deleting product',false)
    }
  }

  //filter by data and pass props as filteredProducts to DataTable component
  const filteredProducts = FilterBySearchAndStatus(products,searchQuery,statusFilter,searchProductCol);

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2">
        <FilterAndStatus 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusValue={ProductStatus}
        />
        <button
          className="bg-blue-500 text-white px-4 w-auto h-10 rounded text-sm"
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
