import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { PurchaseOrderHeading } from '../components/common/TableHeadings'
import { Eye } from 'lucide-react'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { PurchaseOrderStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { searchPurchaseOrderCol } from '../components/common/SearchColumns'
import { useToast } from '../components/common/ToastContainer'

const PurchaseOrder = () => {
  const {showToast} = useToast();
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deletingIdx,setDeletingIdx] = useState(null)
  const [filteredOrders,setFilteredOrders] = useState([])

  const navigate = useNavigate()

  const page = 1;
  const limit =10;

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        //TODO: url is hardcore for testing directly from frontend when pagination is applies in frontend then change
        const response = await fetch('/api/purchaseOrder/allPurchaseOrder?page=1&limit=3')
        const data = await response.json()
        console.log(data);
        if(response.ok){
          setOrders(data.data || [])
          showToast(data.message,data.success);
        }else{
          showToast(data.message,data.success)
        }
      } catch (error) {
        console.error('Error in Purchase Order: ', error.message)
        showToast('Error in Purchase Order: ', false)
      }
    }
    fetchPurchaseOrder()
  }, [])

  useEffect(() => {
  const fetchFiltered = async () => {
    const res = await FilterBySearchAndStatus(searchQuery, statusFilter, "PO", page, limit)
    if (res && res.success) {
      setFilteredOrders(res.data)
    } else {
      setFilteredOrders([])
    }
  }
  fetchFiltered()
}, [searchQuery, statusFilter, page, limit])

  const handleEdit = (order) => {
    navigate('/add-purchase-order', { state: { grn: order, isEdit: true } })
  }

  const handleDelete = async (orderCode,idx) => {
    try {
      setDeletingIdx(idx)
      const response = await fetch('/api/purchaseOrder/delete-purchase-order', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_order_code: orderCode }),
      })

      const data = await response.json()

      if (data.success) {
        setOrders(orders.filter((o) => o.purchase_order_code !== orderCode))
        showToast(data.message,data.success)
      } else {
        console.error('Failed to delete order:', data.message)
        showToast(data.message,data.success)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      showToast("Error deleting order",false)
    }finally{
      setDeletingIdx(null)
    }
  }

//filter by data and pass props as filteredOrders to DataTable component
  return (
    <>
      <div className="p-6">
        <div className="flex justify-end gap-2">
          <FilterAndStatus
           searchQuery={searchQuery}
           setSearchQuery={setSearchQuery}
           statusFilter={statusFilter}
           setStatusFilter={setStatusFilter}
           statusValue={PurchaseOrderStatus}
          />
          <button
            className="bg-blue-500 text-white px-4 w-auto h-10 rounded text-sm"
            onClick={() => {
              navigate('/add-purchase-order', { state: { isEdit: false } })
            }}
          >
            + Add New Order
          </button>
        </div>
        <DataTable
          title="Purchase Orders"
          columns={PurchaseOrderHeading}
          data={filteredOrders}
          onEdit={handleEdit}
          onDelete={(row,idx) => handleDelete(row.purchase_order_code,idx)}
          deletingIdx={deletingIdx}
          actions={{
            operations: [
              (row) => (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() =>
                    navigate('/view-items', {
                      state: {
                        items: row.items,
                        label: 'purchaseOrder',
                        code: row.purchase_order_code,
                      },
                    })
                  }
                >
                  <Eye className="h-4 w-4" />
                </button>
              ),
            ],
            grn: [
              (row) => (
                <button
                  className={`${
                    row.status === 'Completed' ? 'bg-gray-400' : 'bg-purple-500'
                  } text-white px-2 py-1 rounded`}
                  onClick={() =>
                    navigate('/add-grn', { state: { order: row } })
                  }
                  disabled={row.status === 'Completed'}
                >
                  + Add GRN
                </button>
              ),
            ],
          }}
        />
      </div>
    </>
  )
}

export default PurchaseOrder
