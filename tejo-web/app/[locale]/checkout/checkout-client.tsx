"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCart } from '@/store/cart';
import { MovingBorder } from '@/components/ui/moving-border';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckoutOverlay } from '@/components/ui/CheckoutOverlay';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { FreeShippingBar } from '@/components/ui/FreeShippingBar';
import { api } from '@/lib/api';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, discount, total, clear } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mollie'>('stripe');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CheckoutForm>({
    mode: 'onChange',
    defaultValues: {
      country: 'HR',
      acceptTerms: false,
      acceptMarketing: false,
    },
  });

  const watchAcceptTerms = watch('acceptTerms');

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const shippingCost = total() >= 50 ? 0 : 5.99;
  const finalTotal = total() + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    if (!watchAcceptTerms) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        ...data,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.qty,
          price: item.price,
        })),
        subtotal: subtotal(),
        discount: discount(),
        shipping: shippingCost,
        total: finalTotal,
        paymentMethod,
      };

      const response = await api.post('/orders', orderData);
      
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        router.push(`/order/success?orderId=${response.data.id}`);
        clear();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Greška pri obradi narudžbe. Pokušajte ponovno.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-8">
        <MovingBorder className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Progress */}
            <div className="mb-6">
              <ProgressBar value={(currentStep / 3) * 100} />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Informacije</span>
                <span>Plaćanje</span>
                <span>Potvrda</span>
              </div>
            </div>

            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-onyx">Informacije o kupcu</h3>
                
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresa *
                  </label>
                  <input
                    type="text"
                    {...register('address', { required: 'Adresa je obavezna' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grad *
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'Grad je obavezan' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poštanski broj *
                    </label>
                    <input
                      type="text"
                      {...register('postalCode', { required: 'Poštanski broj je obavezan' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Država *
                    </label>
                    <select
                      {...register('country', { required: 'Država je obavezna' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="HR">Hrvatska</option>
                      <option value="SI">Slovenija</option>
                      <option value="BA">Bosna i Hercegovina</option>
                      <option value="RS">Srbija</option>
                      <option value="ME">Crna Gora</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

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

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!isValid}
                  className="w-full bg-onyx text-white py-3 px-6 rounded-lg font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Nastavi na plaćanje
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-onyx">Način plaćanja</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-onyx">Kartica (Stripe)</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      value="mollie"
                      checked={paymentMethod === 'mollie'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mollie')}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-onyx">Mollie</div>
                      <div className="text-sm text-gray-500">Različiti načini plaćanja</div>
                    </div>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-onyx py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Nazad
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-onyx text-white py-3 px-6 rounded-lg font-medium hover:bg-onyx/90 transition-colors"
                  >
                    Nastavi
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-onyx">Pregled narudžbe</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-onyx mb-2">Informacije o dostavi</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{watch('firstName')} {watch('lastName')}</p>
                    <p>{watch('email')}</p>
                    <p>{watch('address')}</p>
                    <p>{watch('city')}, {watch('postalCode')}</p>
                    <p>{watch('country')}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-onyx mb-2">Način plaćanja</h4>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === 'stripe' ? 'Kartica (Stripe)' : 'Mollie'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('acceptTerms', { required: 'Morate prihvatiti uvjete korištenja' })}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Prihvaćam uvjete korištenja *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-200 text-onyx py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Nazad
                  </button>
                  <button
                    type="submit"
                    disabled={!watchAcceptTerms || isProcessing}
                    className="flex-1 bg-onyx text-white py-3 px-6 rounded-lg font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Obrada...' : 'Završi narudžbu'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </MovingBorder>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <MovingBorder className="p-6">
          <h3 className="text-lg font-semibold text-onyx mb-4">Pregled narudžbe</h3>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-onyx truncate">{item.name}</h4>
                  <p className="text-sm text-gray-500">Količina: {item.qty}</p>
                </div>
                <p className="text-sm font-medium text-onyx">
                  {(item.price * item.qty).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Međuzbroj:</span>
              <span>{subtotal().toFixed(2)} €</span>
            </div>
            {discount() > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Popust:</span>
                <span>-{discount().toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Dostava:</span>
              <span>{shippingCost === 0 ? 'Besplatno' : `${shippingCost.toFixed(2)} €`}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-onyx border-t border-gray-200 pt-2">
              <span>Ukupno:</span>
              <span>{finalTotal.toFixed(2)} €</span>
            </div>
          </div>

          <FreeShippingBar subtotal={total()} />
        </MovingBorder>
      </div>

      {/* Processing Overlay */}
      <CheckoutOverlay show={isProcessing} />
    </div>
  );
}
