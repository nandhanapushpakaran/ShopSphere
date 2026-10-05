import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  emptyTitle = 'No products found',
  emptySubtitle = 'Try changing your search term or filtering criteria.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-200 text-slate-500 mb-4">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
