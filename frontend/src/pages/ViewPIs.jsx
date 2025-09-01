import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { PurchaseInvoiceHeading } from '../components/common/TableHeadings'

const ViewPIs = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPurchaseInvoices = async () => {
      try {
        const response = await fetch(
          '/api/purchaseInvoice/getAll-purchase-invoices'
        )
        const data = await response.json()
        setPurchaseInvoices(data.data || [])
      } catch (error) {
        console.error('Error fetching Purchase Invoices:', error)
      }
    }
    fetchPurchaseInvoices()
  }, [])

  const handleEditPI = (pi) => {
    navigate('/add-pi', { state: { grn: pi, isEdit: true } })
  }

  const handleDeletePI = async (piCode) => {
    try {
      const response = await fetch(
        '/api/purchaseInvoice/delete-purchase-invoice',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purchase_invoice_code: piCode }),
        }
      )

      const data = await response.json()

      if (data.success) {
        setPurchaseInvoices(
          purchaseInvoices.filter((pi) => pi.purchase_invoice_code !== piCode)
        )
      } else {
        console.error('Failed to delete PI:', data.message)
      }
    } catch (error) {
      console.error('Error deleting PI:', error)
    }
  }

  const filteredPIs = purchaseInvoices.filter((pi) => {
    const matchesSearch =
      pi.purchase_invoice_code
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      pi.grn_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pi.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      pi.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by PI, GRN, Vendor..."
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
          <option value="Pending">Pending</option>
          <option value="Partially Completed">Partially Completed</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <DataTable
        title="Purchase Invoices"
        columns={PurchaseInvoiceHeading}
        data={filteredPIs}
        onEdit={handleEditPI}
        onDelete={(row) => handleDeletePI(row.purchase_invoice_code)}
        actions={{
          operations: [
            (row) => (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() =>
                  navigate('/view-items', {
                    state: {
                      items: row.items,
                      label: 'pi',
                      code: row.purchase_invoice_code,
                    },
                  })
                }
              >
                <Eye className="h-4 w-4" />
              </button>
            ),
          ],
        }}
      />
    </div>
  )
}

export default ViewPIs
