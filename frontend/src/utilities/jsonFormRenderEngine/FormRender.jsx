// import testing from "../jsonForms/testing.json";
import schema from '../jsonForms/formSchema.json'
import { useState } from "react";;
import { validateForm } from "../validateFields/validateForm.js";
import { RenderChildren } from "./RenderChildren.jsx";

export const FormRender = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const rootSchema = schema;

  const handleSubmit =(e) => {
      e.preventDefault();
      const newErrors = validateForm([rootSchema], formData);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        alert("Form Submitted !!");
      }
    }

  return (
    <form style={rootSchema.style} onSubmit={handleSubmit}>
      <RenderChildren
        children={rootSchema.children}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        rootSchema={rootSchema}
      />
    </form>
  );
};
