 const FilterAndStatus = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter,selectedColumns,setSelectedColumns, extraFilters = [],statusValue = [],columnsValue =[] }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      />

      <select 
        value={selectedColumns}
        onChange={(e) => setSelectedColumns(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="All" >Filter By</option>
        {columnsValue.map((val,idx) => (
        <option key={idx} value={val}>{val}</option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="All" >All Statuses</option>
        {statusValue.map((val,idx) => (
        <option key={idx} value={val}>{val}</option>
        ))}
      </select>
      {extraFilters.map((filter, idx) => (
        <div key={idx}>{filter}</div>
      ))}
    </div>
  )
}

export default FilterAndStatus
