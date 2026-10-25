import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = await login(email, password);
      if (auth.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (auth.role === 'ROLE_OWNER') {
        navigate('/owner');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to StayHyderabad
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to track your bookings, manage listings, or explore accommodations.
          </p>
        </div>

        {/* Demo Account Quick-Fill Pills */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">
            ⚡ Quick Demo Logins for Testing:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('user@example.com', 'User@123')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-900 transition-colors shadow-2xs"
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => fillDemo('owner@example.com', 'Owner@123')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-900 transition-colors shadow-2xs"
            >
              🏢 Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@stayhyderabad.com', 'Admin@123')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-900 transition-colors shadow-2xs"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-800 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
