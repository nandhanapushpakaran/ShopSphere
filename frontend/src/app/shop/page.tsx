'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsApi } from '@/services/api';
import { Product, Category, PaginatedProducts } from '@/types';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial states from URL params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialOrdering = searchParams.get('ordering') || '-created_at';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsData, setProductsData] = useState<PaginatedProducts>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedOrdering, setSelectedOrdering] = useState<string>(initialOrdering);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Load categories once
  useEffect(() => {
    productsApi.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    setIsLoading(true);

    // Update browser URL query without reloading
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (selectedOrdering && selectedOrdering !== '-created_at') params.set('ordering', selectedOrdering);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const queryString = params.toString();
    router.replace(`/shop${queryString ? `?${queryString}` : ''}`, { scroll: false });

    // API Call
    productsApi
      .getProducts({
        category: selectedCategory,
        search: searchTerm,
        ordering: selectedOrdering,
        page: currentPage,
      })
      .then((data) => {
        setProductsData(data);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        setProductsData({ count: 0, next: null, previous: null, results: [] });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCategory, searchTerm, selectedOrdering, currentPage, router]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleOrderingChange = (order: string) => {
    setSelectedOrdering(order);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(productsData.count / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shop Catalog
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse through our full collection of modern lifestyle and workspace essentials.
        </p>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedOrdering={selectedOrdering}
        onOrderingChange={handleOrderingChange}
        totalProductsCount={productsData.count}
      />

      <ProductGrid
        products={productsData.results}
        isLoading={isLoading}
        emptyTitle="No products found"
        emptySubtitle="We couldn't find any products matching your current search or filter criteria. Try resetting filters."
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={!productsData.previous || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-sm font-medium text-slate-600">
            Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={!productsData.next || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
