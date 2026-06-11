'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { 
    user, 
    requireAuth, 
    toggleFavorite, 
    isFavorite, 
    addLead, 
    addNotification, 
    addToRecentlyViewed 
  } = useAuth();
  const { properties, loading } = useProperties();

  const property = properties.find(p => p.id.toString() === params.id.toString());
  
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submittedLead, setSubmittedLead] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Visit Scheduler form
  const [visitForm, setVisitForm] = useState({ date: '', time: '', type: 'In Person' });
  const [submittedVisit, setSubmittedVisit] = useState(false);

  // Add to recently viewed list on mount
  useEffect(() => {
    if (property) {
      addToRecentlyViewed(property.id);
    }
  }, [property, addToRecentlyViewed]);

  if (loading) return <div className="py-40 text-center font-bold text-slate-500 animate-pulse">Loading property details...</div>;
  if (!property) return <div className="py-40 text-center text-2xl font-bold text-slate-500">Property not found</div>;

  const isFavorited = isFavorite(property.id);

  // Handle Buyer Leads
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!requireAuth(pathname)) return;

    addLead(
      leadForm.name,
      leadForm.email,
      leadForm.phone,
      property.id,
      property.title,
      property.ownerEmail,
      leadForm.message || `Hi, I am interested in "${property.title}". Please call me back.`
    );

    setSubmittedLead(true);
  };

  // Handle Visitation Scheduler
  const handleVisitSubmit = (e) => {
    e.preventDefault();
    if (!requireAuth(pathname)) return;

    if (!visitForm.date || !visitForm.time) {
      alert('Please select a date and time for the visit.');
      return;
    }

    addLead(
      user?.name || 'Homebuyer',
      user?.email || 'buyer@example.com',
      user?.phone || '+91 99999 88888',
      property.id,
      property.title,
      property.ownerEmail,
      `Requested a ${visitForm.type} site visit on ${visitForm.date} at ${visitForm.time}.`
    );

    addNotification(
      'Site Visit Scheduled!',
      `Your ${visitForm.type} visit for "${property.title}" is requested on ${visitForm.date} at ${visitForm.time}. The seller has been notified.`,
      'lead'
    );

    setSubmittedVisit(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextImage = () => {
    if (property.images) setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (property.images) setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleAuthCheck = (e) => {
    if (!requireAuth(pathname)) {
      e.preventDefault();
    }
  };

  const similarProperties = properties
    .filter(p => p.id !== property.id && p.planStatus !== 'expired' && (p.type === property.type || p.location.includes(property.location.split(',')[0])))
    .slice(0, 3);

  const mapSrc = `https://maps.google.com/maps?q=Jaipur%20${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const amenitiesList = property.amenities && property.amenities.length > 0 ? property.amenities : [
    'Lift', '24/7 Security', 'Power Backup', 'Covered Parking', 'Club House', 'Landscape Garden', 'Gymnasium', 'Swimming Pool'
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-12 text-left relative">
      
      {/* Lightbox Modal Preview Overlay */}
      <AnimatePresence>
        {showLightbox && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col justify-between p-6 select-none animate-fade-in pointer-events-auto">
            <div className="flex justify-between items-center text-white z-10">
              <span className="text-sm font-bold font-jakarta">Image {currentImage + 1} of {property.images.length}</span>
              <button 
                onClick={() => setShowLightbox(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImage}
                  src={property.images[currentImage]}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  alt={property.title}
                />
              </AnimatePresence>

              {property.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar py-4 border-t border-white/10">
              {property.images.map((src, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-14 h-10 rounded overflow-hidden border-2 shrink-0 transition-all ${i === currentImage ? 'border-primary scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`Lightbox thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Back button & controls bar */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Link href="/buy" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to listings
        </Link>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-650 relative active:scale-95 cursor-pointer bg-white"
            title="Copy Link"
          >
            <span className="material-symbols-outlined text-lg">{copied ? 'done' : 'share'}</span>
            {copied && <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">Copied!</span>}
          </button>

          <a 
            href={`https://api.whatsapp.com/send?text=Check%2520out%2520this%2520stunning%2520property%2520in%2520Jaipur!%2520${encodeURIComponent(property.title)}%2520at%2520${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center text-green-600 active:scale-95 bg-white"
            title="Share to WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.977h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.294c-.202-.1-1.195-.59-1.378-.657-.183-.067-.317-.1-.449.1-.132.202-.51.657-.625.79-.116.13-.232.146-.434.047a5.01 5.01 0 0 1-1.612-1.002 5.09 5.09 0 0 1-1.113-1.387c-.118-.202-.013-.31.088-.41.09-.09.202-.232.302-.347.1-.116.134-.195.202-.327.067-.132.033-.248-.016-.347-.05-.098-.449-1.083-.615-1.484-.162-.395-.327-.34-.449-.346-.116-.006-.248-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.048c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.195-.487 1.362-1.083.167-.597.167-1.108.118-1.202-.047-.095-.175-.145-.378-.247"/>
            </svg>
          </a>

          <button 
            onClick={() => { if (requireAuth(pathname)) toggleFavorite(property.id); }}
            className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center active:scale-95 cursor-pointer bg-white ${isFavorited ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-md' : 'border-slate-200 text-slate-500 hover:text-rose-500'}`}
            title="Save to favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Gallery & Core details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Advanced Image Gallery Section */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white p-3">
            <div 
              className="relative rounded-xl overflow-hidden h-[300px] md:h-[420px] bg-slate-900 group cursor-pointer"
              onClick={() => setShowLightbox(true)}
            >
              <img 
                src={property.images && property.images.length > 0 ? property.images[currentImage] : '/placeholder-property.jpg'} 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                alt={property.title} 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-lg text-white text-xs font-bold select-none flex items-center gap-1.5 group-hover:bg-primary transition-colors duration-300">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
                <span>Zoom Photo {currentImage + 1} of {property.images.length}</span>
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2.5 mt-3 p-1 overflow-x-auto no-scrollbar scroll-smooth">
                {property.images.map((src, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all shadow-sm cursor-pointer ${i === currentImage ? 'border-primary scale-95 shadow-md' : 'border-transparent hover:border-slate-350'}`}
                  >
                    <img src={src} className="w-full h-full object-cover" alt={`Thumb navigation ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Primary Info Card (Visible directly below image gallery without extra scrolling) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-left relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {property.type}
                  </span>
                  <span className="bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5 select-none">
                    <span className="material-symbols-outlined text-[12px] font-bold">verified</span> Verified RERA
                  </span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {property.id % 2 === 0 ? 'Ready to Move' : 'In Construction'}
                  </span>
                </div>
                
                <h1 className="font-jakarta font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight pt-1">
                  {property.title}
                </h1>
                
                <p className="text-slate-500 text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-slate-400 text-base shrink-0 select-none">location_on</span>
                  <span>{property.location}</span>
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 text-left sm:text-right pt-2 sm:pt-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Asking Price</span>
                <span className="text-3xl md:text-4xl font-black text-primary font-jakarta tracking-tight">{property.priceDisplay}</span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  Listed 3 Days ago • ID: PCP{property.id}
                </span>
              </div>
            </div>

            {/* Inline Specs Tag Row */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-100 text-slate-650 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-450 text-lg">bed</span>
                <span>{property.bhk || 'N/A'} BHK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-450 text-lg">bathtub</span>
                <span>{property.bath || property.bathrooms || 'N/A'} Baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-450 text-lg">square_foot</span>
                <span>{property.area || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-450 text-lg">history</span>
                <span>{property.id % 3 === 0 ? 'Brand New' : property.id % 3 === 1 ? '1-2 Years' : '3-5 Years'} Age</span>
              </div>
            </div>
          </div>

          {/* Property Overview Section (99acres / MagicBricks / Housing style) */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-6 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">dashboard</span>
              Property Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Price', val: property.priceDisplay, icon: 'payments', desc: 'Asking Price' },
                { label: 'Area', val: property.area || 'N/A', icon: 'square_foot', desc: 'Super built-up area' },
                { label: 'BHK', val: property.bhk ? `${property.bhk} BHK` : 'N/A', icon: 'bed', desc: 'Bedrooms' },
                { label: 'Ownership', val: property.listedBy || 'Owner', icon: 'badge', desc: 'Listed By' },
                { label: 'Furnishing', val: property.furnishing || 'Semi-Furnished', icon: 'chair', desc: 'Furnishing status' },
                { label: 'Possession', val: property.id % 2 === 0 ? 'Ready to Move' : 'In Construction', icon: 'vpn_key', desc: 'Status' },
                { label: 'Facing', val: property.id % 2 === 0 ? 'East Facing' : 'West Facing', icon: 'explore', desc: 'Facing direction' },
                { label: 'Property Age', val: property.id % 3 === 0 ? 'Brand New' : property.id % 3 === 1 ? '1-2 Years' : '3-5 Years', icon: 'history', desc: 'Age of Property' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-lg font-bold">{item.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block leading-none mb-1">{item.label}</span>
                    <span className="font-extrabold text-slate-800 text-sm leading-tight block truncate">{item.val}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block leading-tight mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Property Details Table */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-6 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">info</span>
              Complete Property Details
            </h3>
            
            <div className="space-y-8">
              {/* Basic Details Group */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Basic Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { name: 'Property Name', val: property.title },
                    { name: 'Price', val: property.priceDisplay },
                    { name: 'Property ID', val: `PCP${property.id}` },
                    { name: 'Property Type', val: property.type },
                    { name: 'Buy / Rent', val: property.listingType === 'Rent' ? 'Rent' : 'Buy (Outright Sell)' },
                    { name: 'BHK', val: property.bhk ? `${property.bhk} BHK` : 'N/A' },
                    { name: 'Bathrooms', val: property.bath || property.bathrooms || 'N/A' },
                    { name: 'Balconies', val: property.id % 2 === 0 ? '2 Balconies' : '3 Balconies' },
                    { name: 'Furnishing Status', val: property.furnishing || 'Semi-Furnished' },
                    { name: 'Property Age', val: property.id % 3 === 0 ? 'Brand New' : property.id % 3 === 1 ? '1-2 Years' : '3-5 Years' },
                    { name: 'Floor Number', val: property.id % 2 === 0 ? '3rd Floor' : 'Ground Floor' },
                    { name: 'Total Floors', val: '5 Floors' },
                    { name: 'Facing', val: property.id % 2 === 0 ? 'East Facing' : 'West Facing' },
                    { name: 'Possession Status', val: property.id % 2 === 0 ? 'Ready to Move' : 'In Construction' }
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs font-semibold">
                      <span className="text-slate-450">{d.name}</span>
                      <span className="text-slate-800 text-right">{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Details Group */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Area Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { name: 'Super Built-up Area', val: property.area || 'N/A' },
                    { name: 'Built-up Area', val: property.area ? `${Math.round(parseInt(property.area.replace(/,/g, '')) * 0.9)} sqft` : 'N/A' },
                    { name: 'Carpet Area', val: property.area ? `${Math.round(parseInt(property.area.replace(/,/g, '')) * 0.8)} sqft` : 'N/A' },
                    { name: 'Plot Area', val: property.type === 'Plot' || property.type === 'Villa' ? property.area : 'N/A' }
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs font-semibold">
                      <span className="text-slate-450">{d.name}</span>
                      <span className="text-slate-800 text-right">{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Details Group */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Location Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { name: 'Full Address', val: `${property.title}, Near landmark, ${property.location}` },
                    { name: 'Locality', val: property.location.split(',')[0] },
                    { name: 'City', val: 'Jaipur' },
                    { name: 'State', val: 'Rajasthan' },
                    { name: 'Pincode', val: property.id % 2 === 0 ? '302017' : '302025' }
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs font-semibold">
                      <span className="text-slate-450">{d.name}</span>
                      <span className="text-slate-800 text-right max-w-[220px] truncate" title={d.val}>{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ownership Group */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Ownership & Verification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { name: 'Owner/Broker Name', val: property.listedBy === 'Owner' ? 'Mr. Satish Shekhawat' : 'Vikram Rathore' },
                    { name: 'Listed By', val: property.listedBy || 'Owner' },
                    { name: 'Verified Status', val: 'Verified RERA Approved' }
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs font-semibold">
                      <span className="text-slate-450">{d.name}</span>
                      <span className="text-slate-800 text-right">{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-4 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">description</span>
              Property Description
            </h3>
            <div className="space-y-4">
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-semibold whitespace-pre-line">
                {property.description}
              </p>
              
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Key Features & Highlights:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm font-bold">check_circle</span>
                    <span>Prime Location with excellent accessibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm font-bold">check_circle</span>
                    <span>Proper natural ventilation and sunlight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm font-bold">check_circle</span>
                    <span>Secured Gated Community / Elite Society</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm font-bold">check_circle</span>
                    <span>SBI/HDFC Pre-approved loan verification clear</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Property Features Section (Icon cards grid for 10 amenities) */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-6 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">stars</span>
              Property Features & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { name: 'Parking', icon: 'local_parking', exists: true },
                { name: 'Lift', icon: 'elevator', exists: property.type !== 'Independent House/Villa' && property.type !== 'Villa' },
                { name: 'Security', icon: 'security', exists: true },
                { name: 'Power Backup', icon: 'bolt', exists: true },
                { name: 'Clubhouse', icon: 'meeting_room', exists: property.id % 2 === 0 },
                { name: 'Swimming Pool', icon: 'pool', exists: property.amenities?.includes('Swimming Pool') || property.id % 3 === 0 },
                { name: 'Garden', icon: 'park', exists: true },
                { name: 'Gym', icon: 'fitness_center', exists: property.amenities?.includes('Gymnasium') || property.id % 2 === 0 },
                { name: 'Internet', icon: 'wifi', exists: true },
                { name: 'Water Supply', icon: 'water_drop', exists: true }
              ].map((feature) => (
                <div 
                  key={feature.name} 
                  className={`flex flex-col items-center justify-center text-center rounded-xl p-4 border transition-all duration-200 ${feature.exists ? 'bg-slate-50/50 border-slate-200/80 text-slate-800 hover:border-primary/20 hover:bg-slate-50' : 'bg-slate-50/10 border-slate-100 text-slate-350 opacity-50'}`}
                >
                  <span className={`material-symbols-outlined text-2xl font-bold mb-2 ${feature.exists ? 'text-primary' : 'text-slate-300'}`}>
                    {feature.icon}
                  </span>
                  <span className="font-bold text-[10px] uppercase tracking-wider">{feature.name}</span>
                  <span className="text-[8px] font-black uppercase mt-1 px-1.5 py-0.5 rounded leading-none">
                    {feature.exists ? (
                      <span className="text-green-600 bg-green-50">AVAILABLE</span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100">N/A</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Google Map embed */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-2 text-slate-900">Jaipur exact Registry location</h3>
            <p className="text-slate-400 text-xs font-semibold mb-6 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">pin_drop</span> Map coordinates pinpointed directly on certified site plot.
            </p>
            <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Dynamic Home Loan pre-approval & EMI calculator Section */}
          <div id="loan-partners-section" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6 text-left">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">account_balance</span>
              </div>
              <div>
                <h3 className="font-jakarta font-extrabold text-xl text-slate-900">Pre-Approved Loan Partners</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Get instant finance clearance on this property</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { bank: 'State Bank of India', rate: '8.40% p.a.', emi: `₹${Math.round((property.price * 0.8 * 0.084 / 12) / (1 - Math.pow(1 + 0.084 / 12, -240))).toLocaleString('en-IN')}/mo`, fee: '0.35% Processing Fee', logo: 'SBI', color: 'bg-accent/15 text-primary border-accent/20' },
                { bank: 'HDFC Bank Ltd', rate: '8.50% p.a.', emi: `₹${Math.round((property.price * 0.8 * 0.085 / 12) / (1 - Math.pow(1 + 0.085 / 12, -240))).toLocaleString('en-IN')}/mo`, fee: 'Zero Administrative Fee', logo: 'HDFC', color: 'bg-secondary/15 text-secondary border-secondary/20' }
              ].map((offer, idx) => (
                <div key={idx} className="p-4 border border-slate-150 rounded-xl bg-slate-50/50 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-350 transition-colors border">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center border ${offer.color}`}>
                        {offer.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{offer.bank}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{offer.fee}</span>
                      </div>
                    </div>
                    <span className="bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-black px-2 py-0.5 rounded-md border border-green-500/20 select-none">
                      APPROVED
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Rates From</span>
                      <span className="font-extrabold text-slate-800 text-sm">{offer.rate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">EMI (20 Yrs, 80% Loan)</span>
                      <span className="font-extrabold text-primary text-sm">{offer.emi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <Link href="/home-loans" className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white text-center rounded-xl text-xs font-extrabold uppercase tracking-wider shadow hover:opacity-95 transition-all active:scale-95 flex items-center justify-center">
                Apply Home Loan
              </Link>
              <Link href="/emi-calculator" className="flex-1 py-3 border border-slate-200 hover:border-slate-350 text-slate-700 text-center rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center justify-center">
                Calculate custom EMI
              </Link>
            </div>
          </div>

          {/* Location Insights Landmarks & Distances */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="font-jakarta font-extrabold text-xl mb-6 text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">explore</span>
              Location Insights &amp; Nearby Landmarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: 'school', title: 'Top Schools', list: ['Jaipur International (0.8 km)', 'Ryan International (1.5 km)'], color: 'bg-primary/10 text-primary border-primary/20' },
                { icon: 'local_hospital', title: 'Hospitals', list: ['Fortis Escorts (1.2 km)', 'Apex Hospital (2.0 km)'], color: 'bg-error/10 text-error border-error/20' },
                { icon: 'train', title: 'Metro Stations', list: ['Mansarovar Metro (2.0 km)', 'New Aatish Market (3.2 km)'], color: 'bg-secondary/10 text-secondary border-secondary/20' },
                { icon: 'shopping_cart', title: 'Shopping Malls', list: ['World Trade Park (2.5 km)', 'GT Central Mall (2.6 km)'], color: 'bg-success/10 text-success border-success/20' },
                { icon: 'directions_bus', title: 'Bus Stops', list: ['Sanganer Bus Stand (1.8 km)', 'Sindhi Camp Bus Terminus (8.5 km)'], color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
                { icon: 'flight', title: 'Airport Distance', list: ['Jaipur Int\'l Airport (6.2 km)'], color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' }
              ].map((landmark, idx) => (
                <div key={idx} className="flex gap-3 p-4 border border-slate-150 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 border">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${landmark.color} border`}>
                    <span className="material-symbols-outlined font-bold text-lg">{landmark.icon}</span>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-extrabold text-slate-800 text-xs leading-tight mb-1">{landmark.title}</p>
                    {landmark.list.map((item, i) => (
                      <p key={i} className="text-[10px] text-slate-500 font-semibold truncate leading-relaxed">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky action panel */}
        <div className="lg:col-span-1 space-y-6 text-left">
          <div className="sticky top-28 space-y-6">
            
            {/* Premium Broker Card & Action Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden text-left"
            >
              {(() => {
                const brokers = [
                  {
                    name: 'Vikram Rathore',
                    title: 'Luxury Property Director',
                    badge: 'Jaipur Platinum Club',
                    experience: '8+ Years',
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
                    phone: '+91 98290 88776',
                    rating: '4.9 ★★★★★'
                  },
                  {
                    name: 'Amit Sharma',
                    title: 'Senior Residential Consultant',
                    badge: 'Certified Jaipur Partner',
                    experience: '6+ Years',
                    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                    phone: '+91 91160 99887',
                    rating: '4.8 ★★★★★'
                  },
                  {
                    name: 'Priyanka Choudhary',
                    title: 'Commercial Specialist',
                    badge: 'Jaipur Elite Agent',
                    experience: '10+ Years',
                    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
                    phone: '+91 98291 12233',
                    rating: '5.0 ★★★★★'
                  }
                ];

                const broker = brokers[property.id % brokers.length];
                
                return (
                  <>
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">support_agent</span>
                      </div>
                      <div>
                        <h4 className="font-jakarta font-extrabold text-slate-900 text-base">Assigned Platform Broker</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Certified Platform Agent</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 space-y-3 shadow-inner">
                      <div className="flex gap-3">
                        <div className="relative shrink-0">
                          <img 
                            src={broker.photo} 
                            alt={broker.name} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                          />
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary border-2 border-white flex items-center justify-center" title="Verified Professional">
                            <span className="material-symbols-outlined text-[9px] text-white font-bold">check</span>
                          </span>
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-wider mb-1">
                            {broker.badge}
                          </span>
                          <h5 className="font-jakarta font-extrabold text-slate-900 text-sm truncate">{broker.name}</h5>
                          <p className="text-[10px] text-slate-500 font-semibold">{broker.title}</p>
                          <p className="text-[9px] text-amber-500 font-bold mt-0.5">{broker.rating}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100 pt-2 bg-white/20">
                        <span>Experience</span>
                        <span className="text-slate-700">{broker.experience}</span>
                      </div>
                    </div>

                    {/* Direct Contact Directory */}
                    <div className="space-y-2 bg-slate-50/30 p-3 rounded-xl border border-slate-100 text-left">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400 text-[10px] uppercase">Broker Hotline</span>
                        <span className="text-slate-700 font-bold">{broker.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400 text-[10px] uppercase">Company Support</span>
                        <span className="text-slate-700 font-bold">+91 141 400 9000</span>
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="space-y-2.5">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (!requireAuth(pathname)) return;
                          
                          addLead(
                            user?.name || 'Homebuyer',
                            user?.email || 'buyer@example.com',
                            user?.phone || '+91 99999 88888',
                            property.id,
                            property.title,
                            property.ownerEmail,
                            `Requested connection callback with Broker ${broker.name} regarding "${property.title}".`
                          );

                          addNotification(
                            'Broker Connection Call Bridged',
                            `Secure callback bridge triggered with Broker ${broker.name} for "${property.title}". Connecting shortly.`,
                            'lead'
                          );

                          window.__pcp_dialer_trigger && window.__pcp_dialer_trigger(broker);
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer border-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span> Call Broker
                      </button>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (!requireAuth(pathname)) return;

                          addLead(
                            user?.name || 'Homebuyer',
                            user?.email || 'buyer@example.com',
                            user?.phone || '+91 99999 88888',
                            property.id,
                            property.title,
                            property.ownerEmail,
                            `Initiated direct WhatsApp connection with Broker ${broker.name} regarding "${property.title}".`
                          );

                          addNotification(
                            'Broker WhatsApp Initiated',
                            `Redirected to WhatsApp messaging with Broker ${broker.name} for "${property.title}".`,
                            'lead'
                          );

                          const text = encodeURIComponent(`Hi ${broker.name}, I am interested in your listed property "${property.title}" (ID: ${property.id}) on Pink City Properties. Please share the details!`);
                          window.open(`https://wa.me/${broker.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                        }}
                        className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer border-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp Broker
                      </button>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (!requireAuth(pathname)) return;

                          addLead(
                            user?.name || 'Homebuyer',
                            user?.email || 'buyer@example.com',
                            user?.phone || '+91 99999 88888',
                            property.id,
                            property.title,
                            property.ownerEmail,
                            `Requested verification clearance to access direct owner details for "${property.title}".`
                          );

                          addNotification(
                            'Owner Details Requested',
                            `Verification screening initiated to unlock owner credentials for "${property.title}". Details will be dispatched within 5 minutes.`,
                            'lead'
                          );

                          window.__pcp_owner_details_trigger && window.__pcp_owner_details_trigger();
                        }}
                        className="w-full py-3.5 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">key</span> Request Owner Details
                      </button>
                    </div>

                    {/* Extra Utility buttons inside Sticky Action Panel */}
                    <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-100 pt-3">
                      {/* Save Property */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (requireAuth(pathname)) toggleFavorite(property.id);
                        }}
                        className={`py-2.5 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isFavorited ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-[12px] h-[12px]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span>{isFavorited ? 'Saved' : 'Save'}</span>
                      </button>

                      {/* Apply for Loan */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById('loan-partners-section');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="py-2.5 px-3 border border-slate-200 text-slate-650 hover:border-slate-350 bg-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[14px]">account_balance</span>
                        <span>Apply Loan</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* Visitation Scheduler Form */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-6 text-left">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-lg">calendar_month</span></div>
                <div>
                  <h4 className="font-jakarta font-extrabold text-slate-900 text-base">Schedule Site Visit</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Book a secure visitation</p>
                </div>
              </div>

              {submittedVisit ? (
                <div className="text-center py-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">event_available</span>
                  <p className="font-bold text-slate-800 text-sm">Site Visit Requested!</p>
                  <p className="text-slate-500 text-[11px] mt-1 leading-normal max-w-[200px]">The request has been submitted. Check notifications for confirmation.</p>
                </div>
              ) : (
                <form onSubmit={handleVisitSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visitation Date</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-xs text-slate-700" value={visitForm.date} onChange={e => setVisitForm({ ...visitForm, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visitation Time Slot</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-xs text-slate-700 appearance-none" value={visitForm.time} onChange={e => setVisitForm({ ...visitForm, time: e.target.value })}>
                      <option value="">Choose Slot</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>02:00 PM - 04:00 PM</option>
                      <option>04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visitation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['In Person', 'Video Call'].map(mode => (
                        <button 
                          key={mode}
                          type="button"
                          onClick={() => setVisitForm({ ...visitForm, type: mode })}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${visitForm.type === mode ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" onClick={handleAuthCheck} className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex justify-center items-center gap-1 mt-3 cursor-pointer border-0">
                    <span className="material-symbols-outlined text-[16px]">event_seat</span> Schedule Site Visit
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>

      </div>

      {/* Similar Properties Section (Professional horizontal slider) */}
      {similarProperties.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200/60 w-full text-left">
          <div className="mb-8">
            <h2 className="font-jakarta font-extrabold text-2xl text-slate-900 tracking-tight">Similar Premium Properties in Jaipur</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Properties matching similar layout criteria or neighborhood pins.</p>
          </div>
          
          <div className="relative w-full">
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
              {similarProperties.map((p, idx) => (
                <div key={p.id} className="min-w-[285px] md:min-w-[320px] max-w-[350px] snap-center shrink-0">
                  <PropertyCard property={p} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
