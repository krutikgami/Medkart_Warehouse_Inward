import { useState, useEffect } from 'react'
import { data, useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import { GrnHeading } from '../components/common/TableHeadings'
import { Eye } from 'lucide-react'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { GrnStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { searchGrnCol } from '../components/common/SearchColumns'
import { useToast } from '../components/common/ToastContainer'

const ViewGrns = () => {
  const {showToast} = useToast();
  const [grns, setGrns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deletingIdx,setDeletingIdx] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const response = await fetch('/api/goodsReceiptNote/get-all-grns')
        const data = await response.json()
        if(response.ok){
          setGrns(data.data || [])
          showToast(data.message,data.success)
        }else{
          showToast(data.message,data.success)
        }
      } catch (error) {
        console.error('Error fetching GRNs:', error)
        showToast("Error fetching GRNs",false)
      }
    }
    fetchGrns()
  }, [])

  const handleEditGrn = async (grn) => {
    navigate('/add-grn', { state: { grn, isEdit: true } })
  }

  const handleDeleteGrn = async (grnCode,idx) => {
    try {
      setDeletingIdx(idx)
      const response = await fetch('/api/goodsReceiptNote/delete-grn', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grn_code: grnCode }),
      })

      const data = await response.json()

      if (data.success) {
        setGrns(grns.filter((g) => g.grn_code !== grnCode))
        showToast(data.message,data.success)
      } else {
        console.error('Failed to delete GRN:', data.message)
        showToast(data.message,data.success)
      }
    } catch (error) {
      console.error('Error deleting GRN:', error)
      showToast('Error deleting GRN',false)
    }finally{
      setDeletingIdx(null)
    }
  }

//filter by data and pass props as filteredGrns to DataTable component
  const filteredGrns = FilterBySearchAndStatus(grns,searchQuery,statusFilter,searchGrnCol)

  return (
    <>
      <div className="p-6">
        <div className="flex justify-end gap-2">
          <FilterAndStatus
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusValue={GrnStatus}
            />
        </div>

        <DataTable
          title="Goods Receipt Notes"
          columns={GrnHeading}
          data={filteredGrns}
          onEdit={handleEditGrn}
          onDelete={(row,idx) => handleDeleteGrn(row.grn_code,idx)}
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
