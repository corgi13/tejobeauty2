"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MovingBorder } from '@/components/ui/MovingBorder';
import { api } from '@/lib/api';

interface LoginForm { email: string; password: string }

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true); setError('');
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.accessToken) {
        router.push('/admin/products');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Greška pri prijavi');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <MovingBorder className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-gold to-cream mb-4" />
            <h2 className="font-heading text-3xl font-bold text-onyx">Admin prijava</h2>
            <p className="mt-2 text-sm text-gray-600">Prijavite se u admin panel</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" {...register('email', { required: 'Email je obavezan', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Neispravan email format' } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="admin@tejo-beauty.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
              <input id="password" type="password" {...register('password', { required: 'Lozinka je obavezna' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-onyx text-white py-3 px-4 rounded-lg font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Prijava...' : 'Prijavi se'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Demo pristup: admin@tejo-beauty.com / admin123</p>
          </div>
        </div>
      </MovingBorder>
    </div>
  );
}


