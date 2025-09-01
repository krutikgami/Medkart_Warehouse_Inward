import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { PurchaseOrderHeading } from '../components/common/TableHeadings'
import { Eye } from 'lucide-react'

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await fetch('/api/purchaseOrder/allPurchaseOrder')
        const data = await response.json()
        setOrders(data.data || [])
      } catch (error) {
        console.error('Error in Purchase Order: ', error.message)
        alert('Error in Purchase Order: ', error.message)
      }
    }
    fetchPurchaseOrder()
  }, [])

  const handleEdit = (order) => {
    navigate('/add-purchase-order', { state: { grn: order, isEdit: true } })
  }

  const handleDelete = async (orderCode) => {
    try {
      const response = await fetch('/api/purchaseOrder/delete-purchase-order', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_order_code: orderCode }),
      })

      const data = await response.json()

      if (data.success) {
        setOrders(orders.filter((o) => o.purchase_order_code !== orderCode))
      } else {
        console.error('Failed to delete order:', data.message)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.purchase_order_code
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      o.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="p-6">
        <div className="flex justify-end gap-2">
          <input
            type="text"
            placeholder="Search by vendor, code, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Partial Completed">Partial Completed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
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
          onDelete={(row) => handleDelete(row.purchase_order_code)}
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
