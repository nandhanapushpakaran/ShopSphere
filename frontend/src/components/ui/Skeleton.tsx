import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="aspect-square w-full bg-slate-200" />
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          <div className="h-3 bg-slate-200 rounded w-1/4" />
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-9 bg-slate-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}
