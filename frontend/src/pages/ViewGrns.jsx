import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { GrnHeading } from '../components/common/TableHeadings'
import { Eye } from 'lucide-react'
const ViewGrns = () => {
  const [grns, setGrns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const response = await fetch('/api/goodsReceiptNote/get-all-grns')
        const data = await response.json()
        setGrns(data.data || [])
      } catch (error) {
        console.error('Error fetching GRNs:', error)
      }
    }
    fetchGrns()
  }, [])

  const handleEditGrn = async (grn) => {
    navigate('/add-grn', { state: { grn, isEdit: true } })
  }

  const handleDeleteGrn = async (grnCode) => {
    try {
      const response = await fetch('/api/goodsReceiptNote/delete-grn', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grn_code: grnCode }),
      })

      const data = await response.json()

      if (data.success) {
        setGrns(grns.filter((g) => g.grn_code !== grnCode))
      } else {
        console.error('Failed to delete GRN:', data.message)
      }
    } catch (error) {
      console.error('Error deleting GRN:', error)
    }
  }

  const filteredGrns = grns.filter((g) => {
    const matchesSearch =
      g.grn_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.purchase_order_code
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      g.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      g.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="p-6">
        <div className="flex justify-end gap-2">
          <input
            type="text"
            placeholder="Search by GRN, PO, Vendor..."
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
          title="Goods Receipt Notes"
          columns={GrnHeading}
          data={filteredGrns}
          onEdit={handleEditGrn}
          onDelete={(row) => handleDeleteGrn(row.grn_code)}
          actions={{
            operations: [
              (row) => (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() =>
                    navigate('/view-items', {
                      state: {
                        items: row.items,
                        label: 'grn',
                        code: row.grn_code,
                      },
                    })
                  }
                >
                  <Eye className="h-4 w-4" />
                </button>
              ),
            ],
            pi: [
              (row) => (
                <button
                  key="pi"
                  className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => navigate('/add-pi', { state: { grn: row } })}
                >
                  + PI
                </button>
              ),
            ],
          }}
        />
      </div>
    </>
  )
}

export default ViewGrns
