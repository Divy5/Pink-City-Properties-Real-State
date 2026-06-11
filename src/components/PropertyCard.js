'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PropertyCard({ property, index = 0 }) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  
  const favorited = isFavorite(property.id);

  const handleClick = (e) => {
    if (
      e.target.closest('.image-nav-button') || 
      e.target.closest('.favorite-button') || 
      e.target.closest('.contact-button')
    ) return;
    
    e.preventDefault();
    router.push(`/property/${property.id}`);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <div 
        onClick={handleClick}
        className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-primary/30 cursor-pointer shadow-sm hover:shadow-[0_8px_24px_rgba(15,76,129,0.06)] transition-all duration-300 flex flex-col h-full bg-white animate-fade-in"
      >
        {/* Top Badges Overlay (Verified & Featured & Wishlist Heart) */}
        <div className="absolute top-2.5 inset-x-2.5 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1 items-start select-none">
            {property.premium && (
              <span className="bg-gradient-to-r from-amber-500 to-[#D4AF37] text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm border border-amber-300/30">
                ★ FEATURED
              </span>
            )}
            {property.badge && property.badge !== 'Verified' && (
              <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                {property.badge}
              </span>
            )}
            <span className="bg-[#22C55E] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[9px] h-[9px] text-white shrink-0">
                <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7 3.1 5.51l.34 3.69L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>VERIFIED</span>
            </span>
          </div>

          {/* Wishlist Heart Button Overlay */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              toggleFavorite(property.id);
            }}
            className={`pointer-events-auto favorite-button w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${favorited ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
            title={favorited ? "Remove from Saved" : "Save Property"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={favorited ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-[14px] h-[14px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
        
        {/* Real Estate Image Container (Aspect 3:2) */}
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-slate-100 shrink-0">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              src={property.images && property.images.length > 0 ? property.images[currentImage] : '/placeholder-property.jpg'}
              alt={property.title}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </AnimatePresence>

          {property.images && property.images.length > 1 && (
            <>
              {/* Slider Dots indicators */}
              <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-0.5 z-20">
                {property.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-white scale-110' : 'bg-white/45'}`} />
                ))}
              </div>
              
              {/* Slider Arrows (Only show hover on Desktop) */}
              <button 
                onClick={prevImage} 
                className="image-nav-button absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-[2px] shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[10px] font-bold">chevron_left</span>
              </button>
              <button 
                onClick={nextImage} 
                className="image-nav-button absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-[2px] shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[10px] font-bold">chevron_right</span>
              </button>
            </>
          )}
        </div>
        
        {/* Card Content Layout */}
        <div className="p-3.5 flex flex-col flex-1 justify-between">
          <div className="space-y-1">
            {/* Price and property type tag */}
            <div className="flex justify-between items-center gap-2">
              <span className="font-jakarta font-extrabold text-[15px] text-primary tracking-tight">
                {property.priceDisplay}
              </span>
              <span className="bg-slate-50 border border-slate-200/80 text-slate-500 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                {property.type}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-jakarta font-extrabold text-slate-800 text-xs hover:text-primary transition-colors line-clamp-1 leading-snug">
              {property.title}
            </h3>

            {/* Location */}
            <div className="text-slate-450 text-[10px] flex items-center gap-0.5 font-bold truncate">
              <span className="material-symbols-outlined text-slate-400 text-xs shrink-0 select-none">location_on</span>
              <span className="truncate">{property.location}</span>
            </div>

            {/* Specs & Possession Tag Row */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2.5 mt-2">
              <span>{property.bhk || 'N/A'} BHK</span>
              <span className="text-slate-350">•</span>
              <span>{property.area ? property.area.split(' ')[0] : 'N/A'} Sqft</span>
              <span className="text-slate-350">•</span>
              <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0">
                {property.id % 2 === 0 ? 'Ready to Move' : 'In Construction'}
              </span>
            </div>
          </div>

          {/* Improved Action Footer (Agent/Owner, Contact, View Details) */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 z-10 relative">
            {/* Agent / Owner info on left */}
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-650 font-black text-[8px] flex items-center justify-center border border-slate-200 shrink-0">
                {property.listedBy ? property.listedBy[0].toUpperCase() : 'O'}
              </div>
              <span className="text-slate-500 text-[9px] font-black truncate uppercase tracking-wider">
                {property.listedBy || 'Owner'}
              </span>
            </div>

            {/* Action buttons on right */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Contact Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/property/${property.id}#contact-form`);
                }}
                className="contact-button px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[9px] font-black rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
              >
                Contact
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/property/${property.id}`);
                }}
                className="px-2.5 py-1.5 bg-primary text-white hover:bg-primary/95 text-[9px] font-black rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
