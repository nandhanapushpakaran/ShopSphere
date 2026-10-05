'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password, passwordConfirm);
      router.push(redirect);
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Join ShopSphere to save orders and streamline checkout.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href={`/login${redirect !== '/shop' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-slate-500">Loading sign up...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
