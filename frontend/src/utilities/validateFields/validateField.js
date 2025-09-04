export const validateField = (value, validations) => {
  if (!validations) return null;
  if (validations?.required?.value && !value) {
    return validations.required.message; 
  }
  if (validations.minLength && value.length < validations.minLength.value) {
    return validations.minLength.message;
  }
  if (validations.pattern) {
    const regex = new RegExp(validations.pattern.value);
    if (!regex.test(value)) {
      return validations.pattern.message;
    }
  }
  return null;
};