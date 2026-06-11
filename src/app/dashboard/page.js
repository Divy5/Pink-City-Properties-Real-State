'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/context/PropertyContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

function TabSlider({ activeTab, setActiveTab, isSeller, myPropertiesCount, sellerLeadsCount, mySavedPropertiesCount, buyerLeadsCount, loansCount, unreadNotificationsCount }) {
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0 });

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth + 5;
    setIsScrollable(scrollable);
    setShowLeftArrow(scrollable && scrollLeft > 5);
    setShowRightArrow(scrollable && scrollLeft < scrollWidth - clientWidth - 5);

    if (scrollWidth > 0) {
      const visibleRatio = clientWidth / scrollWidth;
      setIndicatorWidth(visibleRatio * 100);
      
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setIndicatorLeft((scrollLeft / maxScroll) * (100 - visibleRatio * 100));
      } else {
        setIndicatorLeft(0);
      }
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();

    // Check scroll on window resize and container scroll
    window.addEventListener('resize', checkScroll);
    el.addEventListener('scroll', checkScroll);

    // Initial delay check for layout render
    const timer = setTimeout(checkScroll, 100);

    return () => {
      window.removeEventListener('resize', checkScroll);
      el.removeEventListener('scroll', checkScroll);
      clearTimeout(timer);
    };
  }, []);

  // Center active tab automatically
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
    const timer = setTimeout(checkScroll, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.pageX,
      y: e.pageY,
      scrollLeft: el.scrollLeft
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX;
    const walk = (x - dragStart.current.x) * 1.5;
    el.scrollLeft = dragStart.current.scrollLeft - walk;
    checkScroll();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTabClick = (e, tabId) => {
    if (e.pageX !== undefined && e.pageX !== 0) {
      const distance = Math.sqrt(
        Math.pow(e.pageX - dragStart.current.x, 2) +
        Math.pow(e.pageY - dragStart.current.y, 2)
      );
      if (distance > 10) {
        e.preventDefault();
        return;
      }
    }
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid_view', visible: true },
    { id: 'profile', label: 'My Credentials', icon: 'manage_accounts', visible: true },
    { id: 'listings', label: `My Properties (${myPropertiesCount})`, icon: 'apartment', visible: isSeller },
    { id: 'leads', label: `Leads Board (${sellerLeadsCount})`, icon: 'contact_phone', visible: isSeller },
    { id: 'subscriptions', label: 'Subscription Plans', icon: 'workspace_premium', visible: isSeller },
    { id: 'analytics', label: 'Analytics', icon: 'monitoring', visible: isSeller },
    { id: 'saved', label: `Saved Properties (${mySavedPropertiesCount})`, icon: 'favorite', visible: true },
    { id: 'inquiries', label: `Contact Requests (${isSeller ? sellerLeadsCount : buyerLeadsCount})`, icon: 'support_agent', visible: true },
    { id: 'loans', label: `Loan Requests (${loansCount})`, icon: 'account_balance', visible: true },
    { id: 'recently', label: 'Recently Viewed', icon: 'history', visible: !isSeller },
    { id: 'notifications', label: `Alerts Center (${unreadNotificationsCount})`, icon: 'notifications', visible: true }
  ];

  return (
    <div className="relative w-full mb-8 select-none">
      {/* Left Fade Overlay & Button */}
      <AnimatePresence>
        {showLeftArrow && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:text-primary hover:shadow-lg active:scale-90 transition-all z-20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">chevron_left</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Right Fade Overlay & Button */}
      <AnimatePresence>
        {showRightArrow && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:text-primary hover:shadow-lg active:scale-90 transition-all z-20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">chevron_right</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Draggable Viewport */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-4 overflow-x-auto no-scrollbar pb-2 border-b border-slate-200/60 snap-x snap-proximity scroll-smooth cursor-grab select-none ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.filter(t => t.visible).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => handleTabClick(e, tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shrink-0 snap-start select-none outline-none cursor-pointer ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="material-symbols-outlined text-[18px] relative z-10">{tab.icon}</span>
              <span className="whitespace-nowrap relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Progress Scrollbar Indicator */}
      {isScrollable && (
        <div className="w-full flex justify-center mt-3 select-none pointer-events-none">
          <div className="w-24 h-1 bg-slate-200/40 rounded-full relative">
            <div 
              className="absolute top-0 bottom-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-75"
              style={{
                width: `${indicatorWidth}%`,
                left: `${indicatorLeft}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { 
    user, 
    loading: authLoading, 
    updateProfile, 
    favorites, 
    logout, 
    requireAuth,
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    leads,
    updateLeadStatus,
    loans,
    updateLoanStatus,
    recentlyViewed
  } = useAuth();
  
  const { properties, loading: propLoading, deleteProperty, renewPropertyPlan } = useProperties();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab handling
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', address: '', age: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [profileLockTimer, setProfileLockTimer] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  // Renew/Upgrade Multi-step Checkout State
  const [renewPropertyId, setRenewPropertyId] = useState(null);
  const [renewPlanSelected, setRenewPlanSelected] = useState('Premium');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewStep, setRenewStep] = useState(1); // 1: Plan select & invoice, 2: Payment details form, 3: Progress ticks, 4: Success
  const [renewPaymentMethod, setRenewPaymentMethod] = useState('Card'); // Card, UPI, NetBanking, Wallet, BankTransfer
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Secure payment form inputs
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [bankAccount, setBankAccount] = useState('');
  const [walletProvider, setWalletProvider] = useState('paytm');

  // Sync state with user details when loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!authLoading && !user) {
        requireAuth('/dashboard');
      }
    }
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        age: user.age || ''
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user, authLoading, requireAuth]);

  // Handle Tab from URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Profile 30-Day Lock Timer Calculator
  useEffect(() => {
    if (!user || !user.lastProfileUpdate) {
      setIsLocked(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const lockDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
      const timePassed = now - user.lastProfileUpdate;
      
      if (timePassed < lockDuration) {
        setIsLocked(true);
        const remaining = lockDuration - timePassed;
        const days = Math.floor(remaining / (24 * 3600000));
        const hours = Math.floor((remaining % (24 * 3600000)) / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setProfileLockTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setIsLocked(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (authLoading || propLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <p className="text-xl animate-pulse font-bold text-slate-500">Loading your secure dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  // Filter listings
  const myProperties = properties.filter(p => p.ownerEmail === user.email);
  const mySavedProperties = properties.filter(p => favorites.some(id => id.toString() === p.id.toString()));
  const myRecentProperties = properties.filter(p => recentlyViewed.includes(p.id));

  // Seller Dashboard Properties Categories
  const sellerActiveProps = myProperties.filter(p => p.planStatus === 'active');
  const sellerExpiredProps = myProperties.filter(p => p.planStatus === 'expired');
  const sellerSoldProps = myProperties.filter(p => p.status === 'Sold');

  // Leads
  const sellerLeads = leads.filter(l => l.sellerEmail === user.email);
  const buyerLeads = leads.filter(l => l.buyerEmail === user.email);

  // Image Upload helper
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  // Submit Profile Changes
  const handleSaveProfileClick = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      alert('Name is required.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSaveProfile = () => {
    setShowConfirmModal(false);
    const result = updateProfile(
      profileForm.name,
      user.role, // preserve role
      profileForm.phone,
      profileForm.address,
      Number(profileForm.age),
      avatarPreview
    );

    if (result.success) {
      setSaveMessage({ type: 'success', text: result.message });
      setIsEditing(false);
    } else {
      setSaveMessage({ type: 'error', text: result.message });
    }

    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Submit Plan Renewal
  const openRenewModal = (propId, currentPlan) => {
    setRenewPropertyId(propId);
    setRenewPlanSelected(currentPlan === 'Premium' ? 'Elite' : (currentPlan === 'Free' ? 'Premium' : currentPlan));
    setRenewStep(1);
    setRenewPaymentMethod('Card');
    setPaymentProgress(0);
    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setUpiId('');
    setBankAccount('');
    setShowRenewModal(true);
  };

  const startPaymentSimulation = () => {
    if (renewPaymentMethod === 'Card') {
      if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
        alert('Please fill out all Debit/Credit Card fields.');
        return;
      }
    } else if (renewPaymentMethod === 'UPI') {
      if (!upiId) {
        alert('Please fill out your UPI ID.');
        return;
      }
    } else if (renewPaymentMethod === 'NetBanking') {
      if (!bankAccount) {
        alert('Please enter your Bank Account Number.');
        return;
      }
    }

    setRenewStep(3);
    setPaymentProgress(0);

    const interval = setInterval(() => {
      setPaymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          renewPropertyPlan(renewPropertyId, renewPlanSelected);
          setRenewStep(4);
          
          setTimeout(() => {
            setShowRenewModal(false);
            setRenewPropertyId(null);
            setSaveMessage({ type: 'success', text: `Plan successfully activated for ${renewPlanSelected}!` });
            setTimeout(() => setSaveMessage(null), 4000);
          }, 1800);
          
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case 'Admin': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Seller': return 'bg-success/15 text-success border-success/30';
      case 'Builder': return 'bg-secondary/15 text-secondary border-secondary/30';
      case 'Agent': return 'bg-accent/15 text-primary border-accent/30';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const isSeller = user.role === 'Seller' || user.role === 'Agent' || user.role === 'Builder' || user.role === 'Admin';

  return (
    <div className="min-h-screen py-12 px-4 md:px-10 bg-slate-50/30">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-jakarta font-extrabold text-4xl mb-2 text-slate-900 tracking-tight">
              {isSeller ? 'Seller Premium Center' : 'Buyer Personal Center'}
            </h1>
            <p className="text-slate-500 font-medium">Manage credentials, review active leads, track status checklists, and handle subscriptions.</p>
          </div>
          
          {isSeller && (
            <Link 
              href="/add-property"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add_box</span> List New Property
            </Link>
          )}
        </motion.div>

        {/* Global Toast Alert */}
        {saveMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl font-bold text-sm border flex items-center gap-2.5 mb-8 shadow-md max-w-xl ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}
          >
            <span className="material-symbols-outlined">{saveMessage.type === 'success' ? 'check_circle' : 'warning'}</span>
            {saveMessage.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: PROFILE OVERVIEW */}
          <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
            <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-secondary" />
              
              {/* Profile Avatar */}
              <div className="relative mb-5 group">
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-slate-200 shrink-0" alt="Avatar" />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shrink-0 select-none">
                    {user.avatar || user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-success border-2 border-white" title="Secure login status" />
              </div>

              {/* Name and Role */}
              <h2 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">{user.name}</h2>
              <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6 ${getRoleBadgeStyle(user.role)}`}>
                {user.role || 'Buyer'}
              </span>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 w-full border-y border-slate-100 py-6 mb-6">
                <div>
                  <p className="text-3xl font-black text-primary">{isSeller ? myProperties.length : mySavedProperties.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isSeller ? 'My Listings' : 'Saved Favorites'}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-secondary">{isSeller ? sellerLeads.length : buyerLeads.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isSeller ? 'Buyer Inquiries' : 'Contact Requests'}</p>
                </div>
              </div>

              {/* Contact info list */}
              <div className="space-y-4 w-full text-left mb-8">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Registered Phone</label>
                  <p className="text-sm font-bold text-slate-700">{user.phone || '+91 99999 88888'}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">City Location</label>
                  <p className="text-sm font-bold text-slate-700">{user.address || 'Vaishali Nagar, Jaipur'}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={() => { logout(); router.push('/'); }}
                className="w-full py-4 rounded-2xl border-2 border-red-50 hover:bg-red-50/50 text-error font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm font-bold">logout</span> Sign Out Account
              </button>
            </div>
          </motion.div>

          {/* RIGHT TABS: SELLER OR BUYER PANELS */}
          <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8">
            <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-8 shadow-xl min-h-[550px] flex flex-col">
              
              {/* Tab Selector Slider */}
              <TabSlider
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSeller={isSeller}
                myPropertiesCount={myProperties.length}
                sellerLeadsCount={sellerLeads.length}
                mySavedPropertiesCount={mySavedProperties.length}
                buyerLeadsCount={buyerLeads.length}
                loansCount={loans.length}
                unreadNotificationsCount={unreadNotificationsCount}
              />

              {/* ========================================================
                  TAB 0: SAAS OVERVIEW CENTER GRID (COMMON)
                  ======================================================== */}
              {activeTab === 'overview' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex-1 space-y-8"
                >
                  <div className="border-b border-slate-150 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Command Overview Center</h3>
                    <p className="text-xs text-slate-500 font-medium">Aggregated real estate metrics, user profile locks, bank integrations, and active alerts.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {(() => {
                      const list = [
                        {
                          id: 'profile',
                          title: 'My Credentials',
                          desc: 'Secure credential controls',
                          icon: 'manage_accounts',
                          stat: 'Profile Verified',
                          badge: 0,
                          color: 'from-primary/10 to-secondary/10 text-primary border-primary/20',
                          visible: true
                        },
                        {
                          id: 'listings',
                          title: 'My Properties',
                          desc: 'Listed Jaipur properties',
                          icon: 'apartment',
                          stat: `${myProperties.length} advertised ads`,
                          badge: 0,
                          color: 'from-success/10 to-success/25 text-success border-success/30',
                          visible: isSeller
                        },
                        {
                          id: 'leads',
                          title: 'Leads Board',
                          desc: 'Active buyer contact inquiries',
                          icon: 'contact_phone',
                          stat: `${sellerLeads.length} leads registered`,
                          badge: sellerLeads.filter(l => l.status === 'Pending').length,
                          color: 'from-error/10 to-error/25 text-error border-error/30',
                          visible: isSeller
                        },
                        {
                          id: 'subscriptions',
                          title: 'Subscription Plans',
                          desc: 'Extend listing Visibility',
                          icon: 'workspace_premium',
                          stat: 'Tiers active',
                          badge: 0,
                          color: 'from-warning/10 to-warning/25 text-warning border-warning/30',
                          visible: isSeller
                        },
                        {
                          id: 'analytics',
                          title: 'Visual Analytics',
                          desc: 'Audience performance metrics',
                          icon: 'monitoring',
                          stat: '14.8k Total Views',
                          badge: 0,
                          color: 'from-secondary/10 to-accent/20 text-secondary border-secondary/20',
                          visible: isSeller
                        },
                        {
                          id: 'saved',
                          title: 'Saved Properties',
                          desc: 'Bookmarked properties',
                          icon: 'favorite',
                          stat: `${mySavedProperties.length} properties saved`,
                          badge: 0,
                          color: 'from-error/10 to-error/25 text-error border-error/30',
                          visible: true
                        },
                        {
                          id: 'inquiries',
                          title: 'Contact Requests',
                          desc: 'Buyer-broker connection logs',
                          icon: 'support_agent',
                          stat: `${isSeller ? sellerLeads.length : buyerLeads.length} requests logged`,
                          badge: 0,
                          color: 'from-primary/10 to-accent/20 text-primary border-primary/20',
                          visible: true
                        },
                        {
                          id: 'loans',
                          title: 'Loan Requests',
                          desc: 'SBI & HDFC banking tie-ups',
                          icon: 'account_balance',
                          stat: `${loans.length} applications active`,
                          badge: loans.filter(l => l.status === 'Documents Required').length ? '!' : 0,
                          color: 'from-secondary/10 to-accent/25 text-secondary border-secondary/35',
                          visible: true
                        },
                        {
                          id: 'recently',
                          title: 'Recently Viewed',
                          desc: 'Session browsing sheets',
                          icon: 'history',
                          stat: `${recentlyViewed.length} items logged`,
                          badge: 0,
                          color: 'from-slate-500/10 to-zinc-500/10 text-slate-650 border-slate-150',
                          visible: !isSeller
                        },
                        {
                          id: 'notifications',
                          title: 'Alerts Center',
                          desc: 'Platform notifications',
                          icon: 'notifications',
                          stat: `${unreadNotificationsCount} unread logs`,
                          badge: unreadNotificationsCount,
                          color: 'from-primary/10 to-accent/20 text-primary border-primary/20',
                          visible: true
                        }
                      ];

                      return list.filter(item => item.visible).map(card => (
                        <motion.div
                          key={card.id}
                          whileHover={{ scale: 1.03, y: -4 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          onClick={() => setActiveTab(card.id)}
                          className="bg-white rounded-[24px] border border-slate-200 p-6 flex flex-col justify-between h-48 cursor-pointer hover:shadow-xl hover:border-slate-300 transition-all group relative overflow-hidden text-left"
                        >
                          {/* Pulsing notification badge */}
                          {card.badge > 0 && (
                            <span className="absolute top-4 right-4 flex h-3.5 w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 flex items-center justify-center text-[8px] text-white font-extrabold">
                                {card.badge === '!' ? '!' : card.badge}
                              </span>
                            </span>
                          )}

                          <div className="space-y-3">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} border flex items-center justify-center shrink-0`}>
                              <span className="material-symbols-outlined text-2xl font-bold">{card.icon}</span>
                            </div>
                            <div>
                              <h4 className="font-jakarta font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                                {card.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold font-semibold mt-0.5">
                                {card.desc}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-bold text-slate-500">
                            <span>{card.stat}</span>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all text-[18px]">
                              arrow_forward
                            </span>
                          </div>
                        </motion.div>
                      ));
                    })()}
                  </div>
                </motion.div>
              )}

              {/* ========================================================
                  TAB 1: ACCOUNT CREDENTIALS (COMMON)
                  ======================================================== */}
              {activeTab === 'profile' && (
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Account Credentials</h3>
                      <p className="text-xs text-slate-500">Edit account variables. Once changed, profile locks for 30 days.</p>
                    </div>
                    {!isEditing && !isLocked && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span> Edit Details
                      </button>
                    )}
                  </div>

                  {/* 30-Day Edit Lock Countdown Banner */}
                  {isLocked && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-[20px] flex items-center gap-3">
                      <span className="material-symbols-outlined text-amber-600 text-2xl animate-pulse">lock</span>
                      <div>
                        <h4 className="font-jakarta font-extrabold text-xs mb-0.5">Profile Locked for security</h4>
                        <p className="text-[11px] text-amber-700 leading-normal">
                          You updated profile variables recently. Inputs are read-only for: <span className="font-extrabold text-primary tracking-tight">{profileLockTimer}</span>.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSaveProfileClick} className="space-y-5 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Display Name</label>
                        <input
                          disabled={!isEditing || isLocked}
                          type="text"
                          required
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/40 disabled:text-slate-500 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-800"
                          value={profileForm.name}
                          onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Email (Read Only)</label>
                        <input
                          disabled
                          type="email"
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100/50 text-slate-500 outline-none font-semibold text-sm"
                          value={profileForm.email}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Phone Number</label>
                        <input
                          disabled={!isEditing || isLocked}
                          type="tel"
                          required
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/40 disabled:text-slate-500 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-800"
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Age (Salaried Check)</label>
                        <input
                          disabled={!isEditing || isLocked}
                          type="number"
                          required
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/40 disabled:text-slate-500 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-800"
                          value={profileForm.age}
                          onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 mb-2">Office Address</label>
                        <input
                          disabled={!isEditing || isLocked}
                          type="text"
                          required
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/40 disabled:text-slate-500 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm text-slate-800"
                          value={profileForm.address}
                          onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                        />
                      </div>

                      {/* Custom Avatar Uploader */}
                      {isEditing && !isLocked && (
                        <div className="sm:col-span-2 p-5 border border-slate-200 border-dashed rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden shrink-0 shadow-sm border border-slate-300">
                            {avatarPreview ? (
                              <img src={avatarPreview} className="w-full h-full object-cover" alt="Upload Preview" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">person</span></div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-2 w-full text-center sm:text-left">
                            <h5 className="font-extrabold text-xs text-slate-800">Upload profile image</h5>
                            <p className="text-[10px] text-slate-400 font-semibold">JPG, PNG allowed. Converes to Base64 instantly.</p>
                            <div className="flex justify-center sm:justify-start gap-2.5 mt-1">
                              <button 
                                type="button"
                                onClick={() => document.getElementById('avatar-file-input').click()}
                                className="px-3.5 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/95 active:scale-95 transition-all shadow-sm"
                              >
                                Upload Photo
                              </button>
                              {avatarPreview && (
                                <button 
                                  type="button"
                                  onClick={removeAvatar}
                                  className="px-3.5 py-2 border border-red-200 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-50 active:scale-95 transition-all"
                                >
                                  Remove Photo
                                </button>
                              )}
                            </div>
                            <input id="avatar-file-input" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditing && !isLocked && (
                      <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                          type="submit"
                          className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                          Save Profile Credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setProfileForm({
                              name: user.name,
                              email: user.email,
                              phone: user.phone || '',
                              address: user.address || '',
                              age: user.age || ''
                            });
                            setAvatarPreview(user.avatarUrl);
                          }}
                          className="px-6 py-3.5 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all"
                        >
                          Cancel Change
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* ========================================================
                  TAB 2: MY LISTINGS (SELLER)
                  ======================================================== */}
              {activeTab === 'listings' && isSeller && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">My Property Advertisements</h3>
                      <p className="text-xs text-slate-500">Properties listed under your ownership tier in Jaipur.</p>
                    </div>
                  </div>

                  {myProperties.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 animate-pulse">apartment</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Properties Listed</h4>
                      <p className="text-slate-500 text-xs max-w-sm mb-6 leading-normal font-semibold">List properties now to advertise directly to buyers.</p>
                      <Link href="/add-property" className="px-5 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors active:scale-95">
                        Post Property Listing
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myProperties.map((p) => (
                        <div key={p.id} className="relative group flex flex-col">
                          
                          {/* Seller Actions Overlay Panel */}
                          <div className="absolute top-24 right-5 z-20 flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this listing?')) {
                                  deleteProperty(p.id);
                                }
                              }}
                              className="px-3 py-2 rounded-xl bg-error text-white text-[10px] font-black hover:bg-error/95 shadow-lg flex items-center gap-1 active:scale-90 transition-all uppercase tracking-wider"
                              title="Delete Listing"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span> Delete
                            </button>
                            {p.plan === 'Free' ? null : (() => {
                              const now = Date.now();
                              const expiry = new Date(p.planExpiryDate).getTime();
                              const daysLeft = Math.ceil((expiry - now) / (24 * 3600000));
                              const isExpired = now > expiry || p.planStatus === 'expired';
                              const isNearExpiry = daysLeft <= 5 && !isExpired;

                              if (isExpired || isNearExpiry) {
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openRenewModal(p.id, p.plan);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-secondary text-white text-[10px] font-black hover:bg-secondary/95 shadow-lg flex items-center gap-1 active:scale-90 transition-all uppercase tracking-wider"
                                    title="Renew Listing Plan"
                                  >
                                    <span className="material-symbols-outlined text-sm">autorenew</span> Renew
                                  </button>
                                );
                              }

                              if (p.plan === 'Premium') {
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenewPropertyId(p.id);
                                      setRenewPlanSelected('Elite');
                                      setRenewStep(1);
                                      setRenewPaymentMethod('Card');
                                      setPaymentProgress(0);
                                      setShowRenewModal(true);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-black hover:scale-105 shadow-lg flex items-center gap-1 active:scale-90 transition-all uppercase tracking-wider"
                                    title="Upgrade to Elite Plan"
                                  >
                                    <span className="material-symbols-outlined text-sm">upgrade</span> Upgrade
                                  </button>
                                );
                              }

                              return (
                                <span className="px-3 py-2 rounded-xl bg-green-600 text-white text-[9px] font-black shadow-lg flex items-center gap-1 uppercase tracking-wider select-none">
                                  <span className="material-symbols-outlined text-xs">check_circle</span> Active
                                </span>
                              );
                            })()}
                          </div>

                          <div className="flex-1">
                            <PropertyCard property={p} index={0} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 3: LEADS DASHBOARD (SELLER)
                  ======================================================== */}
              {activeTab === 'leads' && isSeller && (
                <div className="flex-1 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Leads Dashboard</h3>
                    <p className="text-xs text-slate-500">Contact inquiries from interested buyers regarding your properties.</p>
                  </div>

                  {sellerLeads.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 animate-bounce">contact_phone</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Leads Received Yet</h4>
                      <p className="text-slate-500 text-xs max-w-sm leading-normal font-semibold">Your listing pages feature an inquiry form. When a buyer submits it, it lists here instantly.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sellerLeads.map((lead) => (
                        <div key={lead.id} className="p-5 border border-slate-200 rounded-[24px] bg-white hover:border-slate-300 transition-all shadow-sm space-y-4">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Buyer Inquiry</span>
                              <h4 className="font-jakarta font-extrabold text-slate-900 text-base">{lead.buyerName}</h4>
                              <p className="text-xs text-primary font-extrabold mt-0.5">Property: "{lead.propertyTitle}"</p>
                            </div>
                            <div className="flex gap-2">
                              {['Pending', 'Contacted', 'Closed'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateLeadStatus(lead.id, status)}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${lead.status === status ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic leading-relaxed">
                            "{lead.message}"
                          </p>

                          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-semibold gap-3 pt-2">
                            <div className="flex gap-4">
                              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-slate-400">call</span> {lead.buyerPhone}</span>
                              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-slate-400">mail</span> {lead.buyerEmail}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">{new Date(lead.time).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 4: SUBSCRIPTIONS EXPRIY COUNTDOWN (SELLER)
                  ======================================================== */}
              {activeTab === 'subscriptions' && isSeller && (
                <div className="flex-1 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Active Subscriptions tracker</h3>
                    <p className="text-xs text-slate-500">Overview of property listing plan durations, expirations, and renewals.</p>
                  </div>

                  {myProperties.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 animate-pulse">workspace_premium</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Listing Subscriptions</h4>
                      <p className="text-slate-500 text-xs max-w-sm mb-6 leading-normal font-semibold">Post your properties to select and review listing plan schedules.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myProperties.map((p) => {
                        const now = Date.now();
                        const expiry = new Date(p.planExpiryDate).getTime();
                        const daysLeft = Math.ceil((expiry - now) / (24 * 3600000));
                        const isExpired = now > expiry || p.planStatus === 'expired';

                        return (
                          <div key={p.id} className="p-6 border border-slate-200 rounded-[24px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all shadow-sm">
                            <div className="space-y-1">
                              <h4 className="font-jakarta font-extrabold text-slate-900 text-base">{p.title}</h4>
                              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">pin_drop</span> {p.location}</p>
                              <div className="flex gap-2.5 mt-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${p.plan === 'Elite' ? 'bg-warning/10 text-warning border-warning/30' : (p.plan === 'Premium' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-slate-100 text-slate-700')}`}>
                                  {p.plan || 'Free'} Plan
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${isExpired ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                  {isExpired ? 'Expired' : 'Active'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Countdown & Renew buttons */}
                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto text-right">
                              {p.plan === 'Free' ? (
                                <p className="text-xs font-bold text-slate-400">Unlimited Visibility</p>
                              ) : isExpired ? (
                                <p className="text-xs font-black text-red-650">Plan Expired</p>
                              ) : (
                                <div>
                                  <p className="text-lg font-black text-primary tracking-tight">{daysLeft} Days Remaining</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expiry: {new Date(p.planExpiryDate).toLocaleDateString()}</p>
                                </div>
                              )}
                              
                              {p.plan === 'Free' ? null : isExpired || daysLeft <= 5 ? (
                                <button 
                                  onClick={() => openRenewModal(p.id, p.plan)}
                                  className="px-4 py-2 bg-secondary hover:bg-secondary/95 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-sm flex items-center gap-1 mt-1 cursor-pointer w-full sm:w-auto justify-center"
                                >
                                  <span className="material-symbols-outlined text-sm">autorenew</span> Renew/Upgrade
                                </button>
                              ) : p.plan === 'Premium' ? (
                                <div className="flex flex-col items-end gap-2 mt-1 w-full">
                                  <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-xl flex items-center gap-1 select-none">
                                    <span className="material-symbols-outlined text-xs">check_circle</span> Plan Active
                                  </span>
                                  <button 
                                    onClick={() => {
                                      setRenewPropertyId(p.id);
                                      setRenewPlanSelected('Elite');
                                      setRenewStep(1);
                                      setRenewPaymentMethod('Card');
                                      setPaymentProgress(0);
                                      setShowRenewModal(true);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:brightness-95 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-md flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center"
                                  >
                                    <span className="material-symbols-outlined text-sm">upgrade</span> Upgrade to Elite (₹2k)
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] mt-1 font-bold text-green-600 bg-green-50 border border-green-200 px-4 py-1.5 rounded-xl flex items-center gap-1 select-none">
                                  <span className="material-symbols-outlined text-sm">check_circle</span> Plan Active
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 5: ANALYTICS BOARD (SELLER)
                  ======================================================== */}
              {activeTab === 'analytics' && isSeller && (
                <div className="flex-1 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Visual Analytics</h3>
                    <p className="text-xs text-slate-500">Advertisements performance indicators: page views, clicks, saves, and locality stats.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Total Property Views', count: '14,820', diff: '+12.5%', color: 'text-primary' },
                      { title: 'Contact Clicks', count: '286', diff: '+8.3%', color: 'text-secondary' },
                      { title: 'Wishlist Saves', count: '943', diff: '+18.1%', color: 'text-error' },
                      { title: 'Lead Conversion', count: '3.8%', diff: '+2.1%', color: 'text-success' }
                    ].map((stat, idx) => (
                      <div key={idx} className="p-5 border border-slate-200 rounded-[24px] bg-slate-50/50 shadow-sm flex flex-col justify-between h-32">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-snug">{stat.title}</p>
                        <div>
                          <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.count}</p>
                          <span className="text-[9px] font-extrabold text-green-600">{stat.diff} vs last month</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Local Jaipur Traffic details */}
                  <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-jakarta font-extrabold text-sm mb-4">Traffic distribution by Jaipur Neighborhoods</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Vaishali Nagar', percentage: 42, views: '6,224 Views' },
                        { name: 'C-Scheme', percentage: 28, views: '4,149 Views' },
                        { name: 'Mansarovar', percentage: 18, views: '2,667 Views' },
                        { name: 'Malviya Nagar', percentage: 12, views: '1,780 Views' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-700">{item.name}</span>
                            <span className="text-slate-400">{item.views} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 6: SAVED FAVORITES (BUYER)
                  ======================================================== */}
              {activeTab === 'saved' && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">My Wishlist</h3>
                    <p className="text-xs text-slate-500">Quick list of properties favorited using the heart button.</p>
                  </div>

                  {mySavedProperties.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-rose-400 mb-4 animate-pulse">favorite</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">Wishlist is Empty</h4>
                      <p className="text-slate-500 text-xs max-w-sm mb-6 leading-normal font-semibold">Click the heart button on listing cards to bookmark details here.</p>
                      <Link href="/buy" className="px-5 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors active:scale-95">
                        Explore Properties
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mySavedProperties.map((p) => (
                        <PropertyCard key={p.id} property={p} index={0} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 7: CONTACT REQUESTS LOG (BUYER)
                  ======================================================== */}
              {activeTab === 'inquiries' && (
                <div className="flex-1 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Contact Requests Log</h3>
                    <p className="text-xs text-slate-500">Record of call-back requests and site visit bookings sent to sellers.</p>
                  </div>

                  {buyerLeads.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">support_agent</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Inquiries Sent Yet</h4>
                      <p className="text-slate-500 text-xs max-w-sm leading-normal font-semibold">Contact sellers directly from the sidebar on any property detail page to register requests here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {buyerLeads.map((lead) => (
                        <div key={lead.id} className="p-5 border border-slate-200 rounded-[24px] bg-white hover:border-slate-300 transition-all shadow-sm space-y-3">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <h4 className="font-jakarta font-extrabold text-slate-900 text-base">{lead.propertyTitle}</h4>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">Seller: {lead.sellerEmail}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${lead.status === 'Closed' ? 'bg-red-50 text-red-700 border-red-100' : (lead.status === 'Contacted' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100')}`}>
                              {lead.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 italic">
                            Message: "{lead.message}"
                          </p>

                          <div className="flex justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-2.5">
                            <span>Sent via: Call Back Portal</span>
                            <span>{new Date(lead.time).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 8: LOAN TIMELINE TRACKER (BUYER)
                  ======================================================== */}
              {activeTab === 'loans' && (
                <div className="flex-1 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Loan Timelines</h3>
                    <p className="text-xs text-slate-500">Track and screen check-limit responses for home loan applications.</p>
                  </div>

                  {loans.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 animate-pulse">account_balance</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Loan Applications</h4>
                      <p className="text-slate-500 text-xs max-w-sm mb-6 leading-normal font-semibold">Apply for competitive home loans with SBI, HDFC, or ICICI to start tracking timeline checkpoints here.</p>
                      <Link href="/home-loans" className="px-5 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors active:scale-95">
                        Apply Home Loan Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {loans.map((loan) => {
                        // Badge color styles
                        const getStatusStyle = (status) => {
                          switch (status) {
                            case 'Approved':
                              return 'bg-green-50 text-green-700 border-green-200';
                            case 'Rejected':
                              return 'bg-red-50 text-red-700 border-red-200';
                            case 'Under Review':
                              return 'bg-primary/10 text-primary border-primary/20';
                            case 'Documents Required':
                              return 'bg-amber-50 text-amber-700 border-amber-200';
                            default: // Pending
                              return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                          }
                        };

                        const getStepClass = (stepName) => {
                          const status = loan.status || 'Pending';
                          if (stepName === 'Application Submitted' || stepName === 'Documents Uploaded') {
                            if (status === 'Documents Required' && stepName === 'Documents Uploaded') {
                              return 'bg-amber-500 border-amber-500 text-white animate-pulse';
                            }
                            return 'bg-green-500 border-green-500 text-white';
                          }
                          
                          if (stepName === 'Verification Pending') {
                            if (status === 'Approved' || status === 'Rejected') {
                              return 'bg-green-500 border-green-500 text-white';
                            }
                            if (status === 'Under Review' || status === 'Pending') {
                              return 'bg-primary border-primary text-white animate-pulse';
                            }
                            return 'border-slate-200 bg-white text-slate-400';
                          }

                          if (stepName === 'Bank Approval') {
                            if (status === 'Approved') {
                              return 'bg-green-500 border-green-500 text-white';
                            }
                            if (status === 'Rejected') {
                              return 'bg-red-500 border-red-500 text-white';
                            }
                            if (status === 'Under Review') {
                              return 'bg-primary border-primary text-white animate-pulse';
                            }
                            return 'border-slate-200 bg-white text-slate-400';
                          }
                        };

                        const getStepIcon = (stepName) => {
                          const status = loan.status || 'Pending';
                          if (stepName === 'Application Submitted' || stepName === 'Documents Uploaded') {
                            if (status === 'Documents Required' && stepName === 'Documents Uploaded') {
                              return 'warning';
                            }
                            return 'done';
                          }
                          if (stepName === 'Verification Pending') {
                            if (status === 'Approved' || status === 'Rejected') return 'done';
                            if (status === 'Under Review' || status === 'Pending') return 'hourglass_empty';
                            return 'circle';
                          }
                          if (stepName === 'Bank Approval') {
                            if (status === 'Approved') return 'done';
                            if (status === 'Rejected') return 'close';
                            return 'circle';
                          }
                          return 'circle';
                        };

                        return (
                          <div key={loan.id} className="p-6 border border-slate-200 rounded-[28px] bg-white shadow-sm space-y-8">
                            
                            {/* Loan Header */}
                            <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-50 pb-4">
                              <div>
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-0.5">
                                  Banking Partner • ID: {loan.requestId || `REQ-${loan.id}`}
                                </span>
                                <h4 className="font-jakarta font-extrabold text-slate-900 text-lg">{loan.bankName}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold mt-1">
                                  <span>Required Loan: <span className="text-slate-800 font-bold">₹{Number(loan.amount || 2500000).toLocaleString()}</span></span>
                                  <span>Applied: <span className="text-slate-800 font-bold">{new Date(loan.date).toLocaleDateString()}</span></span>
                                  <span>Last Updated: <span className="text-slate-800 font-bold">{new Date(loan.date).toLocaleDateString()}</span></span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-semibold mt-1.5">
                                  Monthly Income: ₹{Number(loan.income).toLocaleString()} • Existing EMIs: ₹{Number(loan.emis).toLocaleString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(loan.status)}`}>
                                {loan.status || 'Pending'}
                              </span>
                            </div>

                            {/* Documents Required Action Callout Banner */}
                            {loan.status === 'Documents Required' && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                className="p-4 bg-amber-50 text-amber-900 border border-amber-250 rounded-2xl flex items-start gap-3 text-left"
                              >
                                <span className="material-symbols-outlined text-amber-600 text-2xl animate-bounce mt-0.5">warning</span>
                                <div>
                                  <h4 className="font-jakarta font-extrabold text-xs mb-0.5">Verification On Hold: Missing Documents</h4>
                                  <p className="text-[11px] text-amber-700 leading-normal font-semibold">
                                    The underwriting team requires outstanding records: please upload or email your last **Form-16** and **3 months Bank Statements** to <span className="underline font-bold">loans@pinkcityproperties.com</span> immediately.
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {/* Timeline Stepper UI */}
                            <div className="relative pt-6 max-w-xl mx-auto">
                              <div className="absolute top-[44px] left-8 right-8 h-0.5 bg-slate-100 z-0" />
                              <div className="relative z-10 flex justify-between">
                                {[
                                  'Application Submitted',
                                  'Documents Uploaded',
                                  'Verification Pending',
                                  'Bank Approval'
                                ].map((step) => {
                                  const stepClass = getStepClass(step);
                                  const icon = getStepIcon(step);

                                  return (
                                    <div key={step} className="flex flex-col items-center gap-2 max-w-[110px] text-center">
                                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${stepClass}`}>
                                        <span className="material-symbols-outlined text-[18px] font-bold">{icon}</span>
                                      </div>
                                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider leading-snug">
                                        {step === 'Verification Pending' && loan.status === 'Under Review' ? 'Under Review' : step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 9: RECENTLY VIEWED PROPERTIES (BUYER)
                  ======================================================== */}
              {activeTab === 'recently' && !isSeller && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Recently Viewed Properties</h3>
                    <p className="text-xs text-slate-500">List of property detail sheets visited recently during this session.</p>
                  </div>

                  {myRecentProperties.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 animate-pulse">history</span>
                      <h4 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">No Recent history</h4>
                      <p className="text-slate-500 text-xs max-w-sm mb-6 leading-normal font-semibold">Properties clicked during browsing register here for immediate recall.</p>
                      <Link href="/buy" className="px-5 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors active:scale-95">
                        Explore Properties
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myRecentProperties.map((p) => (
                        <PropertyCard key={p.id} property={p} index={0} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 10: NOTIFICATIONS ALERTS CENTER (COMMON)
                  ======================================================== */}
              {activeTab === 'notifications' && (
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">Alerts Center</h3>
                      <p className="text-xs text-slate-500">Core system notifications logs, loan timeline screening triggers, and subscriptions updates.</p>
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Clear All Logs
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-slate-100 rounded-[28px] bg-slate-50/20">
                      <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">notifications_off</span>
                      <h4 className="font-jakarta font-extrabold text-slate-700 text-lg mb-1">Alerts log is empty</h4>
                      <p className="text-slate-400 text-xs font-semibold">All cleared or no notifications registered.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${notif.read ? 'bg-slate-50/50 border-slate-200/60' : 'bg-primary/5 border-primary/20 shadow-sm'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm ${notif.read ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'}`}>
                            <span className="material-symbols-outlined text-xl">
                              {notif.type === 'loan' ? 'account_balance' : (notif.type === 'lead' ? 'support_agent' : 'notifications')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 flex-wrap">
                              <h5 className="font-jakarta font-extrabold text-sm text-slate-800 leading-snug">{notif.title}</h5>
                              <div className="flex gap-2">
                                {!notif.read && (
                                  <button 
                                    onClick={() => markNotificationAsRead(notif.id)}
                                    className="text-[10px] font-bold text-primary hover:underline"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{new Date(notif.date).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>

        </div>
      </div>

      {/* ========================================================
          MODAL 1: 30-DAY UPDATE CONFIRMATION DIALOG (COMMON)
          ======================================================== */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 15 }} 
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 border border-slate-200 shadow-2xl space-y-6 text-center z-10"
            >
              <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center mx-auto"><span className="material-symbols-outlined text-3xl">warning</span></div>
              <div className="space-y-2">
                <h3 className="font-jakarta font-extrabold text-xl text-slate-900">Lock profile details?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enrolling updates locks inputs for the next <span className="font-bold text-primary">30 days</span>. Ensure address and phone number parameters are strictly validated before confirming.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={confirmSaveProfile}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Confirm &amp; Lock
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 2: PLAN RENEWAL AND UPGRADE FORM (SELLER)
          ======================================================== */}
      <AnimatePresence>
        {showRenewModal && (() => {
          const targetProperty = properties.find(p => p.id === renewPropertyId);
          const currentPlan = targetProperty?.plan || 'Free';
          const isUpgrade = currentPlan === 'Premium' && renewPlanSelected === 'Elite';
          
          const basePrice = isUpgrade ? 2000 : (renewPlanSelected === 'Elite' ? 5000 : 3000);
          const taxAmount = Math.round(basePrice * 0.18);
          const totalAmount = basePrice + taxAmount;

          const now = Date.now();
          const expiry = targetProperty ? new Date(targetProperty.planExpiryDate).getTime() : now;
          const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (24 * 3600000)));

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRenewModal(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                className="relative w-full max-w-lg bg-white rounded-[32px] p-8 border border-slate-200 shadow-2xl space-y-6 z-10 overflow-hidden"
              >
                {/* Gold/Blue Accented top banner */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-tertiary to-amber-500" />

                {renewStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-2">Checkout Details</span>
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 leading-none">Renew / Upgrade Plan</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">Extend standard active duration for listing: <span className="font-bold text-slate-800">"{targetProperty?.title}"</span></p>
                    </div>

                    {isUpgrade && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-900 border border-amber-200/50 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-amber-600 text-2xl animate-pulse">workspace_premium</span>
                        <div className="text-left">
                          <h4 className="font-jakarta font-extrabold text-xs">Special Active Upgrade Promo Applied</h4>
                          <p className="text-[10px] text-amber-700 font-semibold leading-normal mt-0.5">
                            You have an active Premium plan ({daysRemaining} days left). Only pay the ₹2,000 tier difference!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Plan Toggles */}
                    <div className="space-y-3">
                      {[
                        { name: 'Premium', price: 3000, days: '60 Days', desc: 'Appears in priority lists, WhatsApp quick connect button.' },
                        { name: 'Elite', price: 5000, days: '90 Days', desc: 'Top sponsored horizontal slider, premium Elite badge.' }
                      ].map(opt => {
                        const isCurrent = currentPlan === opt.name;
                        return (
                          <div 
                            key={opt.name}
                            onClick={() => {
                              if (!isCurrent) {
                                setRenewPlanSelected(opt.name);
                              }
                            }}
                            className={`p-4 rounded-2xl border flex justify-between items-center gap-4 transition-all ${isCurrent ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' : (renewPlanSelected === opt.name ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-slate-200 hover:bg-slate-50 cursor-pointer')}`}
                          >
                            <div className="text-left">
                              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                {opt.name} Plan
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">{opt.days}</span>
                                {isCurrent && <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase">Current Active</span>}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal font-medium">{opt.desc}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-black text-slate-800">
                                {opt.name === 'Elite' && currentPlan === 'Premium' ? '₹2,000 Upgrade' : `₹${opt.price.toLocaleString()}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Invoice detail */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-3 font-semibold text-xs text-slate-600">
                      <h4 className="font-jakarta font-extrabold text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-2 mb-2">Order Summary</h4>
                      <div className="flex justify-between items-center">
                        <span>Base Cost</span>
                        <span className="font-bold text-slate-800">₹{basePrice.toLocaleString()}</span>
                      </div>
                      {isUpgrade && (
                        <div className="flex justify-between items-center text-amber-700">
                          <span>Premium Active Discount</span>
                          <span className="font-bold">-₹3,000</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span>Taxes (18% GST)</span>
                        <span className="font-bold text-slate-800">₹{taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-sm text-slate-900 font-black">
                        <span>Total Payable Amount</span>
                        <span className="text-primary font-black">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowRenewModal(false)}
                        className="flex-1 py-3.5 border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setRenewStep(2)}
                        className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        Proceed to Payment <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {renewStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <span className="px-3 py-1 bg-primary/15 text-primary text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-2">Secure Gateway</span>
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 leading-none">Select Payment Method</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Paying <span className="font-black text-slate-800">₹{totalAmount.toLocaleString()}</span> for {renewPlanSelected} upgrade</p>
                    </div>

                    {/* Horizontal chips for payment methods */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
                      {[
                        { id: 'Card', label: 'Cards', icon: 'credit_card' },
                        { id: 'UPI', label: 'UPI ID', icon: 'qr_code_2' },
                        { id: 'NetBanking', label: 'NetBank', icon: 'account_balance' },
                        { id: 'Wallet', label: 'Wallets', icon: 'wallet' },
                        { id: 'BankTransfer', label: 'Transfer', icon: 'payments' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setRenewPaymentMethod(method.id)}
                          className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 shrink-0 text-xs font-bold transition-all ${renewPaymentMethod === method.id ? 'bg-primary border-primary text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          <span className="material-symbols-outlined text-base">{method.icon}</span>
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab forms */}
                    <div className="min-h-[180px] bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                      
                      {renewPaymentMethod === 'Card' && (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Card Holder Name</label>
                            <input 
                              type="text" 
                              required 
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800" 
                              placeholder="e.g. Divyk Sharma"
                              value={cardHolder} 
                              onChange={e => setCardHolder(e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Credit/Debit Card Number</label>
                            <input 
                              type="text" 
                              required 
                              maxLength="19"
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800 tracking-wider" 
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber} 
                              onChange={e => {
                                // Add spaces every 4 digits
                                const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                setCardNumber(val);
                              }} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                              <input 
                                type="text" 
                                required 
                                maxLength="5"
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800 text-center" 
                                placeholder="MM/YY"
                                value={cardExpiry} 
                                onChange={e => {
                                  let val = e.target.value.replace(/\//g, '');
                                  if (val.length > 2) {
                                    val = val.substring(0, 2) + '/' + val.substring(2);
                                  }
                                  setCardExpiry(val);
                                }} 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">CVV Code</label>
                              <input 
                                type="password" 
                                required 
                                maxLength="3"
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800 text-center tracking-widest" 
                                placeholder="***"
                                value={cardCvv} 
                                onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} 
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {renewPaymentMethod === 'UPI' && (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Virtual Payment Address (UPI ID)</label>
                            <input 
                              type="text" 
                              required 
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800" 
                              placeholder="e.g. divyk@okaxis"
                              value={upiId} 
                              onChange={e => setUpiId(e.target.value)} 
                            />
                            <p className="text-[10px] text-slate-400 font-semibold mt-2">Provides support for BHIM UPI, PhonePe, Paytm, and Google Pay applications.</p>
                          </div>
                        </div>
                      )}

                      {renewPaymentMethod === 'NetBanking' && (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Select Indian Banking Partner</label>
                            <select 
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                              value={selectedBank}
                              onChange={e => setSelectedBank(e.target.value)}
                            >
                              <option value="sbi">State Bank of India</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Bank Account / Username Details</label>
                            <input 
                              type="text" 
                              required 
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-800" 
                              placeholder="e.g. 5020004875412"
                              value={bankAccount} 
                              onChange={e => setBankAccount(e.target.value.replace(/\D/g, ''))} 
                            />
                          </div>
                        </div>
                      )}

                      {renewPaymentMethod === 'Wallet' && (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Select Digital Wallet Provider</label>
                            <select 
                              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                              value={walletProvider}
                              onChange={e => setWalletProvider(e.target.value)}
                            >
                              <option value="paytm">Paytm Super Wallet</option>
                              <option value="phonepe">PhonePe Wallet</option>
                              <option value="amazon">Amazon Pay Wallet</option>
                            </select>
                            <p className="text-[10px] text-slate-400 font-semibold mt-2">Requires one-time OTP verification with the selected wallet provider.</p>
                          </div>
                        </div>
                      )}

                      {renewPaymentMethod === 'BankTransfer' && (
                        <div className="space-y-4 text-left">
                          <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-1.5 text-[11px] font-semibold text-slate-600">
                            <h5 className="font-extrabold text-[10px] text-slate-850 uppercase tracking-widest mb-1.5">Beneficiary Details</h5>
                            <div className="flex justify-between"><span>Bank Name</span><span className="text-slate-800 font-extrabold">HDFC Corporate Bank</span></div>
                            <div className="flex justify-between"><span>Account Name</span><span className="text-slate-800 font-extrabold">Pink City Property Ltd</span></div>
                            <div className="flex justify-between"><span>Account Number</span><span className="text-slate-800 font-extrabold">50200084512401</span></div>
                            <div className="flex justify-between"><span>IFSC Code</span><span className="text-slate-800 font-extrabold">HDFC0000123</span></div>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold leading-normal">Instructions: Complete a standard IMPS / NEFT / RTGS transfer and verify details instantly.</p>
                        </div>
                      )}

                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setRenewStep(1)}
                        className="flex-1 py-3.5 border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Invoice
                      </button>
                      <button 
                        onClick={startPaymentSimulation}
                        className="flex-1 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">lock</span> Pay ₹{totalAmount.toLocaleString()}
                      </button>
                    </div>
                  </div>
                )}

                {renewStep === 3 && (
                  <div className="text-center py-10 flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="var(--primary)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * paymentProgress) / 100} strokeLinecap="round" className="transition-all duration-100" />
                      </svg>
                      <span className="font-extrabold text-slate-800 text-base">{paymentProgress}%</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-jakarta font-extrabold text-xl text-slate-900">Authorizing Secure Transaction</h3>
                      <p className="text-slate-500 text-xs font-semibold animate-pulse">
                        {paymentProgress < 40 && 'Contacting secure bank gateway...'}
                        {paymentProgress >= 40 && paymentProgress < 80 && 'Validating credential signatures...'}
                        {paymentProgress >= 80 && 'Enrolling active listing tokens...'}
                      </p>
                    </div>
                  </div>
                )}

                {renewStep === 4 && (
                  <div className="text-center py-10 flex flex-col items-center justify-center space-y-5">
                    <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-500 shadow-md animate-bounce">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 leading-none">Upgrade Approved!</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Transaction: TXN_{Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xs leading-normal font-semibold">
                      Your property listing <span className="font-bold text-slate-800">"{targetProperty?.title}"</span> has been successfully upgraded to <span className="text-primary font-bold">{renewPlanSelected}</span>!
                    </p>
                  </div>
                )}

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <p className="text-xl animate-pulse font-bold text-slate-500">Loading your secure dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
