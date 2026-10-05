'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const identifier = params?.id as string;

  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${identifier}`);
      return;
    }

    if (token && identifier) {
      setIsLoading(true);
      ordersApi.getOrder(identifier, token)
        .then((data) => {
          setOrder(data);
        })
        .catch((err) => {
          console.error('Failed to load order', err);
          setError('Order not found or you do not have permission to view it.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [identifier, token, isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-32" />
        <div className="h-10 bg-slate-200 rounded w-64" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Available</h2>
        <p className="text-slate-500 mb-6 text-sm">{error || 'This order does not exist or access is restricted.'}</p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                #{order.order_number}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {order.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Placed on {formattedDate}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Order Total</span>
            <span className="text-2xl font-black text-slate-900">
              ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-slate-500" /> Delivery Address
            </h3>
            <p className="text-sm font-bold text-slate-900">{order.full_name}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{order.address}</p>
            <p className="text-sm text-slate-600">
              {order.city}, {order.postal_code}, {order.country}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Package className="w-4 h-4 text-slate-500" /> Contact &amp; Dispatch
            </h3>
            <p className="text-sm text-slate-600">
              Email: <strong className="text-slate-900">{order.email}</strong>
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Method: <strong className="text-slate-900">Standard Simulated Dispatch</strong>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Historical prices and product names snapshot at time of checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Items Ordered ({order.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-base">
                      📦
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.product_name}</h4>
                  <p className="text-xs text-slate-500">
                    Qty: {item.quantity} &times; ${parseFloat(item.unit_price).toFixed(2)}
                  </p>
                </div>
              </div>

              <span className="text-sm font-extrabold text-slate-900">
                ${parseFloat(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial summary breakdown */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-slate-900">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-emerald-600">Free</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline font-bold text-base text-slate-900">
            <span>Grand Total</span>
            <span className="text-xl font-black">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
