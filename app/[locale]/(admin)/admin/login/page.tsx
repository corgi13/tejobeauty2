'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MovingBorder } from '@/components/ui/moving-border';
import { useForm } from 'src/hooks/useForm';
import { useApiMutation } from 'src/hooks/useApi';
import { required, email } from 'src/utils/validation';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations('Admin');
  
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    useForm<LoginFormData>({
      initialValues: {
        email: '',
        password: ''
      },
      validate: (values) => {
        const errors = [];
        if (!values.email.trim()) errors.push({ field: 'email', message: 'Email is required' });
        if (!values.password.trim()) errors.push({ field: 'password', message: 'Password is required' });
        if (values.email && !email(values.email)) errors.push({ field: 'email', message: 'Invalid email format' });
        return errors;
      },
      onSubmit: async (data) => {
        try {
          // For now, we'll use a simple authentication approach
          // In a real app, you'd want to implement proper JWT authentication
          if (data.email === 'admin@tejo-beauty.com' && data.password === 'admin123') {
            // Store admin session in localStorage (in production, use proper session management)
            localStorage.setItem('adminAuthenticated', 'true');
            router.push('/admin');
          } else {
            alert('Invalid credentials');
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed');
        }
      }
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <MovingBorder
        duration={3000}
        rx="16px"
        size="100px"
        width="100%"
        height="100%"
        className="flex items-center justify-center"
      >
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
              {errors.find(e => e.field === 'email') && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.find(e => e.field === 'email')?.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
              {errors.find(e => e.field === 'password') && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.find(e => e.field === 'password')?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo credentials: admin@tejo-beauty.com / admin123
            </p>
          </div>
        </div>
      </MovingBorder>
    </div>
  );
}