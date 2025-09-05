import { useState, useEffect, use } from 'react'
import VendorModal from '../components/modals/VendorModal'
import DataTable from '../components/common/DataTable'
import { VendorHeading } from '../components/common/TableHeadings'
import FilterAndStatus from '../components/common/FilterAndStatus'
import { VendorStatus } from '../components/common/StatusValues'
import { FilterBySearchAndStatus } from '../components/common/FilterBySearchAndStatus'
import { searchVendorCol } from '../components/common/SearchColumns'
import { useToast } from '../components/common/ToastContainer'
import { AllEndPoints } from '../utilities/endPoints.js'

const VendorMaster = () => {
  const {showToast} = useToast()
  const [vendors, setVendors] = useState({data:[],meta:{}})
  const [editVendor, setEditVendor] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedColumns, setSelectedColumns] = useState('All')
  const [deletingIdx,setDeletingIdx] = useState(null)
  const [filteredVendors,setFilteredVendors] = useState([])
  const [page,setPage]=useState(1)
  const limit =3

    const fetchVendors = async (page,limit) => {
      try {
        //TODO: url is hardcore for testing directly from frontend when pagination is applies in frontend then change
        const response = await fetch(`${AllEndPoints.vendorEndPoints.getVendors}?page=${page}&limit=${limit}`)
        const data = await response.json()
        console.log(data);
        if(response.ok){
          setVendors({
            data: data.data || [],
            meta: data.meta || {}   
          })
          showToast(data.message,data.success)
        }else{
          showToast(data.message,data.success)
        }
       
      } catch (error) {
        console.error('Error in Vendor Master: ', error.message)
        showToast('Error in Vendor Master: ', false)
      }
    }

  useEffect(() => {
    fetchVendors(page,limit)
  }, [page,limit])

  useEffect(() => {
  const fetchFiltered = async () => {
    const res = await FilterBySearchAndStatus(searchQuery, statusFilter,selectedColumns, "VM", page, limit)
    if (res && res.success) {
      setFilteredVendors(res.data)
    } else {
      setFilteredVendors([])
    }
  }
  fetchFiltered()
}, [searchQuery, statusFilter, page, limit])

  const handleSave = (newVendor) => {
    if (editVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v.vendor_code === newVendor.vendor_code ? newVendor : v
        )
      )
      setEditVendor(null)
    } else {
      setVendors([newVendor, ...vendors])
    }
  }

  const handleEdit = (vendor) => {
    setEditVendor(vendor)
    setIsModalOpen(true)
  }

  const handleDelete = async (vendorCode,idx) => {
    try {
      setDeletingIdx(idx)
      const response = await fetch(AllEndPoints.vendorEndPoints.deleteVendor, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_code: vendorCode }),
      })

      const data = await response.json()

      if (data.success) {
        setVendors(vendors.filter((v) => v.vendor_code !== vendorCode))
        showToast(data.message,data.success)
      } else {
        console.error('Failed to delete vendor:', data.message)
        showToast(data.message,data.success)
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
      showToast("Error deleting vendor",false)
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
         statusValue={VendorStatus}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          columnsValue={searchVendorCol}
         />
        <button
          className="bg-blue-500 text-white px-4  w-auto h-10  rounded text-sm"
          onClick={() => {
            setEditVendor(null)
            setIsModalOpen(true)
          }}
        >
          + Add New Vendor
        </button>
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditVendor(null)
        }}
        onSave={handleSave}
        editVendor={editVendor}
      />

      <DataTable
        title={'Vendor Master'}
        columns={VendorHeading}
        data={filteredVendors}
        onEdit={handleEdit}
        onDelete={(row,idx) => handleDelete(row.vendor_code,idx)}
        deletingIdx={deletingIdx}
        meta={vendors.meta}
        onPageChange={(page)=>setPage(page)}
      />
    </div>
  )
}

export default VendorMaster
