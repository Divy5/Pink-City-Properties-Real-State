'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/context/PropertyContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const fadeUp = { 
  initial: { opacity: 0, y: 35 }, 
  whileInView: { opacity: 1, y: 0 }, 
  viewport: { once: true, margin: "-80px" }, 
  transition: { duration: 0.6, ease: "easeOut" } 
};

// Slider component for sections
const SectionSlider = ({ title, subtitle, linkHref, children }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 w-full max-w-screen-2xl mx-auto px-6 md:px-10">
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="font-jakarta font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link className="px-5 py-2.5 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-xs flex items-center gap-1 uppercase tracking-wider" href={linkHref}>
            View More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-slate-600 text-sm font-bold">arrow_back</span>
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-slate-600 text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </section>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [searchLoc, setSearchLoc] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const { properties, loading } = useProperties();

  // Suggestions states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocChange = (val) => {
    setSearchLoc(val);
    setFocusedIndex(-1);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const pool = new Set([
      'Vaishali Nagar', 'Vaishali Heights', 'Vaishali Residency',
      'Mansarovar', 'Mansarovar Heights', 'Mansarovar Villa',
      'C-Scheme', 'Malviya Nagar', 'Jagatpura', 'Ajmer Road', 'Tonk Road', 'Amer Road', 'Civil Lines',
      ...properties.map(p => p.location.split(',')[0].trim()),
      ...properties.map(p => p.title),
    ]);

    const lowercase = val.toLowerCase();
    const matched = Array.from(pool).filter(item => 
      item.toLowerCase().includes(lowercase)
    ).slice(0, 6);
    
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        e.preventDefault();
        setSearchLoc(suggestions[focusedIndex]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Filter properties by plan status (active Elite and Premium show up here!)
  const eliteFeatured = properties.filter(
    p => (p.plan === 'Elite' || p.plan === 'Premium') && p.planStatus === 'active'
  ).slice(0, 8);

  const trendingProjects = [
    { name: 'Corporate Hub X', location: 'Mansarovar Ext.', price: 'From ₹1.5 Cr', img: properties[4]?.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop' },
    { name: 'Emerald Suites', location: 'Tonk Road', price: 'From ₹85 L', img: properties[5]?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop' },
    { name: 'Royal Meadows', location: 'Ajmer Road', price: 'From ₹1.2 Cr', img: properties[3]?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop' },
    { name: 'Zenith Wellness', location: 'Civil Lines', price: 'From ₹3.1 Cr', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop' },
    { name: 'Palace View Estate', location: 'Amer Road', price: 'From ₹7.5 Cr', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/20">
        <p className="text-xl animate-pulse font-bold text-slate-500">Loading Jaipur Properties...</p>
      </div>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLoc) params.set('location', searchLoc);
    if (searchType) params.set('type', searchType);
    if (searchBudget) params.set('budget', searchBudget);
    const queryString = params.toString();
    router.push(queryString ? `/buy?${queryString}` : '/buy');
  };

  return (
    <div className="w-full overflow-hidden bg-slate-50/10">
      
      {/* Premium Hero Section with Hawa Mahal Jaipur Visuals */}
      <section className="relative min-h-[780px] md:min-h-[880px] flex items-center justify-center">
        {/* Jaipur Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=2000&auto=format&fit=crop" // Beautiful high-res view of Hawa Mahal / Albert Hall Jaipur
            alt="Luxury Jaipur Estate background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-background" />
        </div>

        <div className="relative z-10 w-full max-w-screen-xl px-6 text-center mt-12 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
              Discover Rajasthan&apos;s Royal Real Estate
            </span>
            <h1 className="font-jakarta font-extrabold text-4xl md:text-6xl lg:text-[72px] text-white leading-[1.1] drop-shadow-2xl tracking-tight">
              Curated Luxury in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-orange-300 to-amber-200 drop-shadow-sm">Pink City</span>
            </h1>
          </motion.div>
          
          <motion.p 
            {...fadeUp} 
            transition={{ delay: 0.2 }} 
            className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed"
          >
            Explore verified premium penthouses, elite commercial complexes, and investment land plots across Jaipur&apos;s most prestigious neighborhoods.
          </motion.p>

          {/* Glassmorphic Search box */}
          <motion.form 
            onSubmit={handleSearch} 
            {...fadeUp} 
            transition={{ delay: 0.3 }} 
            className="glass-panel max-w-5xl mx-auto p-3.5 rounded-[32px] md:rounded-full shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10"
          >
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div ref={suggestionRef} className="flex-[1.2] w-full relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl select-none">location_on</span>
                <input
                  className="w-full pl-14 pr-4 py-3.5 rounded-2xl md:rounded-full bg-white border border-slate-200/30 focus:ring-4 focus:ring-primary/20 text-slate-800 placeholder-slate-400 font-bold outline-none transition-all"
                  placeholder="Locality (e.g. Vaishali Nagar, C-Scheme)"
                  type="text"
                  value={searchLoc}
                  onChange={(e) => handleLocChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchLoc.trim()) {
                      handleLocChange(searchLoc);
                    }
                  }}
                />
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden z-50 py-2 text-left max-h-[280px] overflow-y-auto"
                    >
                      <div className="px-4 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-1.5">
                        Search Matches
                      </div>
                      {suggestions.map((item, index) => {
                        const lowerItem = item.toLowerCase();
                        const startIdx = lowerItem.indexOf(searchLoc.toLowerCase());
                        const matchLength = searchLoc.length;
                        
                        let displayContent = <span>{item}</span>;
                        if (startIdx >= 0 && matchLength > 0) {
                          const before = item.substring(0, startIdx);
                          const match = item.substring(startIdx, startIdx + matchLength);
                          const after = item.substring(startIdx + matchLength);
                          displayContent = (
                            <span className="font-semibold text-slate-700">
                              {before}
                              <mark className="bg-amber-100 text-amber-900 font-extrabold px-0.5 rounded">{match}</mark>
                              {after}
                            </span>
                          );
                        }
                        
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSearchLoc(item);
                              setShowSuggestions(false);
                            }}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-slate-700 font-bold text-sm ${focusedIndex === index ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100/50'}`}
                          >
                            <span className="material-symbols-outlined text-base text-slate-400">
                              {item.includes('Heights') || item.includes('Residency') || item.includes('Villa') || item.includes('Palace') || item.includes('Suites') || item.includes('Meadows') || item.includes('Opal') ? 'home_work' : 'location_on'}
                            </span>
                            {displayContent}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 w-full relative font-bold">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl select-none">home</span>
                <select
                  className="w-full pl-14 pr-10 py-3.5 rounded-2xl md:rounded-full bg-white border border-slate-200/30 focus:ring-4 focus:ring-primary/20 text-slate-700 appearance-none outline-none transition-all cursor-pointer"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Commercial</option>
                  <option>Plot</option>
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">expand_more</span>
              </div>
              <div className="flex-1 w-full relative font-bold">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl select-none">payments</span>
                <select
                  className="w-full pl-14 pr-10 py-3.5 rounded-2xl md:rounded-full bg-white border border-slate-200/30 focus:ring-4 focus:ring-primary/20 text-slate-700 appearance-none outline-none transition-all cursor-pointer"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                >
                  <option value="">Max Budget</option>
                  <option value="5000000">₹50 Lakhs</option>
                  <option value="10000000">₹1 Crore</option>
                  <option value="20000000">₹2 Crores</option>
                  <option value="50000000">₹5 Crores</option>
                  <option value="100000000">₹10 Crores</option>
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">expand_more</span>
              </div>
              <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-extrabold rounded-2xl md:rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">search</span> Search Listings
              </button>
            </div>
          </motion.form>

          {/* Location Tags */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-2.5 mt-8">
            {['Mansarovar', 'Vaishali Nagar', 'C-Scheme', 'Malviya Nagar', 'Jagatpura'].map(loc => (
              <button 
                key={loc} 
                onClick={() => { setSearchLoc(loc); router.push(`/buy?location=${loc}`); }}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-xs cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95 transition-all drop-shadow-sm"
              >
                {loc}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b border-slate-200/50 shadow-sm relative z-10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-xs font-bold text-slate-600 select-none">
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-2xl">verified</span><span>1,200+ Verified Buyers</span></div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-2xl">shield</span><span>Certified Land Titles</span></div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-2xl">task_alt</span><span>100% Physical Screening</span></div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-amber-500 text-2xl">speed</span><span>SBI/HDFC Banking Partners</span></div>
          </div>
        </div>
      </section>

      {/* Elite / Premium Sponsored Properties Section */}
      {eliteFeatured.length > 0 && (
        <SectionSlider 
          title="Elite Spotlights in Jaipur" 
          subtitle="Top featured sponsored listings with maximum visibility and priority support." 
          linkHref="/buy"
        >
          {eliteFeatured.map((p, i) => (
            <div key={p.id} className="min-w-[280px] md:min-w-[320px] max-w-[360px] snap-center shrink-0">
              <PropertyCard property={p} index={i} />
            </div>
          ))}
        </SectionSlider>
      )}

      {/* Trending Projects */}
      <div className="bg-slate-100/50 w-full py-6">
        <SectionSlider title="Upcoming Launches &amp; Projects" subtitle="Highly awaited residential flats and professional builder projects in Jaipur." linkHref="/new-projects">
          {trendingProjects.map((proj, i) => (
            <motion.div
              key={proj.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] md:min-w-[340px] snap-center shrink-0 bg-white rounded-[32px] overflow-hidden border border-slate-200/60 cursor-pointer shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 flex flex-col group relative"
              onClick={() => router.push('/new-projects')}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52 bg-slate-100 shrink-0">
                <img 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                  src={proj.img} 
                  alt={proj.name} 
                  loading="lazy" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop'; }} 
                />
                <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider select-none">
                  <span className="material-symbols-outlined text-[10px]">check_circle</span>
                  <span>PRE-VERIFIED</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-jakarta font-extrabold text-base text-slate-800 truncate pr-3">{proj.name}</h4>
                  <span className="font-jakarta font-extrabold text-base text-primary whitespace-nowrap">{proj.price}</span>
                </div>

                <div className="text-slate-400 text-xs mb-3 flex items-center gap-1.5 font-bold truncate">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{proj.location}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] border border-slate-100">Builder Launch</span>
                  <span className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] border border-slate-100">Hot ROI</span>
                </div>

                <div className="w-full h-[1px] bg-slate-100 my-4" />

                <div className="w-full text-center py-3 bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-primary/15 group-hover:border-transparent flex items-center justify-center gap-1 mt-auto">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-xs font-bold transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </motion.div>
          ))}
        </SectionSlider>
      </div>

      {/* Animated Statistics count-ups */}
      <section className="py-20 bg-slate-900 text-white w-full relative">
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { count: '₹5,000+ Cr', desc: 'Real Estate Transaction Volume', icon: 'account_balance_wallet' },
              { count: '15,000+', desc: 'Happy Families Housed', icon: 'diversity_1' },
              { count: '2,500+', desc: 'Screened & Verified Listings', icon: 'fact_check' },
              { count: '12+ Banks', desc: 'Direct Loan Integrations', icon: 'account_balance' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 25 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-md flex flex-col items-center space-y-3"
              >
                <div className="w-12 h-12 bg-slate-850 rounded-2xl flex items-center justify-center text-accent mb-2 border border-slate-800"><span className="material-symbols-outlined text-2xl">{stat.icon}</span></div>
                <h3 className="text-3xl font-black text-white tracking-tight">{stat.count}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider max-w-[160px] leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Loans & Banking Spotlight Banners */}
      <section className="py-16 bg-white w-full border-y border-slate-200/60">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-[48px] p-8 md:p-14 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
            <div className="flex-1 space-y-6 z-10">
              <span className="px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/35 text-secondary text-[10px] font-black uppercase tracking-widest inline-block">
                Exclusive Loan Partnerships
              </span>
              <h3 className="font-jakarta font-extrabold text-3xl md:text-4xl leading-tight">
                Need a home loan? <br />Get pre-approved in under 24 hours.
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                Compare verified interest rate offers from SBI, HDFC, and ICICI starting at <span className="text-white font-extrabold">8.40% p.a.</span> with zero hidden administrative fees.
              </p>
              <div className="flex gap-4 flex-wrap pt-2">
                <Link href="/home-loans" className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95">
                  Apply Home Loan
                </Link>
                <Link href="/emi-calculator" className="px-6 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all active:scale-95">
                  Calculate Monthly EMI
                </Link>
              </div>
            </div>
            
            {/* Visual Bank Interest spotlight grid */}
            <div className="w-full lg:max-w-md grid grid-cols-2 gap-4 z-10 shrink-0">
              {[
                { name: 'SBI', rate: '8.40% p.a.', desc: 'Max 30 Yrs' },
                { name: 'HDFC', rate: '8.50% p.a.', desc: 'Fast Processing' },
                { name: 'ICICI', rate: '8.60% p.a.', desc: 'Low paperwork' },
                { name: 'Axis', rate: '8.55% p.a.', desc: 'Surplus OD savings' }
              ].map(bank => (
                <div key={bank.name} className="p-5 bg-slate-950/60 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col justify-between h-28 shadow-lg">
                  <h4 className="font-extrabold text-sm text-slate-400">{bank.name} Bank</h4>
                  <div>
                    <p className="text-lg font-black text-white tracking-tight">{bank.rate}</p>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{bank.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Grid */}
      <section className="py-20 bg-slate-50/50 w-full">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-jakarta font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight">Jaipur Voices &amp; Stories</h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">Hear what Jaipur residents and real estate investors write about Pink City Properties.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: '"Found our dream luxury house in Vaishali Nagar within 4 days. The title screening and swift SBI loan integration made everything completely transparent!"', author: 'Rajesh Sharma', role: 'Homebuyer', init: 'R', color: 'bg-primary/10 text-primary' },
              { text: '"As a Gurgaon-based NRI investor, I strictly require physical verification. The on-site registry reviews and 3D drone galleries of flats in C-Scheme are exceptional."', author: 'Amit Gupta', role: 'Property Investor', init: 'A', color: 'bg-secondary/10 text-secondary' },
              { text: '"Listed my penthouse flat in Mansarovar on an Elite Plan. Received 14 high-quality buyer inquiries and closed the sale within 3 weeks. Absolutely recommended!"', author: 'Priya Singh', role: 'Property Seller', init: 'P', color: 'bg-green-100 text-green-600' }
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm relative flex flex-col justify-between min-h-[260px] hover:shadow-lg transition-shadow">
                <span className="material-symbols-outlined text-6xl text-slate-100/80 absolute top-4 right-4 select-none">format_quote</span>
                <p className="text-slate-600 text-sm leading-relaxed relative z-10 font-medium italic">
                  {t.text}
                </p>
                <div className="flex items-center gap-3.5 mt-8 border-t border-slate-50 pt-4">
                  <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${t.color}`}>{t.init}</div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">{t.author}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators & Utilities Grid links */}
      <section className="py-16 w-full max-w-screen-2xl mx-auto px-6 md:px-10">
        <motion.div {...fadeUp} className="text-center mb-10 space-y-1">
          <h2 className="font-jakarta font-extrabold text-3xl text-slate-900 tracking-tight">Interactive Calculators</h2>
          <p className="text-slate-500 text-sm font-semibold">Everything you need to configure and plan budgets accurately.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'calculate', title: 'EMI Calculator', desc: 'Formulate monthly installment payouts and tenure schedules.', href: '/emi-calculator' },
            { icon: 'swap_horiz', title: 'Conversion Calculator', desc: 'Swiftly convert between Sq.Ft, Sq.Yards, and Bigha values.', href: '/conversion-calculator' },
            { icon: 'straighten', title: 'Area Calculator', desc: 'Determine total carpet, super-built, and plot areas from dimensions.', href: '/area-calculator' },
          ].map((tool, i) => (
            <motion.div key={tool.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={tool.href} prefetch={true} className="block p-8 bg-white rounded-[32px] border border-slate-200/60 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 group-hover:from-primary group-hover:to-secondary flex items-center justify-center mb-6 text-primary group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                </div>
                <h3 className="font-jakarta font-extrabold text-slate-900 text-lg mb-1">{tool.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
