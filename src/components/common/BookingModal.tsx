import React, { useState } from 'react';
import { PropertyDetail, RoomType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { X, Calendar, User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  property: PropertyDetail;
  initialRoomType?: RoomType;
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  initialRoomType,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<number>(
    initialRoomType?.id || (property.roomTypes[0]?.id ?? 0)
  );
  const [moveInDate, setMoveInDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [numPersons, setNumPersons] = useState<number>(1);
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [message, setMessage] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = property.roomTypes.find((r) => r.id === selectedRoomId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRoomId) {
      setError('Please select a room category');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('Please provide all required contact information');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        propertyId: property.id,
        roomTypeId: selectedRoomId,
        preferredMoveInDate: moveInDate,
        numPersons,
        applicantName: fullName.trim(),
        applicantPhone: phone.trim(),
        applicantEmail: email.trim(),
        message: message.trim(),
      });

      onSuccess(res.data.bookingReference);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit booking request. Please check availability and try again.';
      setError(msg);
    } finally {
      setLoading(false);
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-teal-900 text-white p-6 flex items-start justify-between">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              Booking Request
            </span>
            <h2 className="text-xl font-bold mt-1 text-white">{property.name}</h2>
            <p className="text-xs text-teal-200 mt-0.5">{property.locality}, Hyderabad</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-teal-300 hover:text-white hover:bg-teal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Room Sharing Option *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {property.roomTypes.map((rt) => {
                const isSelected = rt.id === selectedRoomId;
                const isAvailable = rt.availableBeds > 0;
                return (
                  <button
                    type="button"
                    key={rt.id}
                    disabled={!isAvailable}
                    onClick={() => setSelectedRoomId(rt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-800 bg-teal-50/50 ring-2 ring-teal-800'
                        : isAvailable
                        ? 'border-slate-200 hover:border-slate-300 bg-white'
                        : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {rt.sharingType.replace('_', ' ')}
                      </span>
                      {rt.hasAc && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                          AC
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-extrabold text-teal-900">
                      {formatPrice(rt.monthlyRent)}
                      <span className="text-[11px] font-normal text-slate-500">/mo</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {rt.availableBeds > 0 ? (
                        <span className="text-emerald-700 font-medium">{rt.availableBeds} beds available</span>
                      ) : (
                        <span className="text-rose-600 font-medium">Sold Out</span>
                      )}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates and Persons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Move-in Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={moveInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Number of Guests
              </label>
              <select
                value={numPersons}
                onChange={(e) => setNumPersons(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 Persons</option>
                <option value={3}>3 Persons</option>
                <option value={4}>4 Persons</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Note to Owner (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="E.g. Working at Cyber Towers, looking for AC double sharing near metro..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Pricing Summary Box */}
          {selectedRoom && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Monthly Rent (Locked)</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedRoom.monthlyRent)}/mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit (Refundable)</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedRoom.securityDeposit)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Notice Period</span>
                <span className="font-bold text-slate-900">{property.noticePeriodDays} Days</span>
              </div>
              <p className="text-[11px] text-teal-800 pt-1 font-medium">
                Zero booking fees or brokerage. Pay rent and deposit directly to property owner upon visit.
              </p>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
