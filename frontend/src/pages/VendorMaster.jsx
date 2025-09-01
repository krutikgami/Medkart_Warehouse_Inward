import { useState, useEffect } from 'react'
import VendorModal from '../components/modals/VendorModal'
import DataTable from '../components/common/DataTable'
import { VendorHeading } from '../components/common/TableHeadings'

const VendorMaster = () => {
  const [vendors, setVendors] = useState([])
  const [editVendor, setEditVendor] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendorMaster/all-vendors')
        const data = await response.json()
        setVendors(data.data || [])
      } catch (error) {
        console.error('Error in Vendor Master: ', error.message)
        alert('Error in Vendor Master: ', error.message)
      }
    }
    fetchVendors()
  }, [])

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

  const handleDelete = async (vendorCode) => {
    try {
      const response = await fetch('/api/vendorMaster/delete-vendor', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_code: vendorCode }),
      })

      const data = await response.json()

      if (data.success) {
        setVendors(vendors.filter((v) => v.vendor_code !== vendorCode))
      } else {
        console.error('Failed to delete vendor:', data.message)
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
    }
  }

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.vendor_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gst_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      v.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2">
        <input
          type="text"
          placeholder="Search by code, name, contact..."
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
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
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
        onDelete={(row) => handleDelete(row.vendor_code)}
      />
    </div>
  )
}

export default VendorMaster
