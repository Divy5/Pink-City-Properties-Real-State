'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/context/PropertyContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { user, loading: authLoading, requireAuth, loans, updateLoanStatus } = useAuth();
  const { properties, loading: propLoading, toggleVerifyProperty, deleteProperty } = useProperties();
  const [adminTab, setAdminTab] = useState('properties');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!authLoading && !user) {
        requireAuth('/admin');
      }
    }
  }, [user, authLoading, requireAuth]);

  if (authLoading || propLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl animate-pulse font-bold text-slate-500">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!user) return null;

  // Authorization Wall Check: If user is logged in but is NOT an Admin
  if (user.role !== 'Admin') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 -z-10" />
        {/* Amber warnings glow */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.4 }} 
          className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-white/10 shadow-2xl text-center text-white"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 mb-6 text-red-500">
            <span className="material-symbols-outlined text-4xl">gavel</span>
          </div>
          
          <h1 className="font-jakarta font-extrabold text-3xl mb-3">Administrative Access Denied</h1>
          <p className="text-slate-300 mb-2 font-semibold">Authorization Failure (403 Forbidden)</p>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            You do not have the administrative privileges required to access this portal. Your current active role is <span className="text-amber-400 font-bold uppercase">{user.role || 'Buyer'}</span>. 
            Please consult with system owners or upgrade your user tier on your profile dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white shadow-lg transition-all"
            >
              Go to Profile Dashboard
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 rounded-xl font-bold border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard Statistics
  const totalListings = properties.length;
  const verifiedListings = properties.filter(p => p.badge === 'Verified').length;
  const standardListings = totalListings - verifiedListings;
  
  return (
    <div className="min-h-screen py-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Admin Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wider">Admin Center</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-bold uppercase">System Online</span>
            </div>
            <h1 className="font-jakarta font-extrabold text-4xl text-slate-900 mb-1">Administrative Control Panel</h1>
            <p className="text-slate-500 font-medium">Verify property listings, remove inactive ads, manage home loans, and view global platform activity stats.</p>
          </div>

          <button 
            onClick={() => router.push('/dashboard')}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span> Manage Profile
          </button>
        </motion.div>

        {/* Admin Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total active Listings', num: totalListings, icon: 'analytics', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
            { label: 'Verified Listings', num: verifiedListings, icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
            { label: 'Loan Requests Tracked', num: loans.length, icon: 'account_balance', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
            { label: 'System Health', num: '100% OK', icon: 'dns', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-[24px] bg-white border border-slate-200 shadow-sm flex items-center gap-5`}
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} border flex items-center justify-center ${stat.color} shrink-0`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.num}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Control Center Navigation Tabs */}
        <div className="flex gap-3 border-b border-slate-250 pb-4 mb-8">
          <button
            onClick={() => setAdminTab('properties')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${adminTab === 'properties' ? 'bg-slate-900 text-white border-transparent' : 'bg-white hover:bg-slate-100 text-slate-650 border border-slate-200'}`}
          >
            <span className="material-symbols-outlined text-[18px]">apartment</span> Properties Management ({properties.length})
          </button>
          <button
            onClick={() => setAdminTab('loans')}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${adminTab === 'loans' ? 'bg-slate-900 text-white border-transparent' : 'bg-white hover:bg-slate-100 text-slate-650 border border-slate-200'}`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span> Global Loans Manager ({loans.length})
          </button>
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {adminTab === 'properties' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4 bg-slate-50/50">
              <div>
                <h2 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Global Real Estate Management</h2>
                <p className="text-xs text-slate-500 font-medium">Verify credentials or immediately remove listings from public visibility.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/20">
                    <th className="py-4 px-8">Property Details</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Listed By</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Property Details */}
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                            <img src={p.images?.[0] || p.img} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate max-w-[220px]">
                            <p className="font-bold text-slate-900 text-sm truncate">{p.title}</p>
                            <p className="text-xs text-slate-500 font-semibold uppercase mt-0.5">{p.type}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-5 px-6 font-medium text-slate-600 text-sm">{p.location}</td>

                      {/* Price */}
                      <td className="py-5 px-6 font-bold text-primary text-sm">{p.priceDisplay}</td>

                      {/* Owner / listed by */}
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-800 text-xs">{p.listedBy || 'Owner'}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 break-all max-w-[150px]">{p.ownerEmail || 'guest@example.com'}</p>
                      </td>

                      {/* Verification Status */}
                      <td className="py-5 px-6">
                        {p.badge === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[12px] leading-none shrink-0 font-bold">verified</span> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[12px] leading-none shrink-0 font-bold">pending</span> Unverified
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-5 px-8 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => toggleVerifyProperty(p.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${p.badge === 'Verified' ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}
                          >
                            <span className="material-symbols-outlined text-sm shrink-0">gavel</span>
                            {p.badge === 'Verified' ? 'Unverify' : 'Verify'}
                          </button>
                          
                          <button
                            onClick={() => {
                              if (confirm(`Confirm deletion of listing "${p.title}"?`)) {
                                deleteProperty(p.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm shrink-0">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {properties.length === 0 && (
              <div className="text-center py-20 bg-slate-50/20">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">gavel</span>
                <p className="text-slate-500 font-bold">No property listings found in the system registry.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: GLOBAL LOANS APPLICATION MANAGER */}
        {adminTab === 'loans' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4 bg-slate-50/50">
              <div>
                <h2 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Global Home Loans Control Center</h2>
                <p className="text-xs text-slate-500 font-medium">Verify buyer income credentials, review checking limit files, and update loan underwriting statuses.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/20">
                    <th className="py-4 px-8">Application Reference</th>
                    <th className="py-4 px-6">Banking Partner</th>
                    <th className="py-4 px-6">Employment &amp; Income</th>
                    <th className="py-4 px-6">Requested Value</th>
                    <th className="py-4 px-6">Status Badge</th>
                    <th className="py-4 px-8 text-right">Change Underwriting Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((loan) => {
                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
                        case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
                        case 'Under Review': return 'bg-primary/10 text-primary border-primary/20';
                        case 'Documents Required': return 'bg-amber-50 text-amber-700 border-amber-250';
                        default: return 'bg-yellow-50 text-yellow-700 border-yellow-250';
                      }
                    };

                    return (
                      <tr key={loan.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* Application Reference */}
                        <td className="py-5 px-8">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ID: {loan.requestId || `REQ-${loan.id}`}</span>
                          <span className="font-bold text-slate-800 text-sm">Applied: {new Date(loan.date).toLocaleDateString()}</span>
                        </td>

                        {/* Banking Partner */}
                        <td className="py-5 px-6">
                          <span className="font-bold text-slate-900 text-sm block">{loan.bankName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Partner Tier</span>
                        </td>

                        {/* Employment & Income */}
                        <td className="py-5 px-6">
                          <span className="font-bold text-slate-800 text-xs block">{loan.employment}</span>
                          <span className="text-[10px] text-slate-500">Monthly Net: ₹{Number(loan.income).toLocaleString()}</span>
                        </td>

                        {/* Requested Value */}
                        <td className="py-5 px-6">
                          <span className="font-bold text-primary text-sm block">₹{Number(loan.amount || 2500000).toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400 font-bold">EMIs: ₹{Number(loan.emis || 0).toLocaleString()}</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center gap-1 border text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${getStatusColor(loan.status)}`}>
                            {loan.status || 'Pending'}
                          </span>
                        </td>

                        {/* Status Action Controls */}
                        <td className="py-5 px-8 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {[
                              { st: 'Pending', color: 'hover:bg-yellow-50 text-yellow-600' },
                              { st: 'Under Review', color: 'hover:bg-primary/10 text-primary' },
                              { st: 'Documents Required', color: 'hover:bg-amber-50 text-amber-600' },
                              { st: 'Approved', color: 'hover:bg-green-50 text-green-600' },
                              { st: 'Rejected', color: 'hover:bg-red-50 text-red-600' }
                            ].map((opt) => (
                              <button
                                key={opt.st}
                                onClick={() => updateLoanStatus(loan.id, opt.st)}
                                className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase transition-all shadow-sm ${loan.status === opt.st ? 'bg-slate-900 text-white border-transparent' : 'bg-white border-slate-200 ' + opt.color}`}
                                title={`Set status to ${opt.st}`}
                              >
                                {opt.st === 'Documents Required' ? 'Docs Reqd' : opt.st}
                              </button>
                            ))}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {loans.length === 0 && (
              <div className="text-center py-20 bg-slate-50/20">
                <span className="material-symbols-outlined text-5xl text-slate-350 mb-4 animate-bounce">account_balance</span>
                <p className="text-slate-500 font-bold">No global loan requests registered on the platform.</p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
