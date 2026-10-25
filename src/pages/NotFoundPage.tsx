import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-6">
        <Building2 className="w-8 h-8 text-amber-500" />
      </div>
      <span className="text-sm font-bold text-teal-800 uppercase tracking-widest">404 Error</span>
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The accommodation page or URL you are looking for doesn't exist, has been removed, or moved to another locality.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};
