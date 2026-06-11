'use client';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/context/PropertyContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function RentClient() {
  const { properties, loading } = useProperties();
  const searchParams = useSearchParams();

  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || '';
  const initialBudget = searchParams.get('budget') || '';

  const [search, setSearch] = useState(initialLocation);
  const [filter, setFilter] = useState(initialType || 'All');
  const [budget, setBudget] = useState(initialBudget);

  useEffect(() => {
    setSearch(searchParams.get('location') || '');
    setFilter(searchParams.get('type') || 'All');
    setBudget(searchParams.get('budget') || '');
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (t) => {
    setFilter(t);
  };

  // Sync parameters back to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('location', search);
    if (filter !== 'All') params.set('type', filter);
    if (budget) params.set('budget', budget);
    const queryString = params.toString();
    const newUrl = queryString ? `/rent?${queryString}` : '/rent';
    window.history.replaceState(null, '', newUrl);
  }, [search, filter, budget]);

  const rentProperties = properties.filter(p => p.listingType === 'Rent');
  const types = ['All', ...new Set(rentProperties.map(p => p.type))];

  const filtered = rentProperties.filter(p => {
    const matchType = filter === 'All' || p.type.toLowerCase().includes(filter.toLowerCase());
    const searchLower = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(searchLower) || p.location.toLowerCase().includes(searchLower);
    
    // For rent, price might be per month. If budget is set, compare.
    const matchBudget = !budget || p.price <= parseInt(budget, 10);
    return matchType && matchSearch && matchBudget;
  });

  const displayLocation = search ? search.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="font-jakarta font-extrabold text-display-xl mb-2"
      >
        Rent <span className="text-gradient">Properties</span> {displayLocation && `in ${displayLocation}`}
      </motion.h1>
      <p className="text-on-surface-variant text-body-lg mb-10">Find premium rental options in Jaipur&apos;s most sought-after neighborhoods.</p>
      
      {/* Search & Filter */}
      <div className="glass-panel rounded-2xl p-4 mb-10 border border-white/40 shadow-lg flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200/50 focus:ring-2 focus:ring-primary outline-none font-bold" 
            placeholder="Search rental location or name..." 
            value={search} 
            onChange={handleSearchChange} 
          />
        </div>
        <div className="w-full lg:w-48 relative font-bold">
          <select
            className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50/50 border border-slate-200/50 focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer text-slate-700"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Max Rent /mo</option>
            <option value="15000">₹15,000</option>
            <option value="30000">₹30,000</option>
            <option value="50000">₹50,000</option>
            <option value="100000">₹1,00,000</option>
            <option value="250000">₹2,50,000</option>
          </select>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none select-none">payments</span>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">expand_more</span>
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          {types.map(t => (
            <button 
              key={t} 
              onClick={() => handleFilterChange(t)} 
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === t || filter.toLowerCase() === t.toLowerCase() ? 'accent-gradient text-white font-extrabold shadow-sm' : 'bg-slate-50/50 text-slate-600 border border-slate-200/50 hover:bg-primary-fixed'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 py-10 animate-pulse font-bold">Loading rental properties...</p>
        ) : (
          filtered.map((p, i) => {
            const displayPrice = p.price < 500000 ? `₹${p.price.toLocaleString()} /mo` : `₹${Math.round(p.price / 12000).toLocaleString()}k /mo`;
            return (
              <PropertyCard 
                key={p.id} 
                property={{ ...p, priceDisplay: p.priceDisplay || displayPrice }} 
                index={i} 
              />
            );
          })
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No rental properties found in {displayLocation || 'this location'}</h3>
          <p className="text-slate-500 mb-8 max-w-md">We couldn&apos;t find any rental listings matching your filters. Try checking other premium localities in Jaipur.</p>
        </div>
      )}
    </div>
  );
}
