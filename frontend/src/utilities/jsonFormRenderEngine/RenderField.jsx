import { validateField } from "../validateFields/validateField.js";
import { validateForm } from "../validateFields/validateForm.js";

export const RenderField = ({ field , formData , setFormData , errors , setErrors,rootSchema }) => {
    const { fieldType, style, label, name, type, children, validations } = field;

  if (fieldType === "div") {
    return (
      <div style={style}>
        {children?.map((child, i) => (
          <RenderField
            key={i}
            field={child}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            rootSchema={rootSchema}
          />
        ))}
      </div>
    );
  }

  if (fieldType === "input") {
    return (
      <div style={{ marginBottom: "1rem" }}>
        {label && <label>{label}</label>}
        <input
          type={type}
          name={name}
          style={style}
          value={formData[name] || ""}
          onChange={(e) => {
            e.preventDefault();
            const val = e.target.value;
            setFormData({ ...formData, [name]: val });
            setErrors({
              ...errors,
              [name]: validateField(val, validations)
            });
          }}
        />
        {errors[name] && <span style={{ color: "red" }}>{errors[name]}</span>}
      </div>
    );
  }

  if (fieldType === "button") {
   if (type === "submit") {
        return (
            <button
            type="button"
            style={style}
            onClick={(e) => {
                e.preventDefault();
                const newErrors = validateForm(
                [rootSchema],
                formData
                );
                setErrors(newErrors);
                if (Object.keys(errors).length === 0) {
                  alert("Form Submitted !!");
                }
            }}
            >
            {label}
            </button>
        );
    }
    if (type === "button" && field.validations?.action === "reset") {
      return (
        <button
          type={field.validations?.action}
          style={style}
          onClick={() => {
            setFormData({});
            setErrors({});
          }}
        >
          {label}
        </button>
      );
    }
  }
    return null;
}