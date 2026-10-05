'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/services/api';
import { Order } from '@/types';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (token) {
      setIsLoading(true);
      ordersApi.getOrders(token)
        .then((data) => {
          setOrders(data);
        })
        .catch((err) => {
          console.error('Failed to load orders', err);
          setError('Could not retrieve your orders. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, authLoading, token, router]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You haven&apos;t placed any orders yet</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Once you complete a simulated checkout, your order details and delivery status will appear right here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your previous orders and inspect order details.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-base text-slate-900">
                    #{order.order_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {formattedDate}
                  </span>
                  <span>&bull;</span>
                  <span>{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Total</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>

                <Link
                  href={`/orders/${order.order_number}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
