import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PropertySummary, GenderCategory } from '../types';
import api from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { PropertyGridSkeleton } from '../components/common/LoadingSkeleton';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Home, 
  Users, 
  Coffee, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Building
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedGender, setSelectedGender] = useState<GenderCategory | ''>('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get<PropertySummary[]>('/properties/featured');
        setFeaturedProperties(res.data);
      } catch (err) {
        console.error('Failed to load featured properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocality) params.append('locality', selectedLocality);
    if (selectedBudget) params.append('maxRent', selectedBudget);
    if (selectedGender) params.append('genderCategory', selectedGender);
    navigate(`/properties?${params.toString()}`);
  };

  const hyderabadHubs = [
    { name: 'Madhapur', tag: 'IT Corridors & Nightlife', count: '45+ PGs', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80' },
    { name: 'HITEC City', tag: 'Walk to Mindspace & Tech Parks', count: '38+ PGs', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
    { name: 'Gachibowli', tag: 'Financial District & Microsoft', count: '52+ PGs', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kondapur', tag: 'Peaceful & Near Botanical Garden', count: '29+ PGs', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ameerpet', tag: 'Metro Hub & Coaching Institutes', count: '60+ Hostels', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kukatpally', tag: 'Near JNTU & Shopping Malls', count: '34+ PGs', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80' },
    { name: 'Miyapur', tag: 'Affordable Metro Terminus', count: '22+ PGs', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dilsukhnagar', tag: 'East Hyderabad Student Center', count: '26+ Hostels', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white overflow-hidden">
        {/* Ambient background glowing circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hyderabad's #1 Dedicated PG & Hostel Discovery Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find Your Perfect PG in <span className="text-amber-400">Hyderabad</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore verified hostels and co-living spaces for students, freshers, and professionals. Real photographs, accurate vacancy counts, and zero brokerage.
            </p>
          </div>

          {/* Interactive Search Bar Box */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-200 text-slate-800">
            {/* Gender Category Tabs */}
            <div className="flex border-b border-slate-100 pb-3 mb-4 px-2 gap-2 overflow-x-auto">
              {[
                { label: 'All Accommodations', value: '' },
                { label: 'Boys PGs', value: 'MALE' },
                { label: 'Girls PGs', value: 'FEMALE' },
                { label: 'Co-Living Spaces', value: 'CO_LIVING' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.value}
                  onClick={() => setSelectedGender(tab.value as GenderCategory | '')}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    selectedGender === tab.value
                      ? 'bg-teal-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Locality Input */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                  Area or Locality
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-800 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl text-sm font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700 transition-all cursor-pointer"
                  >
                    <option value="">Any Area in Hyderabad</option>
                    <option value="Madhapur">Madhapur (Cyber Towers)</option>
                    <option value="HITEC City">HITEC City (Mindspace)</option>
                    <option value="Gachibowli">Gachibowli (DLF Cyber City)</option>
                    <option value="Kondapur">Kondapur (Botanical Garden)</option>
                    <option value="Ameerpet">Ameerpet (Metro Hub)</option>
                    <option value="Kukatpally">Kukatpally (JNTU / KPHB)</option>
                    <option value="Miyapur">Miyapur</option>
                    <option value="Dilsukhnagar">Dilsukhnagar</option>
                  </select>
                </div>
              </div>

              {/* Monthly Budget Input */}
              <div className="md:col-span-4 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                  Monthly Budget
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl text-sm font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700 transition-all cursor-pointer"
                >
                  <option value="">Any Budget</option>
                  <option value="8000">Under ₹8,000 / month</option>
                  <option value="12000">Under ₹12,000 / month</option>
                  <option value="16000">Under ₹16,000 / month</option>
                  <option value="20000">Under ₹20,000 / month</option>
                </select>
              </div>

              {/* Search Submit Button */}
              <div className="md:col-span-3 pt-2 md:pt-5">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  Search Hostels
                </button>
              </div>

            </form>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Room Photos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Live Bed Availability
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Brokerage Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Owner WhatsApp
            </span>
          </div>

        </div>
      </section>

      {/* Popular Hyderabad Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Prime Localities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Popular Hyderabad Hubs
            </h2>
          </div>
          <Link
            to="/properties"
            className="text-sm font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 group"
          >
            Browse All Locations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {hyderabadHubs.map((hub) => (
            <Link
              key={hub.name}
              to={`/properties?locality=${encodeURIComponent(hub.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={hub.image}
                alt={hub.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  {hub.count}
                </span>
                <h3 className="text-base sm:text-lg font-bold group-hover:text-amber-300 transition-colors">
                  {hub.name}
                </h3>
                <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                  {hub.tag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Handpicked Accommodations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Verified Hostels & PGs
            </h2>
          </div>
          <Link
            to="/properties"
            className="text-sm font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 group"
          >
            View All ({featuredProperties.length || '...'}) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <PropertyGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits / Why Choose StayHyderabad */}
      <section className="bg-slate-100 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              The StayHyderabad Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Why 10,000+ Freshers & Techies Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-teal-800" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">100% Verified Info</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every hostel goes through audit verification. Real bedroom photographs, verified house rules, and gate closing timings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Zero Brokerage</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connect directly with property managers and owners. No middlemen, no commissions, and clear security deposit terms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Food & Amenities</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Compare South & North Indian meal options, high-speed Wi-Fi speeds, washing machines, power backup, and attached bathrooms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Live Bed Vacancies</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Check exact available beds by room-sharing category before traveling for physical inspections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How StayHyderabad Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-amber-300 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Search & Filter</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Filter by Hyderabad IT hubs, budget in INR, gender categories, food inclusion, and AC options.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-amber-300 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Check Photos & Vacancy</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Inspect bedroom and washroom photographs, verify rules and food menus, and check bed availability.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-amber-300 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Request Booking or Chat</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Submit your move-in request with locked rent or contact the owner directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Owner Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              Hostel & PG Owners
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Own a Hostel in Hyderabad? Fill Your Vacancies Faster.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              List your property on StayHyderabad to reach verified bachelors, students, and IT professionals. Manage room types, upload photos, and track booking requests with an intuitive portal.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register?role=ROLE_OWNER"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl text-center shadow-lg transition-all"
            >
              Register as Owner
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl text-center border border-white/20 transition-all"
            >
              Owner Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
