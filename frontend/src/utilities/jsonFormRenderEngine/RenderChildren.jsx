import { RenderField } from "./RenderField";

export const RenderChildren = ({ children, formData, setFormData, errors, setErrors, rootSchema }) => {
  return children?.map((child, i) => (
    <RenderField
      key={i}
      field={child}
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      rootSchema={rootSchema}
    />
  ));
};
