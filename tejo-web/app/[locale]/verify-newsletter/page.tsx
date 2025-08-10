"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MovingBorder } from '@/components/ui/moving-border';
import { api } from '@/lib/api';

export default function VerifyNewsletterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Neispravan link za verifikaciju newsletter pretplate.');
      return;
    }

    const verifyNewsletter = async () => {
      try {
        const response = await api.post('/newsletter/verify', { token });
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Greška pri verifikaciji newsletter pretplate.');
      }
    };

    verifyNewsletter();
  }, [token, router]);

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <MovingBorder className="p-8 text-center">
        {status === 'loading' && (
          <div>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent mb-4"></div>
            <h1 className="font-heading text-2xl font-bold text-onyx mb-2">
              Verificiranje newsletter pretplate...
            </h1>
            <p className="text-gray-600">Molimo pričekajte dok verificiramo vašu email adresu.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-onyx mb-2">
              Newsletter pretplata uspješno verificirana!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Preusmjeravanje na početnu stranicu...
            </p>
            <div className="mt-6">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-onyx text-white rounded-lg font-medium hover:bg-onyx/90 transition-colors"
              >
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-onyx mb-2">
              Greška pri verifikaciji
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-onyx text-white rounded-lg font-medium hover:bg-onyx/90 transition-colors"
              >
                Povratak na početnu
              </Link>
              <div>
                <p className="text-sm text-gray-500">
                  Ako i dalje imate problema, kontaktirajte nas na{' '}
                  <a href="mailto:support@tejo-beauty.com" className="text-gold hover:underline">
                    support@tejo-beauty.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </MovingBorder>
    </main>
  );
}
