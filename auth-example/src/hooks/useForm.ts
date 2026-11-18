import { useState, type ChangeEvent } from "react";
import { validateForm, type FormErrors, type ValidationRules } from "../utils/formValidation"; 

export function useForm<T extends object>(
  initialData: T,
  rules: ValidationRules<T>
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof T;
    const finalValue = type === "checkbox" ? checked : value;
    
    const updatedData = { ...formData, [fieldName]: finalValue } as T;
    setFormData(updatedData);

    if (errors[fieldName]) {
      const validator = rules[fieldName];
      const errorMsg = validator ? validator(finalValue as T[keyof T], updatedData) : undefined;

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (errorMsg) {
          newErrors[fieldName] = errorMsg;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    } else if (hasSubmitted) {
      setErrors(validateForm(updatedData, rules));
    }
  };

  const validateStep = (stepFields: (keyof T)[]) => {
    const newErrors = { ...errors };
    let stepHasError = false;

    stepFields.forEach((field) => {
      const validator = rules[field];
      if (validator) {
        const errorMsg = validator(formData[field], formData);
        if (errorMsg) {
          newErrors[field] = errorMsg;
          stepHasError = true;
        } else {
          delete newErrors[field];
        }
      }
    });

    setErrors(newErrors);
    return !stepHasError;
  };
  
  const validateAll = () => {
    setHasSubmitted(true);
    const newErrors = validateForm(formData, rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, setFormData, errors, hasSubmitted, handleChange, validateStep, validateAll };
}