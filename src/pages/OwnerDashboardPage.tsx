import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  OwnerDashboardStats, 
  PropertySummary, 
  Booking, 
  Enquiry, 
  PageResponse,
  GenderCategory,
  FoodType,
  SharingType
} from '../types';
import api from '../services/api';
import { 
  Building2, 
  Bed, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Upload, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Edit3, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'enquiries'>('listings');

  // Listings state
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Modal State for New Property
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newLocality, setNewLocality] = useState('Madhapur');
  const [newAddress, setNewAddress] = useState('');
  const [newGender, setNewGender] = useState<GenderCategory>('CO_LIVING');
  const [newFoodType, setNewFoodType] = useState<FoodType>('VEG_AND_NON_VEG');
  const [newGateTime, setNewGateTime] = useState('11:00 PM');
  const [newStartRent, setNewStartRent] = useState('9500');
  const [newDeposit, setNewDeposit] = useState('5000');
  const [newDesc, setNewDesc] = useState('');
  const [newRules, setNewRules] = useState('');
  const [savingNewProp, setSavingNewProp] = useState(false);
  const [propModalError, setPropModalError] = useState<string | null>(null);

  // Photo Upload Modal State
  const [uploadModalPropertyId, setUploadModalPropertyId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoCategory, setPhotoCategory] = useState('BEDROOM');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get<OwnerDashboardStats>('/owner/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load owner stats', err);
    }
  };

  const fetchProperties = async () => {
    setLoadingProps(true);
    try {
      const res = await api.get<PageResponse<PropertySummary>>('/owner/properties?size=30');
      setProperties(res.data.content);
    } catch (err) {
      console.error('Failed to load owner properties', err);
    } finally {
      setLoadingProps(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get<PageResponse<Booking>>('/owner/bookings?size=30');
      setBookings(res.data.content);
    } catch (err) {
      console.error('Failed to load owner bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const res = await api.get<PageResponse<Enquiry>>('/owner/enquiries?size=30');
      setEnquiries(res.data.content);
    } catch (err) {
      console.error('Failed to load owner enquiries', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProperties();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'enquiries') fetchEnquiries();
  }, [activeTab]);

  const handleTogglePublish = async (propId: number) => {
    try {
      await api.patch(`/owner/properties/${propId}/publish`);
      await fetchProperties();
      await fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: 'ACCEPTED' | 'REJECTED') => {
    const note = window.prompt(`Enter an optional note for ${status.toLowerCase()} action:`) || '';
    try {
      await api.patch(`/owner/bookings/${bookingId}`, {
        status,
        ownerNote: note,
      });
      await fetchBookings();
      await fetchStats();
      alert(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setPropModalError(null);
    setSavingNewProp(true);

    try {
      await api.post('/owner/properties', {
        name: newPropName,
        locality: newLocality,
        addressLine: newAddress,
        genderCategory: newGender,
        foodIncluded: true,
        foodType: newFoodType,
        gateClosingTime: newGateTime,
        startingMonthlyRent: Number(newStartRent),
        securityDeposit: Number(newDeposit),
        description: newDesc,
        houseRules: newRules,
        contactPhone: user?.phone,
        whatsappNumber: user?.phone,
        roomTypes: [
          {
            sharingType: 'DOUBLE',
            monthlyRent: Number(newStartRent),
            securityDeposit: Number(newDeposit),
            totalBeds: 10,
            availableBeds: 4,
            hasAc: true,
            hasAttachedBathroom: true,
            hasBalcony: false,
          },
          {
            sharingType: 'TRIPLE',
            monthlyRent: Math.max(1000, Number(newStartRent) - 1500),
            securityDeposit: Number(newDeposit),
            totalBeds: 12,
            availableBeds: 3,
            hasAc: false,
            hasAttachedBathroom: true,
            hasBalcony: false,
          },
        ],
      });

      setShowAddModal(false);
      await fetchProperties();
      await fetchStats();
      alert('Hostel listing created successfully!');
    } catch (err: any) {
      setPropModalError(err.response?.data?.message || 'Failed to create property.');
    } finally {
      setSavingNewProp(false);
    }
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalPropertyId || !selectedFile) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('caption', photoCaption || 'Room View');
    formData.append('category', photoCategory);

    try {
      await api.post(`/owner/properties/${uploadModalPropertyId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadModalPropertyId(null);
      setSelectedFile(null);
      await fetchProperties();
      alert('Photo uploaded successfully to Cloudinary storage!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
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
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Hostel Owner Portal
            </span>
            <span className="text-xs text-slate-400">• {user?.businessName || 'Verified Property Manager'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your Hyderabad PG listings, track live vacancies, and review move-in requests.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          Add New Hostel Listing
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Published PGs</span>
            <Building2 className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.publishedProperties ?? 0}</p>
          <p className="text-[10px] text-slate-400">of {stats?.totalProperties ?? 0} total listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Beds</span>
            <Bed className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{stats?.availableBeds ?? 0}</p>
          <p className="text-[10px] text-slate-400">across all room sharing types</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Bookings</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats?.pendingBookings ?? 0}</p>
          <p className="text-[10px] text-slate-400">awaiting your approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Guest Enquiries</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalEnquiries ?? 0}</p>
          <p className="text-[10px] text-slate-400">inquiries & WhatsApp clicks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'listings'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Properties ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'bookings'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Booking Requests ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'enquiries'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Listings Tab Content */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {loadingProps ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No properties added yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first hostel or PG listing in Madhapur, Gachibowli, or any Hyderabad locality.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-teal-800 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                Add First Property
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-bold">
                    <tr>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Locality</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Vacancy</th>
                      <th className="px-6 py-4">Rent</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.primaryImageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{prop.name}</p>
                              <span className="text-[10px] text-slate-500 uppercase">
                                {prop.genderCategory.replace('_', ' ')} • {prop.imageCount} photos
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {prop.locality}
                        </td>

                        <td className="px-6 py-4">
                          {prop.status === 'PUBLISHED' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              Live / Published
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              {prop.status}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-extrabold text-teal-900">
                            {prop.availableBeds} / {prop.totalBeds} beds
                          </span>
                        </td>

                        <td className="px-6 py-4 font-extrabold text-slate-900">
                          {formatPrice(prop.startingMonthlyRent)}/mo
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setUploadModalPropertyId(prop.id)}
                              className="p-2 text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Upload Photos"
                            >
                              <Upload className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleTogglePublish(prop.id)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title={prop.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            >
                              {prop.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4 text-amber-700" /> : <Eye className="w-4 h-4 text-emerald-700" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab Content */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {loadingBookings ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No booking requests received yet</h3>
              <p className="text-xs text-slate-500">When guests apply for your rooms, they will appear here for review.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-bold">
                    <tr>
                      <th className="px-6 py-4">Ref & Property</th>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Room & Move-in</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs font-bold text-teal-800">{b.bookingReference}</p>
                          <p className="font-bold text-slate-900 mt-0.5">{b.propertyName}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{b.applicantName}</p>
                          <p className="text-slate-500">{b.applicantPhone}</p>
                          <p className="text-slate-400 text-[10px]">{b.applicantEmail}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{b.sharingType.replace('_', ' ')}</p>
                          <p className="text-slate-500">Move-in: {b.preferredMoveInDate}</p>
                          <p className="font-mono text-slate-600">{formatPrice(b.monthlyRentLocked)}/mo</p>
                        </td>

                        <td className="px-6 py-4">
                          {b.status === 'PENDING' && (
                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Pending Review</span>
                          )}
                          {b.status === 'ACCEPTED' && (
                            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Accepted (Bed Allocated)</span>
                          )}
                          {b.status === 'REJECTED' && (
                            <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full font-bold">Rejected</span>
                          )}
                          {b.status === 'CANCELLED' && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">Cancelled</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {b.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'ACCEPTED')}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors shadow-2xs"
                              >
                                Accept & Lock Bed
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors shadow-2xs"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enquiries Tab Content */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {loadingEnquiries ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No guest enquiries recorded yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{enq.name}</p>
                      <p className="text-xs text-teal-800 font-semibold">{enq.phone}</p>
                    </div>
                    {enq.isWhatsapp && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        WhatsApp Click
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">For: {enq.propertyName}</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{enq.message}"
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Received on {new Date(enq.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add New Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Add New Hostel Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {propModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{propModalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block uppercase mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Sri Balaji Luxury Co-Living"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-normal focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase mb-1">Locality *</label>
                  <select
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-normal bg-white"
                  >
                    <option value="Madhapur">Madhapur</option>
                    <option value="HITEC City">HITEC City</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Kondapur">Kondapur</option>
                    <option value="Ameerpet">Ameerpet</option>
                    <option value="Kukatpally">Kukatpally</option>
                    <option value="Miyapur">Miyapur</option>
                    <option value="Dilsukhnagar">Dilsukhnagar</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase mb-1">Accommodation Type *</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as GenderCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-normal bg-white"
                  >
                    <option value="CO_LIVING">Co-Living Space</option>
                    <option value="MALE">Boys Hostel / PG</option>
                    <option value="FEMALE">Girls Hostel / PG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase mb-1">Full Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Plot 45, Near Cyber Towers, Madhapur"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-normal focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase mb-1">Starting Rent (₹/mo) *</label>
                  <input
                    type="number"
                    required
                    value={newStartRent}
                    onChange={(e) => setNewStartRent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-normal focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block uppercase mb-1">Security Deposit (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-normal focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Spacious rooms, fiber Wi-Fi, daily housekeeping..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-normal focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNewProp}
                  className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold shadow-md"
                >
                  {savingNewProp ? 'Saving...' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Photo Upload Modal */}
      {uploadModalPropertyId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Upload Room / Property Photograph</h3>
              <button onClick={() => setUploadModalPropertyId(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block uppercase mb-1.5">Select Image File (JPG/PNG/WEBP)</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-sm font-normal file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100"
                />
              </div>

              <div>
                <label className="block uppercase mb-1">Photo Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-normal bg-white"
                >
                  <option value="BEDROOM">Bedroom</option>
                  <option value="BATHROOM">Bathroom</option>
                  <option value="DINING">Dining & Food Area</option>
                  <option value="COMMON_AREA">Common Lounge</option>
                  <option value="FACADE">Building Facade</option>
                </select>
              </div>

              <div>
                <label className="block uppercase mb-1">Caption</label>
                <input
                  type="text"
                  placeholder="E.g. AC Double Sharing Room"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-normal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalPropertyId(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPhoto || !selectedFile}
                  className="px-5 py-2 bg-teal-800 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {uploadingPhoto ? 'Uploading to Cloudinary...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
