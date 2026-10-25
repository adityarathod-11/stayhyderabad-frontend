import React from 'react';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse flex flex-col h-full">
      <div className="aspect-[16/10] bg-slate-200" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-5 bg-slate-200 rounded w-4/5" />
          <div className="flex gap-2 pt-1">
            <div className="h-4 bg-slate-200 rounded w-16" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-24" />
          <div className="h-9 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
};
