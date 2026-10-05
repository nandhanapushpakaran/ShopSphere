import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Curated Quality</h4>
              <p className="text-xs text-slate-400">Hand-selected lifestyle & tech essentials</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Simulated Dispatch</h4>
              <p className="text-xs text-slate-400">Instant order lifecycle updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Transactional Security</h4>
              <p className="text-xs text-slate-400">Atomic inventory & server recalculation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Zero Risk Checkout</h4>
              <p className="text-xs text-slate-400">Simulated checkout, no credit card needed</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                SS
              </span>
              <span className="font-bold text-lg text-white tracking-tight">ShopSphere</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              A modern mini e-commerce platform engineered with Next.js, Django REST Framework, and PostgreSQL.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Catalog</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/shop?category=clothing" className="hover:text-white transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-living" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Account & Orders</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Profile Details
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Portfolio Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application is designed as a full-stack portfolio showcase demonstrating clean REST APIs, relational modeling, and state-of-the-art React architecture. No actual monetary transactions occur.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ShopSphere. Full-stack portfolio demonstration.</p>
          <p className="mt-2 sm:mt-0">Next.js App Router &bull; Django REST Framework &bull; PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}
