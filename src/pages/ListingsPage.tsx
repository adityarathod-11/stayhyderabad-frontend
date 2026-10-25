import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertySummary, PageResponse, GenderCategory, SharingType } from '../types';
import api from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { PropertyGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Filter, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL params
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [genderCategory, setGenderCategory] = useState<string>(searchParams.get('genderCategory') || '');
  const [sharingType, setSharingType] = useState<string>(searchParams.get('sharingType') || '');
  const [foodIncluded, setFoodIncluded] = useState(searchParams.get('foodIncluded') === 'true');
  const [hasAc, setHasAc] = useState(searchParams.get('hasAc') === 'true');
  const [hasAttachedBathroom, setHasAttachedBathroom] = useState(searchParams.get('hasAttachedBathroom') === 'true');
  const [availableBedsOnly, setAvailableBedsOnly] = useState(searchParams.get('availableBedsOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || '0'));

  // Data State
  const [data, setData] = useState<PageResponse<PropertySummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [localitiesList, setLocalitiesList] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load distinct localities
  useEffect(() => {
    api.get<string[]>('/properties/localities')
      .then((res) => setLocalitiesList(res.data))
      .catch((err) => console.error('Failed to load localities', err));
  }, []);

  // Sync state to URL and fetch properties
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (locality) params.set('locality', locality);
    if (minRent) params.set('minRent', minRent);
    if (maxRent) params.set('maxRent', maxRent);
    if (genderCategory) params.set('genderCategory', genderCategory);
    if (sharingType) params.set('sharingType', sharingType);
    if (foodIncluded) params.set('foodIncluded', 'true');
    if (hasAc) params.set('hasAc', 'true');
    if (hasAttachedBathroom) params.set('hasAttachedBathroom', 'true');
    if (availableBedsOnly) params.set('availableBedsOnly', 'true');
    if (sortBy) params.set('sortBy', sortBy);
    params.set('page', currentPage.toString());
    params.set('size', '12');

    setSearchParams(params, { replace: true });

    try {
      const res = await api.get<PageResponse<PropertySummary>>(`/properties?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  }, [
    locality, minRent, maxRent, genderCategory, sharingType, 
    foodIncluded, hasAc, hasAttachedBathroom, availableBedsOnly, 
    sortBy, currentPage, setSearchParams
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleResetFilters = () => {
    setLocality('');
    setMinRent('');
    setMaxRent('');
    setGenderCategory('');
    setSharingType('');
    setFoodIncluded(false);
    setHasAc(false);
    setHasAttachedBathroom(false);
    setAvailableBedsOnly(false);
    setSortBy('newest');
    setCurrentPage(0);
  };

  const hyderabadLocalities = [
    'Madhapur', 'HITEC City', 'Gachibowli', 'Kondapur', 
    'Ameerpet', 'Kukatpally', 'Miyapur', 'Dilsukhnagar'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Mobile Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hostels & PGs in Hyderabad
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {loading ? (
              'Searching verified properties...'
            ) : (
              <span>
                Showing <strong className="text-slate-900">{data?.totalElements || 0}</strong> verified properties
                {locality && <span> in <strong className="text-teal-800">{locality}</strong></span>}
              </span>
            )}
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-800" />
            Filters
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-sm text-xs w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(0);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="newest">Newest Listings</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="updated">Recently Updated Availability</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Listings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block md:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-800" /> Filter Listings
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Locality Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Locality
            </label>
            <select
              value={locality}
              onChange={(e) => {
                setLocality(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="">All Hyderabad Areas</option>
              {hyderabadLocalities.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Gender / Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Gender Category
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Categories', value: '' },
                { label: 'Boys PG / Hostels', value: 'MALE' },
                { label: 'Girls PG / Hostels', value: 'FEMALE' },
                { label: 'Co-Living Spaces', value: 'CO_LIVING' },
              ].map((cat) => (
                <label key={cat.value} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="genderFilter"
                    checked={genderCategory === cat.value}
                    onChange={() => {
                      setGenderCategory(cat.value);
                      setCurrentPage(0);
                    }}
                    className="text-teal-800 focus:ring-teal-700 h-3.5 w-3.5"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Sharing Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Room Sharing
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Any Sharing', value: '' },
                { label: 'Single Private Room', value: 'SINGLE' },
                { label: 'Double Sharing', value: 'DOUBLE' },
                { label: 'Triple Sharing', value: 'TRIPLE' },
                { label: 'Four Sharing', value: 'FOUR_SHARING' },
              ].map((sh) => (
                <label key={sh.value} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sharingFilter"
                    checked={sharingType === sh.value}
                    onChange={() => {
                      setSharingType(sh.value);
                      setCurrentPage(0);
                    }}
                    className="text-teal-800 focus:ring-teal-700 h-3.5 w-3.5"
                  />
                  <span>{sh.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Monthly Budget Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Monthly Budget (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minRent}
                onChange={(e) => {
                  setMinRent(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxRent}
                onChange={(e) => {
                  setMaxRent(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Amenities & Availability Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Preferences
            </label>
            
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableBedsOnly}
                onChange={(e) => {
                  setAvailableBedsOnly(e.target.checked);
                  setCurrentPage(0);
                }}
                className="rounded text-teal-800 focus:ring-teal-700"
              />
              <span className="font-semibold text-emerald-800">Available Beds Only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={foodIncluded}
                onChange={(e) => {
                  setFoodIncluded(e.target.checked);
                  setCurrentPage(0);
                }}
                className="rounded text-teal-800 focus:ring-teal-700"
              />
              <span>Food Included</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAc}
                onChange={(e) => {
                  setHasAc(e.target.checked);
                  setCurrentPage(0);
                }}
                className="rounded text-teal-800 focus:ring-teal-700"
              />
              <span>Air Conditioned (AC)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAttachedBathroom}
                onChange={(e) => {
                  setHasAttachedBathroom(e.target.checked);
                  setCurrentPage(0);
                }}
                className="rounded text-teal-800 focus:ring-teal-700"
              />
              <span>Attached Bathroom</span>
            </label>
          </div>

        </aside>

        {/* Listings Result Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <PropertyGridSkeleton count={6} />
          ) : !data || data.content.length === 0 ? (
            <EmptyState
              title="No properties match your filters"
              description="Try broadening your budget range, clearing specific amenities, or searching another popular Hyderabad hub."
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.content.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* Pagination Controls */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-200">
                  <button
                    disabled={data.first}
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold text-slate-700">
                    Page {data.number + 1} of {data.totalPages}
                  </span>

                  <button
                    disabled={data.last}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-base">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile locality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Locality</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
              >
                <option value="">All Hyderabad Areas</option>
                {hyderabadLocalities.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Mobile Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Gender Category</label>
              <div className="space-y-1 text-xs">
                {['', 'MALE', 'FEMALE', 'CO_LIVING'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="m_gender"
                      checked={genderCategory === cat}
                      onChange={() => setGenderCategory(cat)}
                    />
                    <span>{cat || 'All Categories'}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileFilterOpen(false);
                fetchProperties();
              }}
              className="w-full py-3 bg-teal-800 text-white font-bold rounded-xl text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
