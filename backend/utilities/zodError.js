export const ZodError = (error) =>{
  console.log("Error: " ,error);
  
  if (!error.errors) {
    return [{ path: "unknown", message: error.message }];
  }
  return error.errors.map((err) => ({
    path: err.path.join("."), 
    message: err.message,
  }));
}
// import {z} from 'zod'
// export const ZodError = (error) => {
//    if (error instanceof z.ZodError) {
//     return error?.errors?.map((err) => ({
//       path: err.path.length ? err.path.join(".") : "root",
//       message: err.message,
//     }));
//   }
//   return [
//     {
//       path: "unknown",
//       message: error.message || "Unexpected error",
//     },
//   ];
// };