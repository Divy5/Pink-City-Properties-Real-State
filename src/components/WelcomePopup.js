'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function WelcomePopup() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const shown = localStorage.getItem('pcp_welcome_popup_shown');
      if (shown === 'false') {
        setIsOpen(true);
      }
    }
  }, [user]);

  // Prevent scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('pcp_welcome_popup_shown', 'true');
  };

  const navigateTo = (path) => {
    handleClose();
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose} 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-lg md:max-w-xl bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 md:p-10 border border-slate-200 shadow-2xl z-10 overflow-y-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col items-center justify-start text-center scrollbar-thin outline-none"
          >
            {/* Top Glowing Gradient Ribbon */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500" />
            
            {/* Close Button */}
            <button 
              onClick={handleClose} 
              aria-label="Close welcome popup"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer z-20 active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Premium Animated Jaipur Smart City Vector SVG */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mx-auto mb-4 sm:mb-6 flex items-center justify-center shrink-0">
              <motion.svg 
                viewBox="0 0 200 200" 
                className="w-full h-full text-primary"
                initial="hidden"
                animate="visible"
              >
                {/* Background Sun Glow */}
                <motion.circle 
                  cx="100" cy="110" r="45" 
                  fill="#FFF4E6" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                />
                
                {/* Sun */}
                <motion.circle 
                  cx="100" cy="90" r="25" 
                  fill="#FFF3C4" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                />

                {/* Hawa Mahal Animated Outline Grid */}
                <motion.path 
                  d="M 50,150 L 50,135 L 70,120 L 90,135 L 90,150 Z" 
                  fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" strokeLinecap="round"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                />
                <motion.path 
                  d="M 90,150 L 90,125 L 110,110 L 130,125 L 130,150 Z" 
                  fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.path 
                  d="M 130,150 L 130,135 L 150,120 L 150,150 Z" 
                  fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" strokeLinecap="round"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                />

                {/* Tier 2 Arches */}
                <motion.path 
                  d="M 70,120 L 70,105 L 85,95 L 100,105 L 100,120 Z" 
                  fill="#FCE7F3" stroke="#BE185D" strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                />
                <motion.path 
                  d="M 100,120 L 100,105 L 115,95 L 130,105 L 130,120 Z" 
                  fill="#FCE7F3" stroke="#BE185D" strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                />

                {/* Top Dome Arch */}
                <motion.path 
                  d="M 85,95 L 100,75 L 115,95 Z" 
                  fill="#FCE7F3" stroke="#9D174D" strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                />

                {/* Traditional Lattice windows (Jharokhas) */}
                <motion.circle cx="70" cy="135" r="3" fill="#9D174D" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} />
                <motion.circle cx="110" cy="130" r="3.5" fill="#9D174D" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2.2, delay: 1.2 }} />
                <motion.circle cx="130" cy="135" r="3" fill="#9D174D" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.4, delay: 1.4 }} />
                <motion.circle cx="85" cy="108" r="2.5" fill="#9D174D" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.1, delay: 1.1 }} />
                <motion.circle cx="115" cy="108" r="2.5" fill="#9D174D" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.3, delay: 1.3 }} />

                {/* Ground Base Line */}
                <motion.line 
                  x1="30" y1="150" x2="170" y2="150" 
                  stroke="#1E293B" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Decorative Bird outlines flying */}
                <motion.path 
                  d="M 40,70 Q 45,65 50,70 Q 55,65 60,70" 
                  fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <motion.path 
                  d="M 150,55 Q 154,51 158,55 Q 162,51 166,55" 
                  fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.svg>
            </div>

            {/* Title & Spacing */}
            <div className="space-y-3 mb-6 sm:mb-8 shrink-0 max-w-md mx-auto">
              <h2 className="font-jakarta font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight">
                Welcome to Jaipur’s Smart Property Platform
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                Experience verified titles, dedicated relationship managers, and instant banking loan tie-ups in the Pink City.
              </p>
            </div>

            {/* Responsive Grid Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8 w-full max-w-md md:max-w-lg shrink-0">
              {[
                { title: 'Explore Buy', desc: 'Browse Listings', icon: 'travel_explore', path: '/buy', color: 'from-blue-50 to-indigo-50 hover:bg-blue-100/50 text-blue-600' },
                { title: 'Complete Profile', desc: 'Secure Lock', icon: 'badge', path: '/dashboard?tab=profile', color: 'from-purple-50 to-pink-50 hover:bg-purple-100/50 text-purple-600' },
                { title: 'Apply Loan', desc: 'SBI & HDFC Offers', icon: 'account_balance', path: '/home-loans', color: 'from-amber-50 to-orange-50 hover:bg-amber-100/50 text-amber-600' }
              ].map((shortcut) => (
                <button
                  key={shortcut.title}
                  onClick={() => navigateTo(shortcut.path)}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${shortcut.color} border border-slate-100 flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-1.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer text-left sm:text-center w-full`}
                >
                  <span className="material-symbols-outlined text-2xl font-bold shrink-0">{shortcut.icon}</span>
                  <div className="min-w-0">
                    <div className="text-slate-800 font-extrabold text-[10px] uppercase tracking-wider leading-tight truncate sm:whitespace-normal">{shortcut.title}</div>
                    <span className="text-[8px] text-slate-400 font-bold block mt-0.5 sm:mt-0">{shortcut.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons Stacking layout */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md shrink-0">
              <button 
                onClick={() => navigateTo('/buy')}
                className="w-full sm:flex-1 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span> Explore Premium Catalog
              </button>
              <button 
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 border border-slate-200 text-slate-500 rounded-2xl font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
