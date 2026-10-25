import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertySummary, GenderCategory } from '../../types';
import { MapPin, Heart, Wifi, Utensils, Bed, Image as ImageIcon, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface PropertyCardProps {
  property: PropertySummary;
  initialIsFavourite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, initialIsFavourite = false }) => {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(initialIsFavourite);
  const [favLoading, setFavLoading] = useState(false);

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
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

  const getGenderBadge = (gender: GenderCategory) => {
    switch (gender) {
      case 'MALE':
        return <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Boys PG</span>;
      case 'FEMALE':
        return <span className="bg-pink-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Girls PG</span>;
      case 'CO_LIVING':
        return <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Co-Living</span>;
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
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Top Image & Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.primaryImageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {getGenderBadge(property.genderCategory)}
          {property.isFeatured && (
            <span className="bg-amber-500 text-slate-900 text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Favourite Button */}
        <button
          onClick={toggleFav}
          disabled={favLoading}
          aria-label="Save property"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-rose-600 hover:scale-110 active:scale-95 transition-all shadow-md z-10"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
        </button>

        {/* Bottom Image Stats (Vacancy + Photo count) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <Bed className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {property.availableBeds > 0 ? (
                <span className="text-emerald-300 font-bold">{property.availableBeds} beds available</span>
              ) : (
                <span className="text-rose-300 font-bold">Currently Full</span>
              )}
            </span>
          </div>

          {property.imageCount > 0 && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
              <ImageIcon className="w-3 h-3 text-slate-300" />
              <span>{property.imageCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Landmark */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">{property.locality}</span>
            {property.landmark && (
              <span className="text-slate-400 lowercase">• {property.landmark}</span>
            )}
          </div>

          {/* Property Name */}
          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1 hover:text-teal-800 transition-colors">
              {property.name}
            </h3>
          </Link>

          {/* Room Sharing Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {property.sharingTypes.map((type) => (
              <span
                key={type}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
              >
                {type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>

          {/* Amenities Summary */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
            {property.foodIncluded && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <Utensils className="w-3.5 h-3.5" /> Food Included
              </span>
            )}
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-teal-700" /> High-speed Wi-Fi
            </span>
          </div>
        </div>

        {/* Card Footer: Rent and CTA */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Starts from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(property.startingMonthlyRent)}
              </span>
              <span className="text-xs text-slate-500 font-normal">/mo</span>
            </div>
          </div>

          <Link
            to={`/properties/${property.slug}`}
            className="text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
};
