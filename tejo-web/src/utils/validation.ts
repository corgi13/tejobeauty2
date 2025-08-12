import { ValidationError } from '../types';

export const required = (value: any, field: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { field, message: `${field} is required` };
  }
  return null;
};

export const email = (value: string, field: string): ValidationError | null => {
  if (!value) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { field, message: 'Please enter a valid email address' };
  }
  return null;
};

export const minLength = (value: string, field: string, min: number): ValidationError | null => {
  if (!value) return null;
  
  if (value.length < min) {
    return { field, message: `${field} must be at least ${min} characters long` };
  }
  return null;
};

export const maxLength = (value: string, field: string, max: number): ValidationError | null => {
  if (!value) return null;
  
  if (value.length > max) {
    return { field, message: `${field} must be no more than ${max} characters long` };
  }
  return null;
};

export const minValue = (value: number, field: string, min: number): ValidationError | null => {
  if (value === null || value === undefined) return null;
  
  if (value < min) {
    return { field, message: `${field} must be at least ${min}` };
  }
  return null;
};

export const maxValue = (value: number, field: string, max: number): ValidationError | null => {
  if (value === null || value === undefined) return null;
  
  if (value > max) {
    return { field, message: `${field} must be no more than ${max}` };
  }
  return null;
};

export const pattern = (value: string, field: string, regex: RegExp, message: string): ValidationError | null => {
  if (!value) return null;
  
  if (!regex.test(value)) {
    return { field, message };
  }
  return null;
};

export const url = (value: string, field: string): ValidationError | null => {
  if (!value) return null;
  
  try {
    new URL(value);
    return null;
  } catch {
    return { field, message: 'Please enter a valid URL' };
  }
};

export const phone = (value: string, field: string): ValidationError | null => {
  if (!value) return null;
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(value.replace(/\s/g, ''))) {
    return { field, message: 'Please enter a valid phone number' };
  }
  return null;
};

export const password = (value: string, field: string): ValidationError | null => {
  if (!value) return null;
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(value)) {
    return { 
      field, 
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character' 
    };
  }
  return null;
};

export const confirmPassword = (password: string, confirmPassword: string, field: string): ValidationError | null => {
  if (password !== confirmPassword) {
    return { field, message: 'Passwords do not match' };
  }
  return null;
};

export const validateForm = (values: Record<string, any>, rules: Record<string, any[]>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const error = rule(value, field);
        if (error) errors.push(error);
      } else if (Array.isArray(rule)) {
        const [ruleFunc, ...params] = rule;
        const error = ruleFunc(value, field, ...params);
        if (error) errors.push(error);
      }
    });
  });
  
  return errors;
};