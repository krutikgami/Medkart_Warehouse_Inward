export const ZodError = (error) =>{
    const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."), 
        message: err.message,
      }));
    return formattedErrors;
}