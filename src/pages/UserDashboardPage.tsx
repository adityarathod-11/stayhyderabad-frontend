import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Booking, PropertySummary, PageResponse } from '../types';
import api from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { EmptyState } from '../components/common/EmptyState';
import { 
  User, 
  Calendar, 
  Heart, 
  Clock, 
  Building2, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'bookings';

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Favourites state
  const [favourites, setFavourites] = useState<PropertySummary[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  // Edit profile state
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Cancel action state
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get<PageResponse<Booking>>('/bookings?size=20');
      setBookings(res.data.content);
    } catch (err) {
      console.error('Failed to fetch user bookings', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchFavourites = async () => {
    setFavLoading(true);
    try {
      const res = await api.get<PageResponse<PropertySummary>>('/favourites?size=20');
      setFavourites(res.data.content);
    } catch (err) {
      console.error('Failed to fetch favourites', err);
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'favourites') fetchFavourites();
  }, [activeTab]);

  const handleCancelBooking = async (bookingId: number) => {
    const reason = window.prompt('Please enter a cancellation reason (optional):') || 'Guest changed plans';
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, { reason });
      await fetchBookings();
      alert('Booking request cancelled successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await api.put('/auth/profile', {
        fullName: editName,
        phone: editPhone,
      });
      await refreshProfile();
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case 'ACCEPTED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted & Reserved</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'CANCELLED':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Header Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user?.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.fullName}</h1>
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Member
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setSearchParams({ tab: 'bookings' })}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'bookings' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-teal-700" />
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'favourites' })}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'favourites' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Saved Hostels
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-700" />
            Profile Settings
          </button>
        </div>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Accommodation Requests</h2>
            <Link to="/properties" className="text-xs font-bold text-teal-800 hover:underline">
              Find More Hostels →
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No booking requests yet"
              description="Explore verified Hyderabad hostels and submit your move-in request without any advance charges."
              actionText="Browse Available PGs"
              onAction={() => (window.location.href = '/properties')}
            />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.propertyPrimaryImage || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80'}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {booking.bookingReference}
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>

                      <Link
                        to={`/properties/${booking.propertySlug}`}
                        className="font-bold text-slate-900 hover:text-teal-800 text-base flex items-center gap-1"
                      >
                        {booking.propertyName}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>

                      <p className="text-xs text-slate-500">
                        {booking.sharingType.replace('_', ' ')} • Preferred Move-in: <strong className="text-slate-800">{booking.preferredMoveInDate}</strong> • {booking.numPersons} Person(s)
                      </p>

                      {booking.ownerNote && (
                        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl mt-2">
                          <strong>Owner Note:</strong> {booking.ownerNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex md:flex-col items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-2">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Locked Rent</span>
                      <span className="text-lg font-black text-slate-900">{formatPrice(booking.monthlyRentLocked)}/mo</span>
                    </div>

                    {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favourites Tab */}
      {activeTab === 'favourites' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Your Saved Accommodations</h2>
          {favLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : favourites.length === 0 ? (
            <EmptyState
              title="No saved properties"
              description="Click the heart icon on any accommodation card to bookmark it for later."
              actionText="Explore PGs"
              onAction={() => (window.location.href = '/properties')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((prop) => (
                <PropertyCard key={prop.id} property={prop} initialIsFavourite={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500 mt-1">Keep your contact details updated for property managers</p>
          </div>

          {profileMsg && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 bg-teal-800 text-white font-bold text-sm rounded-xl hover:bg-teal-900 transition-colors shadow-sm"
            >
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
