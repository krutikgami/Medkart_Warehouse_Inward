export const ZodError = (error) =>{
  
  return error.issues.map((err) => ({
    path: err.path.join("."), 
    message: err.message,
  }));
}