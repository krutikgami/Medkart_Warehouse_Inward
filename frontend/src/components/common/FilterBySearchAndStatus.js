export const FilterBySearchAndStatus = async (searchQuery,statusFilter,selectedColumns,db,page,limit)=>{
  try {
    const response = await fetch(`/api/commonFilter?search=${searchQuery}&status=${statusFilter}&selectedCols=${selectedColumns}&db=${db}&page=${page}&limit=${limit}`)
    const data = await response.json();
    if(!response.ok){
      console.error(data.message)
    }
    console.log("Received data after filter apply ",data.data)
    return data;
  } catch (error) {
    console.error("Error in CommonFilter",error.message)
    return null;
  }
}