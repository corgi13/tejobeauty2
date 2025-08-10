"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MovingBorder } from './MovingBorder';
import { api } from '@/lib/api';

interface NewsletterForm {
  email: string;
}

export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await api.post('/newsletter/subscribe', data);
      setMessage({ type: 'success', text: response.data.message });
      reset();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Greška pri pretplati. Pokušajte ponovno.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MovingBorder className="p-6">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-bold text-onyx mb-2">
          Prijavite se na newsletter
        </h3>
        <p className="text-gray-600 mb-6">
          Budite u toku s najnovijim proizvodima, akcijama i savjetima za njegu
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="email"
                {...register('email', {
                  required: 'Email je obavezan',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Neispravan email format',
                  },
                })}
                placeholder="Vaš email adresa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-onyx text-white rounded-lg font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Prijava...' : 'Prijavi se'}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Možete se odjaviti u bilo kojem trenutku. Poštujemo vašu privatnost.
        </p>
      </div>
    </MovingBorder>
  );
}
