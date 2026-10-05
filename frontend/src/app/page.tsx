import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Compass, CheckCircle } from 'lucide-react';
import { productsApi } from '@/services/api';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

// Server-side fetching with fallback
async function getFeaturedData() {
  try {
    const productsRes = await productsApi.getProducts({ featured: true });
    const categoriesRes = await productsApi.getCategories();
    return {
      featuredProducts: productsRes.results,
      categories: categoriesRes,
    };
  } catch (error) {
    console.warn('Backend unavailable during build/SSR, falling back to empty list', error);
    return {
      featuredProducts: [] as Product[],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories } = await getFeaturedData();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Curated Lifestyle & Tech Essentials
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Discover products <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              you&apos;ll truly love.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            ShopSphere is a modern, design-forward storefront featuring refined electronics, minimalist apparel, and artisan homeware. Engineered for quality, aesthetics, and reliability.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            Explore all items <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          emptyTitle="Catalog Loading"
          emptySubtitle="Featured products will appear as soon as the backend API is live."
        />
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Browse By Department
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Categories
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            From smart desk equipment to organic textiles, find what fits your routine.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Electronics', slug: 'electronics', icon: '⚡', desc: 'Audio & Gadgets' },
            { name: 'Clothing', slug: 'clothing', icon: '👕', desc: 'Organic Textiles' },
            { name: 'Home & Living', slug: 'home-living', icon: '☕', desc: 'Decor & Living' },
            { name: 'Beauty', slug: 'beauty', icon: '✨', desc: 'Clean Skincare' },
            { name: 'Accessories', slug: 'accessories', icon: '🎒', desc: 'Leather & Carry' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-2xl mb-3 transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Brand Value / Full-Stack Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
              Full-Stack Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Engineered with Precision and Security
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              ShopSphere combines modern Next.js client and server components with Django REST Framework&apos;s transactional security. All prices, totals, and inventory are recalculated and verified in PostgreSQL.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Server-enforced pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atomic stock reduction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guest cart persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Token authentication</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                Start Exploring Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
