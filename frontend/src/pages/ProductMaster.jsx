import ProductModal from '../components/modals/ProductModal'
import { useState, useEffect } from 'react'
import DataTable from '../components/common/DataTable'
import { ProductHeading } from '../components/common/TableHeadings'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { ProductStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { useToast } from '../components/common/ToastContainer'
import { Combinations } from '../utilities/Combinations.js'
import { searchProductCol } from '../components/common/SearchColumns.js'


const ProductMaster = () => {
  const {showToast} = useToast();
  const [products, setProducts] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editProduct, setEditProduct] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedColumns, setSelectedColumns] = useState('All')
  const [deletingIdx,setDeletingIdx] = useState(null)
  const [combinationFilter, setCombinationFilter] = useState('All')
  const [filteredProducts, setFilteredProducts] = useState([])
  const page =1
  const limit =10

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
        //TODO: url is hardcore for testing directly from frontend when pagination is applies in frontend then change
        const response = await fetch('/api/productMaster/all-products?page=1&limit=10')
        const data = await response.json()
        console.log(data);
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

  // filter is hardcode for the temporary purpose to check the working in frontend
  useEffect(() => {
  const fetchFiltered = async () => {
    
    const res = await FilterBySearchAndStatus(searchQuery, statusFilter,selectedColumns, "PM", page, limit)
    if (res && res.success) {
      setFilteredProducts(res.data)
    } else {
      setFilteredProducts([])
    }
  }
  fetchFiltered()
}, [searchQuery, statusFilter, selectedColumns, page, limit])

  const handleDelete = async (productCode,idx) => {
    try {
     setDeletingIdx(idx)
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
    }finally{
      setDeletingIdx(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2">
        <FilterAndStatus 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          columnsValue={searchProductCol}
          statusValue={ProductStatus}
        />
{/* //TODO: combination filter is left for the other field filter        
        {/* <select name="combinations" className="w-auto h-10 border rounded px-3 py-2 text-sm" value={combinationFilter} onChange={(e) => setCombinationFilter(e.target.value)}>
          <option value="All">Select Combination</option>
          {Combinations.map((comb,idx)=>(
            <option key={idx} value={comb} >{comb}</option>
          ))}
        </select> */}
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
        onDelete={(row,idx) => handleDelete(row.product_code,idx)}
        deletingIdx={deletingIdx}
      />
    </div>
  )
}
export default ProductMaster
