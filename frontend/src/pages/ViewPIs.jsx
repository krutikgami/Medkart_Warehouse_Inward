import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { PurchaseInvoiceHeading } from '../components/common/TableHeadings'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { PurchaseInvoiceStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { searchPurchaseInvoiceCol } from '../components/common/SearchColumns'
import { useToast } from '../components/common/ToastContainer'


const ViewPIs = () => {
  const {showToast} = useToast();
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
        if(response.ok){
          setPurchaseInvoices(data.data || [])
          showToast(data.message,data.success)
        }else{
          showToast(data.message,data.success)
        }
      } catch (error) {
        console.error('Error fetching Purchase Invoices:', error)
        showToast("Error fetching Purchase Invoices",false)
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
        showToast(data.message,data.success)
      } else {
        console.error('Failed to delete PI:', data.message)
        showToast(data.message,data.success)
      }
    } catch (error) {
      console.error('Error deleting PI:', error)
      showToast('Error deleting PI',false)
    }
  }

//filter by data and pass props as filteredPIs to DataTable component
  const filteredPIs = FilterBySearchAndStatus(purchaseInvoices,searchQuery,statusFilter,searchPurchaseInvoiceCol)

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2">
        <FilterAndStatus
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusValue={PurchaseInvoiceStatus}
          />
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
                      label: 'purchaseInvoice',
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
