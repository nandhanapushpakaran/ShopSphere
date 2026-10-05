'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package, ShoppingBag } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || 'Confirmed';

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
        Order Successfully Placed
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Thank You for Your Order!
      </h1>

      <p className="text-slate-600 text-base max-w-lg mx-auto mb-6">
        Your simulated order has been registered in the database, product inventory has been safely decremented, and your receipt has been generated.
      </p>

      {/* Order Badge */}
      <div className="inline-block p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
        <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider mb-1">
          Generated Order Reference
        </span>
        <span className="text-xl sm:text-2xl font-mono font-bold text-indigo-600">
          #{orderNumber}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {orderNumber !== 'Confirmed' && (
          <Link
            href={`/orders/${orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Package className="w-4 h-4" /> View Order Details
          </Link>
        )}
        <Link
          href="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm"
        >
          All Orders
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-20 text-center text-slate-500">Loading order confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
