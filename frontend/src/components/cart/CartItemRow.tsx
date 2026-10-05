'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const product = item.product;
  const unitPrice = parseFloat(product.price);
  const subtotal = (unitPrice * item.quantity).toFixed(2);

  const handleIncrement = () => {
    if (item.quantity < product.stock_quantity) {
      updateQuantity(product.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(product.id, item.quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 block"
        >
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl">
              📦
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-0.5">
            {product.category_name}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
          >
            {product.name}
          </Link>
          <span className="text-sm text-slate-500 font-medium">
            ${unitPrice.toFixed(2)} each
          </span>
          {item.quantity >= product.stock_quantity && (
            <span className="text-xs text-amber-600 font-medium block mt-0.5">
              Maximum stock reached ({product.stock_quantity})
            </span>
          )}
        </div>
      </div>

      {/* Quantity & Subtotal Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden">
          <button
            onClick={handleDecrement}
            className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-sm font-bold text-slate-900 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= product.stock_quantity}
            className={`p-2 transition-colors ${
              item.quantity >= product.stock_quantity
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Subtotal */}
        <div className="text-right min-w-[5rem]">
          <span className="text-base font-bold text-slate-900 block">
            ${subtotal}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(product.id)}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
