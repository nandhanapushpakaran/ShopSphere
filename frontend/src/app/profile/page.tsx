'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, MapPin, Package, LogOut, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (user) {
      setName(user.name || '');
      if (user.profile) {
        setAddress(user.profile.address || '');
        setCity(user.profile.city || '');
        setPostalCode(user.profile.postal_code || '');
        setCountry(user.profile.country || '');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name,
        address,
        city,
        postal_code: postalCode,
        country,
      });
      setSaveSuccess(true);
      showToast('Profile defaults updated successfully!', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile defaults.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const joinDate = new Date(user.date_joined).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal information and default shipping addresses.
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 h-fit">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>Account ID: #{user.id}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <Link
              href="/orders"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              <Package className="w-4 h-4" /> View My Orders
            </Link>
          </div>
        </div>

        {/* Address Defaults Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1 pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Shipping Defaults</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6 mt-2">
            These values will automatically prefill your checkout form.
          </p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Default Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Market St"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94105"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>

              {saveSuccess && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <Check className="w-4 h-4" /> Changes saved
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
