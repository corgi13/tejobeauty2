import { useState, useCallback } from 'react';
import { ValidationError } from '../types';

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => ValidationError[] | Promise<ValidationError[]>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors.find(e => e.field === name)) {
      setErrors(prev => prev.filter(e => e.field !== name));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValue(name as keyof T, finalValue);
  }, [setValue]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFieldTouched(e.target.name as keyof T);
  }, [setFieldTouched]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return [...filtered, { field, message }];
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (validate) {
      try {
        const validationErrors = await validate(values);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }
      } catch (error) {
        console.error('Validation error:', error);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, reset]);

  const getFieldError = useCallback((field: string) => {
    return errors.find(e => e.field === field)?.message;
  }, [errors]);

  const isFieldTouched = useCallback((field: string) => {
    return touched[field] || false;
  }, [touched]);

  return {
    values,
    errors,
    isSubmitting,
    touched,
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldError,
    clearErrors,
    getFieldError,
    isFieldTouched,
  };
}