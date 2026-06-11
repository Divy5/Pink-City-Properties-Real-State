'use client';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/context/PropertyContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BuyClient() {
  const { properties, loading } = useProperties();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Sync back to URL when user updates filters manually in Buy page
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('location', search);
    if (filter !== 'All') params.set('type', filter);
    if (budget) params.set('budget', budget);
    const queryString = params.toString();
    const newUrl = queryString ? `/buy?${queryString}` : '/buy';
    
    window.history.replaceState(null, '', newUrl);
  }, [search, filter, budget]);

  const types = ['All', ...new Set(properties.map(p => p.type))];

  const filtered = properties.filter(p => {
    const matchListing = p.listingType === 'Sell';
    const matchType = filter === 'All' || p.type.toLowerCase().includes(filter.toLowerCase());
    const searchLower = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(searchLower) || p.location.toLowerCase().includes(searchLower);
    const matchBudget = !budget || p.price <= parseInt(budget, 10);
    return matchListing && matchType && matchSearch && matchBudget;
  });

  const displayLocation = search ? search.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-jakarta font-extrabold text-display-xl mb-2">
        Buy <span className="text-gradient">Properties</span> {displayLocation && `in ${displayLocation}`}
      </motion.h1>
      <p className="text-on-surface-variant text-body-lg mb-10">Find your dream home in Jaipur&apos;s most premium locations.</p>
      
      {/* Search & Filter */}
      <div className="glass-panel rounded-2xl p-4 mb-10 border border-white/40 shadow-lg flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200/50 focus:ring-2 focus:ring-primary outline-none font-bold" 
            placeholder="Search by name or location..." 
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
            <option value="">Max Budget</option>
            <option value="5000000">₹50 Lakhs</option>
            <option value="10000000">₹1 Crore</option>
            <option value="20000000">₹2 Crores</option>
            <option value="50000000">₹5 Crores</option>
            <option value="100000000">₹10 Crores</option>
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
          <p className="col-span-full text-center text-slate-500 py-10 animate-pulse font-bold">Loading properties...</p>
        ) : (
          filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No properties found in {displayLocation || 'this location'}</h3>
          <p className="text-slate-500 mb-8 max-w-md">We couldn&apos;t find any matches for your current search criteria. Try adjusting your filters or search term.</p>
          
          <div className="w-full text-left mt-8">
            <h4 className="font-bold text-xl mb-6">Similar Nearby Properties in Jaipur</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {properties.slice(0, 3).map((p, i) => (
                <PropertyCard key={`similar-${p.id}`} property={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
