'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomePopup from './WelcomePopup';

// Split visible core links and dropdown links for a balanced, spacious layout
const coreLinks = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Plots', href: '/plots' },
  { label: 'Investments', href: '/investments' },
];

const secondaryLinks = [
  { label: 'Lease', href: '/lease' },
  { label: 'New Projects', href: '/new-projects' },
  { label: 'Upcoming Projects', href: '/upcoming-projects' },
  { label: 'Home Loans', href: '/home-loans' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Help', href: '/help' },
];

export default function Navbar() {
  const { 
    user, 
    logout, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    toast,
    clearToast
  } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Dialer & Owner details modal triggers
  const [dialingBroker, setDialingBroker] = useState(null);
  const [showOwnerDetailsModal, setShowOwnerDetailsModal] = useState(false);

  useEffect(() => {
    window.__pcp_dialer_trigger = (broker) => {
      setDialingBroker(broker);
    };
    window.__pcp_owner_details_trigger = () => {
      setShowOwnerDetailsModal(true);
    };
    return () => {
      window.__pcp_dialer_trigger = null;
      window.__pcp_owner_details_trigger = null;
    };
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'welcome': return 'handshake';
      case 'loan': return 'account_balance';
      case 'lead': return 'chat_bubble';
      case 'subscription': return 'workspace_premium';
      default: return 'notifications';
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-[0_4px_24px_rgba(15,44,89,0.03)]">
        <div className="flex justify-between items-center px-6 lg:px-10 py-3.5 w-full max-w-screen-2xl mx-auto h-16">
        
        {/* Logo */}
        <Link href="/" prefetch={true} className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-jakarta tracking-tight">
            Pink City Properties
          </span>
        </Link>

        {/* Desktop Spacious Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-jakarta font-bold text-xs uppercase tracking-wider text-slate-600">
          {coreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className="hover:text-primary transition-colors py-2 relative group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200" />
            </Link>
          ))}

          {/* Smart "More" Dropdown Link */}
          <div className="relative">
            <button
              onClick={() => { setMoreOpen(!moreOpen); setUserMenuOpen(false); setNotifOpen(false); }}
              className="hover:text-primary transition-colors py-2 flex items-center gap-1 uppercase tracking-wider whitespace-nowrap active:scale-95"
            >
              More
              <span className="material-symbols-outlined text-[16px] font-extrabold select-none">
                {moreOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className="absolute left-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/50 py-2.5 z-50"
                >
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-[11px] font-bold text-slate-650 hover:bg-blue-50/50 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Actions Tray */}
        <div className="flex items-center gap-3.5 relative">
          
          {/* Notifications Bell Dropdown */}
          {user && (
            <div className="relative flex items-center h-full">
              <button 
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); setMoreOpen(false); }}
                className="w-10 h-10 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-600 relative active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200/60 p-4 z-50 overflow-hidden"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <h4 className="font-jakarta font-extrabold text-slate-900 text-sm">Notifications</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{unreadNotificationsCount} Unread</p>
                      </div>
                      <div className="flex gap-2">
                        {unreadNotificationsCount > 0 && (
                          <button 
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            Read All
                          </button>
                        )}
                        <button 
                          onClick={clearNotifications}
                          className="text-[11px] font-bold text-red-500 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">notifications_off</span>
                          <p className="text-xs font-bold">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3 rounded-2xl border transition-all text-left flex gap-2.5 ${notif.read ? 'bg-slate-50/50 border-slate-100' : 'bg-[#EFF6FF]/40 border-blue-100/50'}`}
                          >
                            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${notif.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                              <span className="material-symbols-outlined text-[18px]">{getNotifIcon(notif.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <h5 className="font-bold text-xs text-slate-800 leading-snug truncate">{notif.title}</h5>
                                {!notif.read && (
                                  <button 
                                    onClick={() => markNotificationAsRead(notif.id)}
                                    className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1"
                                    title="Mark as read"
                                  />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 leading-snug break-words">{notif.message}</p>
                              <p className="text-[9px] text-slate-400 mt-1.5 font-semibold">{new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <button 
                      onClick={() => { router.push('/dashboard?tab=notifications'); setNotifOpen(false); }}
                      className="w-full text-center mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-slate-650 hover:text-primary transition-colors"
                    >
                      View All Notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Menu Trigger */}
          {user ? (
            <div className="relative flex items-center h-full">
              <button 
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); setMoreOpen(false); }}
                className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors h-11 shrink-0"
              >
                <span className="hidden md:block text-xs font-extrabold uppercase tracking-wider text-slate-700">{user.name}</span>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-8 h-8 rounded-xl object-cover shadow-sm shrink-0" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 select-none">
                    {user.avatar || user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/50 py-2 overflow-hidden z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 mb-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">{user.role || 'Buyer'}</span>
                    </div>
                    <button 
                      onClick={() => { router.push('/dashboard'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-650 hover:bg-blue-50/50 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">dashboard</span> Dashboard
                    </button>
                    <button 
                      onClick={() => { router.push('/dashboard?tab=saved'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-650 hover:bg-blue-50/50 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">favorite</span> Saved Properties
                    </button>
                    <button 
                      onClick={() => { logout(); setUserMenuOpen(false); router.push('/'); }}
                      className="w-full text-left px-4 py-2.5 mt-1 border-t border-slate-100 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">logout</span> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 h-10 rounded-xl border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-sm"
            >
              Login
            </Link>
          )}

          {/* Fixed & Aligned Post Your Property CTA */}
          <Link
            href="/add-property"
            className="hidden sm:flex px-5 py-2.5 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 items-center justify-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-base font-extrabold select-none">add</span>
            <span>Post Property</span>
          </Link>
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center w-10 h-10 shrink-0"
          >
            <span className="material-symbols-outlined text-slate-700">{mobileOpen ? 'close' : 'menu'}</span>
          </button>

        </div>
      </div>

      {/* Mobile Sticky Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1 max-h-[75vh] overflow-y-auto font-jakarta font-bold text-sm">
              {[...coreLinks, ...secondaryLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50/50 hover:text-primary transition-colors flex items-center justify-between"
                >
                  {link.label}
                  <span className="material-symbols-outlined text-sm opacity-50">chevron_right</span>
                </Link>
              ))}
              <Link
                href="/add-property"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-center shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_home</span> Post Property
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* First-Login Welcome Popup */}
    <WelcomePopup />

    {/* Premium Glassmorphic Global Toast System */}
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className="fixed bottom-6 right-6 z-[99999] p-4.5 rounded-[22px] bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3.5 max-w-sm text-white"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 
            toast.type === 'info' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
          }`}>
            <span className="material-symbols-outlined text-xl">
              {toast.type === 'error' ? 'cancel' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
          </div>
          <p className="text-xs font-bold font-semibold leading-relaxed flex-1">{toast.message}</p>
          <button onClick={clearToast} className="text-slate-400 hover:text-white transition-colors shrink-0">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Dialer Bridge Simulated Premium Modal */}
    <AnimatePresence>
      {dialingBroker && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setDialingBroker(null)} 
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] p-8 border border-slate-200 shadow-2xl z-10 text-center overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-green-500" />
            
            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center text-green-600 mb-6 relative">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-20"></span>
              <span className="material-symbols-outlined text-3.5xl">call</span>
            </div>

            <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[9px] font-black uppercase tracking-wider inline-block mb-3 animate-pulse">
              Secure Line Connected
            </span>

            <h4 className="font-jakarta font-extrabold text-slate-900 text-lg mb-1">Bridging Secure Audio Call</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-6 font-medium">
              We are placing a secure callback bridge to **{user?.phone || '+91 XXXXX XXXXX'}**. Your broker **{dialingBroker.name}** is standing by.
            </p>

            {/* Broker Brief */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center gap-3.5 mb-6 text-left">
              <img src={dialingBroker.photo} className="w-12 h-12 rounded-xl object-cover border" alt={dialingBroker.name} />
              <div>
                <h5 className="font-extrabold text-slate-800 text-sm">{dialingBroker.name}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{dialingBroker.title}</p>
              </div>
            </div>

            <button 
              onClick={() => setDialingBroker(null)}
              className="w-full py-4.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors active:scale-95 cursor-pointer"
            >
              Disconnect Connection
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Owner Details Secure Access Clearance Modal */}
    <AnimatePresence>
      {showOwnerDetailsModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowOwnerDetailsModal(false)} 
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] p-8 border border-slate-200 shadow-2xl z-10 text-center overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
            
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-blue-600 mb-6">
              <span className="material-symbols-outlined text-3.5xl">lock_open</span>
            </div>

            <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-wider inline-block mb-3">
              RERA Anti-Bypass Guarded
            </span>

            <h4 className="font-jakarta font-extrabold text-slate-900 text-lg mb-1">Owner Registry Verification</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-6 font-medium">
              To fulfill security clearance guidelines, owner credentials are only shared after platform relationship screening.
            </p>

            {/* Steps list */}
            <div className="space-y-3.5 text-left mb-6 bg-slate-50 p-4.5 rounded-2xl border">
              <div className="flex gap-2.5 items-start text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-green-500 text-[18px] shrink-0 font-bold">check_circle</span>
                <span>Buyer Authentication (Cleared)</span>
              </div>
              <div className="flex gap-2.5 items-start text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-green-500 text-[18px] shrink-0 font-bold">check_circle</span>
                <span>Phone Number Verified (+91 XXXXX XXXXX)</span>
              </div>
              <div className="flex gap-2.5 items-start text-xs font-semibold text-slate-500">
                <span className="material-symbols-outlined text-blue-500 text-[18px] shrink-0 font-bold animate-spin">hourglass_empty</span>
                <span>Title Clearance Approval pending (RERA ID: RAJ/P/2026/9912)</span>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-300 text-[10px] font-bold p-3.5 rounded-xl text-center leading-normal mb-6">
              ℹ️ Direct owner registry details will be dispatched to your phone via SMS & WhatsApp within 5 minutes after clearance verification.
            </div>

            <button 
              onClick={() => setShowOwnerDetailsModal(false)}
              className="w-full py-4.5 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors active:scale-95 cursor-pointer"
            >
              Okay, Understood
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
  );
}
