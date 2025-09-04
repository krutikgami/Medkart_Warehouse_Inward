import schema from '../jsonForms/formSchema.json' 
import { useState } from 'react'
import {RenderField} from '../jsonFormRenderEngine/RenderField'
export const FormRender = () => {
  const [formData, setFormData] = useState({})
  const[errors,setErrors] = useState({})

  return <RenderField 
    field={schema} 
    formData={formData} 
    setFormData={setFormData} 
    errors={errors}
    setErrors={setErrors}
    rootSchema={schema}
    />
}