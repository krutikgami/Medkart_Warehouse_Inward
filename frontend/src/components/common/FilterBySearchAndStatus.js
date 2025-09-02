export const FilterBySearchAndStatus = (items, searchQuery, statusFilter,itemsCol) => {
  return items.filter((item) => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      itemsCol.some((col)=>(
        item[col]?.toLowerCase().includes(search)
      ))

    const matchesStatus =
      statusFilter === 'All' ||
      item.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })
}
