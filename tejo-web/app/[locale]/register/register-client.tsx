"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { MovingBorder } from '@/components/ui/MovingBorder';
import { api } from '@/lib/api';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export function RegisterClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      country: 'HR',
      acceptTerms: false,
      acceptMarketing: false,
    },
  });

  const watchPassword = watch('password');
  const watchAcceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterForm) => {
    if (!watchAcceptTerms) {
      setMessage({ type: 'error', text: 'Morate prihvatiti uvjete korištenja' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      });

      setMessage({ type: 'success', text: response.data.message });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Greška pri registraciji. Pokušajte ponovno.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MovingBorder className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-onyx mb-4">Osobni podaci</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ime *
              </label>
              <input
                type="text"
                {...register('firstName', { required: 'Ime je obavezno' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prezime *
              </label>
              <input
                type="text"
                {...register('lastName', { required: 'Prezime je obavezno' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-onyx mb-4">Kontakt informacije</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email je obavezan',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Neispravan email format'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold text-onyx mb-4">Adresa (opcionalno)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresa
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grad
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poštanski broj
                </label>
                <input
                  type="text"
                  {...register('postalCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Država
                </label>
                <select
                  {...register('country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="HR">Hrvatska</option>
                  <option value="SI">Slovenija</option>
                  <option value="BA">Bosna i Hercegovina</option>
                  <option value="RS">Srbija</option>
                  <option value="ME">Crna Gora</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <h3 className="text-lg font-semibold text-onyx mb-4">Lozinka</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lozinka *
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Lozinka je obavezna',
                  minLength: { value: 6, message: 'Lozinka mora imati najmanje 6 znakova' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potvrdi lozinku *
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Potvrda lozinke je obavezna',
                  validate: value => value === watchPassword || 'Lozinke se ne podudaraju'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('acceptMarketing')}
              className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Želim primati newsletter i promocije
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              {...register('acceptTerms')}
              className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded mt-0.5"
            />
            <label className="text-sm text-gray-700">
              Prihvaćam{' '}
              <Link href="/terms" className="text-gold hover:underline">
                uvjete korištenja
              </Link>{' '}
              i{' '}
              <Link href="/privacy" className="text-gold hover:underline">
                politiku privatnosti
              </Link>{' '}
              *
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-onyx text-white py-3 px-6 rounded-lg font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registracija...' : 'Registriraj se'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Već imate račun?{' '}
            <Link href="/login" className="text-gold hover:underline font-medium">
              Prijavite se
            </Link>
          </p>
        </div>
      </form>
    </MovingBorder>
  );
}
