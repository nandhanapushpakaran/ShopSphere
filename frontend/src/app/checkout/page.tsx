'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, AlertCircle, ShoppingBag, Lock, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/services/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, isLoaded } = useCart();
  const { user, token, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill profile shipping defaults if user is logged in
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.profile) {
        if (user.profile.address) setAddress(user.profile.address);
        if (user.profile.city) setCity(user.profile.city);
        if (user.profile.postal_code) setPostalCode(user.profile.postal_code);
        if (user.profile.country) setCountry(user.profile.country);
      }
    }
  }, [user]);

  // Handle empty cart
  if (isLoaded && items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">You must add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated || !token) {
      setError('Please sign in or register to place your order.');
      return;
    }

    if (!fullName || !email || !address || !city || !postalCode || !country) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        country: country.trim(),
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await ordersApi.createOrder(payload, token);
      clearCart();
      router.push(`/orders/confirmation?order_number=${order.order_number}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err?.message || 'An error occurred while creating your order. Please check stock and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTotal = cartTotal.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulated Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your delivery details to simulate placing an order. No payment required.
        </p>
      </div>

      {/* Guest Warning / Auth prompt */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sign in required to place order</h4>
              <p className="text-xs text-slate-600">You must be logged in so orders are safely tracked to your account.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login?redirect=/checkout"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register?redirect=/checkout"
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Shipping Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span>Shipping Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address (for order updates)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94102"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* Simulation Notification Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulated Order Placement</span>
              </div>
              ShopSphere is a portfolio demonstration project. There are no credit cards or real payments processed. Submitting this order writes directly to the PostgreSQL database, decrements inventory, and issues a tracking number.
            </div>
          </div>

          {/* Review & Order Summary Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-slate-800 line-clamp-1">
                      {item.product.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0 ml-3">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Numbers */}
            <div className="border-t border-slate-200 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${formattedTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Final Total</span>
                <span className="text-2xl font-black text-slate-900">${formattedTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-base transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Protected by Django REST Framework &amp; PostgreSQL</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
