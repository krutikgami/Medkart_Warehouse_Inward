import { validateField } from "../validateFields/validateField.js";
import { RenderChildren } from "./RenderChildren.jsx";

export const RenderField = (props) => {
  const { field } = props;
  const { fieldType } = field;

  const RenderDiv = ({ field, ...props }) => (
    <div style={field.style}>
      <RenderChildren {...props} children={field.children} />
    </div>
  );

  const RenderInput = ({ field, formData, setFormData, errors, setErrors }) => {
    const { label, name, type, style, validations } = field;

    const handleChange =  (e) => {
      const val = e.target.value;
      setFormData((prevData) => ({ ...prevData, [name]: val }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validations ? validateField(val, validations) : null,
      }));
    };

    return (
      <div style={{ marginBottom: "10px" }}>
        {label && <label>{label}</label>}
        <input
          type={type}
          name={name}
          style={style}
          value={formData[name] || ""}
          onChange={handleChange}
        />
        {errors[name] && <span style={{ color: "red" }}>{errors[name]}</span>}
      </div>
    );
  };

  const RenderButton = ({ field, setFormData, setErrors }) => {
    if (field.type === "submit") {
      return (
        <button type="submit" style={field.style}>
          {field.label}
        </button>
      );
    }

    if (field.type === "button" && field.validations?.action === "reset") {
      const handleReset = () => {
        setFormData({});
        setErrors({});
      };

      return (
        <button type="button" style={field.style} onClick={handleReset}>
          {field.label}
        </button>
      );
    }

    return null;
  };

  switch (fieldType) {
    case "div":
      return <RenderDiv {...props} />;
    case "input":
      return <RenderInput {...props} />;
    case "button":
      return <RenderButton {...props} />;
    case "form":
      return <RenderChildren {...props} children={field.children} />;
    default:
      return null;
  }
};
