'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPage() {
  const { items, cartTotal, clearCart, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4" />
        <div className="h-4 bg-slate-200 rounded w-64 mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-base">
          Looks like you haven&apos;t added any items to your cart yet. Explore our curated catalog to find things you&apos;ll love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-indigo-600 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  const formattedTotal = cartTotal.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your selected products and proceed to simulated checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 py-4 text-sm border-b border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${formattedTotal}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Simulated Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-900">$0.00</span>
            </div>
          </div>

          <div className="py-4 flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-900">Total</span>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 block">
                ${formattedTotal}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-base transition-colors shadow-md"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Simulated checkout experience. Final prices and stock are strictly verified by PostgreSQL.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
