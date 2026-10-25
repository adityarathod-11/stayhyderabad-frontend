import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PropertyDetail, PropertySummary, RoomType } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ImageLightbox } from '../components/common/ImageLightbox';
import { BookingModal } from '../components/common/BookingModal';
import { PropertyCard } from '../components/common/PropertyCard';
import { 
  MapPin, 
  Bed, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Utensils, 
  Wifi, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  AlertCircle, 
  Check, 
  CheckCircle2,
  Calendar,
  ChevronRight,
  Info,
  Grid
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery and Modal states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomType | undefined>();

  // Favourite State
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Success Confirmation State
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PropertyDetail>(`/properties/${slug}`);
        setProperty(res.data);

        // Fetch similar properties in locality
        const simRes = await api.get<PropertySummary[]>(`/properties/${res.data.id}/similar?locality=${encodeURIComponent(res.data.locality)}`);
        setSimilarProperties(simRes.data);

        // Check favourite status if authenticated
        if (isAuthenticated) {
          api.get<{ isFavourite: boolean }>(`/favourites/${res.data.id}/check`)
            .then((favRes) => setIsFav(favRes.data.isFavourite))
            .catch(() => {});
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Property details could not be found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetails();
    }
  }, [slug, isAuthenticated]);

  const toggleFavourite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!property) return;
    setFavLoading(true);
    try {
      const res = await api.post<{ isFavourite: boolean }>(`/favourites/${property.id}`);
      setIsFav(res.data.isFavourite);
    } catch (err) {
      console.error('Failed to toggle favourite', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.name,
        text: `Check out ${property?.name} in ${property?.locality}, Hyderabad on StayHyderabad!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenBooking = (room?: RoomType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRoomForBooking(room);
    setBookingModalOpen(true);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWhatsAppLink = () => {
    const rawNumber = property?.whatsappNumber || property?.contactPhone || '9849012345';
    const clean = rawNumber.replace(/\D/g, '');
    const phoneWithCountry = clean.startsWith('91') ? clean : `91${clean}`;
    const text = encodeURIComponent(
      `Hello! I found your listing "${property?.name}" in ${property?.locality} on StayHyderabad. I would like to enquire about room availability.`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading accommodation details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Property Not Available</h2>
        <p className="text-sm text-slate-500">{error || 'This listing might have been unpublished or removed.'}</p>
        <Link
          to="/properties"
          className="inline-block mt-4 px-6 py-2.5 bg-teal-800 text-white rounded-xl font-bold text-sm"
        >
          Browse All Hyderabad PGs
        </Link>
      </div>
    );
  }

  const primaryPhoto = property.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
  const secondaryPhotos = property.images.slice(1, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-teal-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/properties" className="hover:text-teal-800">Hyderabad PGs</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/properties?locality=${encodeURIComponent(property.locality)}`} className="hover:text-teal-800">
          {property.locality}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{property.name}</span>
      </nav>

      {/* Booking Confirmation Alert (if user just booked) */}
      {confirmedBookingRef && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-scale-up">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-lg text-emerald-900">Booking Request Submitted Successfully!</h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your unique reference ID is <strong className="font-mono text-sm underline">{confirmedBookingRef}</strong>. The owner will review your move-in request.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
          >
            Track in Dashboard
          </Link>
        </div>
      )}

      {/* Property Title Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-teal-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {property.genderCategory.replace('_', ' ')}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified by StayHyderabad
            </span>
            <span className="text-xs text-slate-400">
              Updated {new Date(property.lastAvailabilityUpdate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.name}
          </h1>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-800 mt-2">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{property.addressLine}, {property.locality}, Hyderabad</span>
          </div>
        </div>

        {/* Action buttons (Share, Favourite) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={toggleFavourite}
            disabled={favLoading}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold ${
              isFav
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* High-Impact Image Gallery Grid */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/9] md:aspect-[21/9] max-h-[500px]">
          
          {/* Main Primary Photo */}
          <div 
            onClick={() => openLightboxAt(0)}
            className="md:col-span-2 relative cursor-pointer group overflow-hidden bg-slate-100"
          >
            <img
              src={primaryPhoto}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Secondary 2-Column Grid */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
            {secondaryPhotos.map((img, i) => (
              <div
                key={img.id || i}
                onClick={() => openLightboxAt(i + 1)}
                className="relative cursor-pointer group overflow-hidden bg-slate-100 aspect-[4/3]"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>

        </div>

        {/* View All Photos Button Overlay */}
        <button
          onClick={() => openLightboxAt(0)}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-extrabold text-slate-900 shadow-lg flex items-center gap-1.5 hover:bg-white transition-all"
        >
          <Grid className="w-4 h-4" /> View All {property.images.length} Photos
        </button>
      </section>

      {/* Main Content Layout: Details Left + Sticky Booking Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Columns (Details, Room Options, Amenities, Rules, Map) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Overview Highlights Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vacancy</span>
              <span className="text-base font-extrabold text-teal-800 flex items-center justify-center gap-1">
                <Bed className="w-4 h-4" /> {property.availableBeds} Beds Avail.
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gate Closing</span>
              <span className="text-base font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" /> {property.gateClosingTime}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Food Included</span>
              <span className="text-base font-extrabold text-emerald-800 flex items-center justify-center gap-1">
                <Utensils className="w-4 h-4" /> {property.foodIncluded ? '3 Times Food' : 'Self Cooking'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Notice Period</span>
              <span className="text-base font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4 text-teal-700" /> {property.noticePeriodDays} Days
              </span>
            </div>
          </div>

          {/* Room Categories & Pricing Table */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Room Categories & Monthly Rent</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your preferred sharing configuration. Prices are per person and include standard facilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.roomTypes.map((room) => (
                <div
                  key={room.id}
                  className="rounded-2xl border border-slate-200 p-5 hover:border-teal-700 transition-all bg-slate-50/50 flex flex-col justify-between space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {room.sharingType.replace('_', ' ')}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {room.hasAc && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                            Split AC
                          </span>
                        )}
                        {room.hasAttachedBathroom && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                            Attached Bath
                          </span>
                        )}
                        {room.hasBalcony && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                            Balcony
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">
                        {formatPrice(room.monthlyRent)}
                      </span>
                      <span className="text-xs text-slate-500 block">/month</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs">
                      {room.availableBeds > 0 ? (
                        <span className="text-emerald-700 font-bold">{room.availableBeds} beds available</span>
                      ) : (
                        <span className="text-rose-600 font-bold">Full</span>
                      )}
                    </span>

                    <button
                      onClick={() => handleOpenBooking(room)}
                      disabled={room.availableBeds <= 0}
                      className="px-4 py-2 bg-teal-800 hover:bg-teal-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Book Space
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          {property.description && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">About this Accommodation</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </section>
          )}

          {/* Amenities & Facilities */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Amenities & Inclusions</h2>
              <p className="text-xs text-slate-500 mt-1">Included in your monthly rent without hidden charges</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{amenity.name}</span>
                    {amenity.description && (
                      <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{amenity.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* House Rules & Schedule */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">House Rules & Timings</h2>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-950 space-y-2 whitespace-pre-line">
              {property.houseRules || 'Standard discipline guidelines apply. Gate closes at ' + property.gateClosingTime + '.'}
            </div>
          </section>

          {/* Location Map View */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Locality & Commute</h2>
              <p className="text-xs text-slate-500 mt-1">{property.addressLine}</p>
            </div>

            {/* OpenStreetMap Embedded Coordinates */}
            <div className="aspect-[16/8] rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
              <iframe
                title="Property Map Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(property.longitude ? Number(property.longitude) - 0.015 : 78.37)}%2C${(property.latitude ? Number(property.latitude) - 0.015 : 17.43)}%2C${(property.longitude ? Number(property.longitude) + 0.015 : 78.40)}%2C${(property.latitude ? Number(property.latitude) + 0.015 : 17.45)}&layer=mapnik&marker=${property.latitude || 17.44}%2C${property.longitude || 78.38}`}
                className="w-full h-full filter saturate-150"
              />
            </div>
          </section>

        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-6">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Starting Rent
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {formatPrice(property.startingMonthlyRent)}
                </span>
                <span className="text-xs font-semibold text-slate-500">/month</span>
              </div>
            </div>

            {/* Pricing Disclosures */}
            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-bold text-slate-900">{formatPrice(property.securityDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance Charges</span>
                <span className="font-bold text-slate-900">
                  {property.maintenanceCharge > 0 ? formatPrice(property.maintenanceCharge) : 'Included'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lock-in / Notice Period</span>
                <span className="font-bold text-slate-900">{property.noticePeriodDays} Days</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-4 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                Request Booking
              </button>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Guarantee Note */}
            <div className="text-center">
              <p className="text-[11px] text-slate-400">
                🔒 Guaranteed Zero Brokerage. Real vacancy check on server before booking confirmation.
              </p>
            </div>

            {/* Owner Info Box */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
                {property.ownerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{property.ownerName}</p>
                <p className="text-[11px] text-slate-500">Property Manager • Verified</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Similar Properties Nearby */}
      {similarProperties.length > 0 && (
        <section className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Similar Accommodations in {property.locality}
            </h2>
            <Link to={`/properties?locality=${encodeURIComponent(property.locality)}`} className="text-xs font-bold text-teal-800 hover:text-teal-900">
              View All in {property.locality} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Component */}
      {lightboxOpen && (
        <ImageLightbox
          images={property.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          property={property}
          initialRoomType={selectedRoomForBooking}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={(ref) => {
            setBookingModalOpen(false);
            setConfirmedBookingRef(ref);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

    </div>
  );
};
