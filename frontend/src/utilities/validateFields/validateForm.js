import { validateField } from "../validateFields/validateField.js";

export const validateForm = (fields, formData) => {
  let errors = {};
  
  const traverse = (fieldList) => {
    fieldList.forEach((field) => {
      if (field.fieldType === "input" && field.validations) {
        const val = formData[field.name] ;
        const err = validateField(val, field.validations);
        if (err) {
          errors[field.name] = err;
          return;
        }
      }
      if (field.children) traverse(field.children); 
    });
  };

  traverse(fields);
  return errors;
};
