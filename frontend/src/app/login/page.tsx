'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@shopsphere.dev');
    setPassword('DemoUser2026!');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage your orders and account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Account Quick-Fill Card */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Portfolio Demo Account</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
              >
                Auto-fill Demo
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              demo@shopsphere.dev &bull; DemoUser2026!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href={`/register${redirect !== '/shop' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-slate-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
