import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AdminDashboardStats, 
  PropertySummary, 
  UserProfile, 
  AuditLog, 
  PageResponse,
  PropertyStatus
} from '../types';
import api from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  AlertTriangle, 
  FileText, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  Unlock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'audit'>('moderation');

  // Properties list
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [propsLoading, setPropsLoading] = useState(false);

  // Users list
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Audit logs
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get<AdminDashboardStats>('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  const fetchProperties = async () => {
    setPropsLoading(true);
    try {
      const res = await api.get<PageResponse<PropertySummary>>('/admin/properties?size=50');
      setProperties(res.data.content);
    } catch (err) {
      console.error('Failed to load admin properties', err);
    } finally {
      setPropsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get<PageResponse<UserProfile>>('/admin/users?size=50');
      setUsersList(res.data.content);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await api.get<PageResponse<AuditLog>>('/admin/audit-logs?size=50');
      setLogs(res.data.content);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProperties();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'audit') fetchLogs();
  }, [activeTab]);

  const handleModerateProperty = async (propId: number, status: PropertyStatus) => {
    const note = window.prompt(`Enter moderation note for status ${status}:`) || 'Moderated by administrator';
    try {
      await api.patch(`/admin/properties/${propId}/moderate`, { status, moderationNote: note });
      await fetchProperties();
      await fetchStats();
      alert(`Property status updated to ${status}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Moderation action failed');
    }
  };

  const handleToggleFeature = async (propId: number) => {
    try {
      await api.patch(`/admin/properties/${propId}/feature`);
      await fetchProperties();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle featured status');
    }
  };

  const handleToggleUserStatus = async (targetUserId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to change user status to ${nextStatus}?`)) return;

    try {
      await api.patch(`/admin/users/${targetUserId}/status`, { status: nextStatus });
      await fetchUsers();
      alert(`User status changed to ${nextStatus}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            StayHyderabad Moderation Suite
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise accommodation listings, verify hostel owners, review bookings, and audit platform security.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          Logged in as: <strong className="text-white">{user?.email}</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <p className="text-2xl font-black text-slate-900">{stats?.totalUsers ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Hostel Owners</span>
          <p className="text-2xl font-black text-teal-800">{stats?.totalOwners ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Published Listings</span>
          <p className="text-2xl font-black text-emerald-700">{stats?.publishedProperties ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Review</span>
          <p className="text-2xl font-black text-amber-600">{stats?.pendingProperties ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
          <p className="text-2xl font-black text-blue-700">{stats?.totalBookings ?? 0}</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'moderation'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Listing Moderation ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Users & Owners ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'audit'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Audit Logs ({logs.length})
        </button>
      </div>

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {propsLoading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
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
                      <th className="px-6 py-4">Featured</th>
                      <th className="px-6 py-4 text-right">Moderation Actions</th>
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
                              <Link
                                to={`/properties/${prop.slug}`}
                                className="font-bold text-slate-900 text-sm hover:text-teal-800 flex items-center gap-1"
                              >
                                {prop.name}
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                              <span className="text-[10px] text-slate-500 uppercase">
                                {prop.genderCategory} • {prop.availableBeds} beds available
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {prop.locality}
                        </td>

                        <td className="px-6 py-4">
                          {prop.status === 'PUBLISHED' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              PUBLISHED
                            </span>
                          )}
                          {prop.status === 'PENDING_APPROVAL' && (
                            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              PENDING APPROVAL
                            </span>
                          )}
                          {prop.status === 'REJECTED' && (
                            <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              REJECTED
                            </span>
                          )}
                          {prop.status === 'DRAFT' && (
                            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              DRAFT
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleFeature(prop.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                              prop.isFeatured
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {prop.isFeatured ? 'Featured' : 'Make Featured'}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleModerateProperty(prop.id, 'PUBLISHED')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleModerateProperty(prop.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px]"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleModerateProperty(prop.id, 'ARCHIVED')}
                              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px]"
                            >
                              Archive
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {usersLoading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-bold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-slate-400 text-[11px]">{u.email}</p>
                          {u.businessName && <p className="text-teal-800 text-[10px]">Business: {u.businessName}</p>}
                        </td>

                        <td className="px-6 py-4 text-slate-700 font-mono">
                          {u.phone}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ROLE_ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : u.role === 'ROLE_OWNER'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role.replace('ROLE_', '')}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {u.role !== 'ROLE_ADMIN' && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                u.status === 'ACTIVE'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? 'Suspend User' : 'Reactivate User'}
                            </button>
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

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {logsLoading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">No audit logs recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-bold">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Entity</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 font-bold text-teal-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-mono">
                          {log.entityName} #{log.entityId}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-md truncate">
                          {log.details}
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

    </div>
  );
};
