'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, Check, ShieldCheck, Truck, RotateCcw, AlertTriangle, Plus, Minus } from 'lucide-react';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addItem } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);

    productsApi.getProduct(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error('Failed to load product details', err);
        setError('This product could not be found or is no longer available.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-600 mb-6">{error || 'The requested product does not exist.'}</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const result = addItem(product, quantity);
    if (result.success) {
      setIsAdded(true);
      showToast(`${quantity}x ${product.name} added to cart!`, 'success');
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      showToast(result.message, 'error');
    }
  };

  const unitPrice = parseFloat(product.price);
  const formattedPrice = unitPrice.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-900 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category_slug}`} className="hover:text-slate-900 transition-colors">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Media Column */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <span className="text-6xl mb-2">📦</span>
              <span className="text-sm font-medium">Image unavailable</span>
            </div>
          )}

          {/* Stock Tag on Image */}
          <div className="absolute top-4 left-4">
            {isOutOfStock ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                Only {product.stock_quantity} Left in Stock
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                In Stock &amp; Ready to Ship
              </span>
            )}
          </div>
        </div>

        {/* Product Information Column */}
        <div className="flex flex-col justify-between space-y-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-3">
              {product.category_name}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-black text-slate-900">
                ${formattedPrice}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                USD &bull; Taxes included
              </span>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Inventory Status Text */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Stock Availability:</span>
              <span className="text-sm font-bold text-slate-900">
                {isOutOfStock ? '0 units (Sold out)' : `${product.stock_quantity} units available`}
              </span>
            </div>
          </div>

          {/* Interactive Controls & CTA */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden h-12">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 h-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-base font-bold text-slate-900 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_quantity || isOutOfStock}
                  className="px-3.5 h-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart &bull; ${(unitPrice * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 text-center text-xs text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span>Simulated Dispatch</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Database Guaranteed</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-indigo-600" />
                <span>Simulated Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
