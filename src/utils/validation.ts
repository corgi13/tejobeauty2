import { ValidationError } from '../types';

export const required = (value: any): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return null;
};

export const email = (value: string): string | null => {
  if (!value) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const minLength = (min: number) => (value: string): string | null => {
  if (!value) return null;
  if (value.length < min) {
    return `Must be at least ${min} characters long`;
  }
  return null;
};

export const maxLength = (max: number) => (value: string): string | null => {
  if (!value) return null;
  if (value.length > max) {
    return `Must be no more than ${max} characters long`;
  }
  return null;
};

export const pattern = (regex: RegExp, message: string) => (value: string): string | null => {
  if (!value) return null;
  if (!regex.test(value)) {
    return message;
  }
  return null;
};

export const url = (value: string): string | null => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationRules: Record<string, ((value: any) => string | null)[]>
): ValidationError => {
  const errors: ValidationError = {};

  Object.keys(validationRules).forEach((field) => {
    const fieldRules = validationRules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};