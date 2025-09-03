export const FilterBySearchAndStatus = async (searchQuery,statusFilter,db,page,limit)=>{
  try {
    const response = await fetch(`http://localhost:3000/api/commonFilter?search=${searchQuery}&status=${statusFilter}&db=${db}&page=${page}&limit=${limit}`)
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