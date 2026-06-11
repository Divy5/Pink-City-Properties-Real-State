'use client';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WishlistPage() {
  const { favorites } = useAuth();
  const { properties, loading } = useProperties();

  const mySavedProperties = properties.filter(
    p => favorites.some(id => id.toString() === p.id.toString())
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-16 min-h-[75vh]">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="font-jakarta font-extrabold text-display-xl mb-2">
          My <span className="text-gradient">Wishlist</span>
        </h1>
        <p className="text-on-surface-variant text-body-lg">Explore and manage your bookmarked premium listings in Jaipur.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl animate-pulse font-bold text-slate-500">Loading your bookmarked properties...</p>
        </div>
      ) : mySavedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-slate-200/50 rounded-2xl bg-white shadow-sm px-6 max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center text-rose-500 mb-6 shadow-md animate-bounce">
            <span className="material-symbols-outlined text-4xl">favorite</span>
          </div>
          <h2 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed font-semibold">
            Bookmark elite properties, luxury villas, and prime plots across Jaipur while browsing, and they will show up here instantly.
          </p>
          <Link href="/buy" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Browse Buy Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {mySavedProperties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
