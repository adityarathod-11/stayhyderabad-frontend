import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isOwner, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isOwner) return '/owner';
    return '/dashboard';
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">Admin</span>;
    if (isOwner) return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">Owner</span>;
    return <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full font-semibold">Member</span>;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-900 transition-colors">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Stay<span className="text-teal-800">Hyderabad</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-amber-700 -mt-1">
                Verified PGs & Hostels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/properties" 
              className={`text-sm font-medium transition-colors hover:text-teal-800 ${
                location.pathname === '/properties' ? 'text-teal-800 font-semibold' : 'text-slate-600'
              }`}
            >
              Explore PGs
            </Link>

            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-teal-800 flex items-center gap-1 py-2">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                Popular Hubs
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-slate-150 rounded-xl shadow-lg py-2 mt-0 z-50">
                {['Madhapur', 'HITEC City', 'Gachibowli', 'Kondapur', 'Ameerpet', 'Kukatpally', 'Miyapur', 'Dilsukhnagar'].map((area) => (
                  <Link
                    key={area}
                    to={`/properties?locality=${encodeURIComponent(area)}`}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to={isOwner ? "/owner" : "/register?role=ROLE_OWNER"} 
              className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              List Your Property
            </Link>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-teal-700 transition-colors bg-slate-50"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center font-semibold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.fullName}
                    </p>
                    {getRoleBadge()}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-700" />
                      Dashboard
                    </Link>

                    {!isOwner && !isAdmin && (
                      <Link
                        to="/dashboard?tab=favourites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Saved Hostels
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-teal-800 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700"
          >
            Explore PGs
          </Link>
          <div className="py-2 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Popular Hyderabad Hubs
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['Madhapur', 'HITEC City', 'Gachibowli', 'Kondapur', 'Ameerpet', 'Kukatpally'].map((area) => (
                <Link
                  key={area}
                  to={`/properties?locality=${encodeURIComponent(area)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs py-1 text-slate-600 hover:text-teal-800"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/register?role=ROLE_OWNER"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-amber-700"
          >
            List Your PG (Owner Registration)
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{user.fullName}</p>
                    {getRoleBadge()}
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm py-2 font-medium text-teal-800"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm py-2 text-rose-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-teal-800 border border-teal-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
