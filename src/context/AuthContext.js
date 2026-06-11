'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loans, setLoans] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [toast, setToast] = useState(null); // Global toast notification state
  const router = useRouter();

  // Clear toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Load user, favorites, notifications, leads, and loans on mount
  useEffect(() => {
    // 1. User
    const storedUser = localStorage.getItem('pcp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Favorites
    const storedFavs = localStorage.getItem('pcp_favorites');
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch (e) { /* ignore */ }
    }

    // 3. Notifications (Prepopulate if empty)
    const storedNotifs = localStorage.getItem('pcp_notifications');
    if (storedNotifs) {
      try { setNotifications(JSON.parse(storedNotifs)); } catch (e) { /* ignore */ }
    } else {
      const defaultNotifs = [
        { id: 1, title: 'Welcome to Pink City Properties', message: 'Explore Jaipur\'s most premium residential, commercial, and investment listings with certified titles.', date: new Date(Date.now() - 3600000 * 2).toISOString(), read: false, type: 'welcome' },
        { id: 2, title: 'SBI Loan Under Review', message: 'Your home loan application request to SBI Bank has been successfully verified and is now Under Review.', date: new Date(Date.now() - 3600000 * 24).toISOString(), read: false, type: 'loan' },
        { id: 3, title: 'Listing Plan Premium Active', message: 'Your subscription plan for Ametis Residences has been activated successfully. 60 days of high priority placement remaining.', date: new Date(Date.now() - 3600000 * 48).toISOString(), read: true, type: 'subscription' }
      ];
      localStorage.setItem('pcp_notifications', JSON.stringify(defaultNotifs));
      setNotifications(defaultNotifs);
    }

    // 4. Contact Leads (Prepopulate if empty)
    const storedLeads = localStorage.getItem('pcp_leads');
    if (storedLeads) {
      try { setLeads(JSON.parse(storedLeads)); } catch (e) { /* ignore */ }
    } else {
      const defaultLeads = [
        { id: 1, buyerName: 'Rahul Sharma', buyerEmail: 'rahul.sharma@gmail.com', buyerPhone: '+91 98765 43210', propertyId: 1, propertyTitle: 'The Opal Heights', sellerEmail: 'guest@example.com', time: new Date(Date.now() - 3600000 * 5).toISOString(), status: 'Pending', message: 'I am interested in scheduling a home tour this Saturday. Please call me back.' },
        { id: 2, buyerName: 'Neha Patel', buyerEmail: 'neha.patel@yahoo.com', buyerPhone: '+91 91234 56789', propertyId: 2, propertyTitle: 'Ametis Residences', sellerEmail: 'guest@example.com', time: new Date(Date.now() - 3600000 * 26).toISOString(), status: 'Contacted', message: 'Is the price negotiable? I would like to review the registry paperwork.' }
      ];
      localStorage.setItem('pcp_leads', JSON.stringify(defaultLeads));
      setLeads(defaultLeads);
    }

    // 5. Loan Applications (Prepopulate if empty)
    const storedLoans = localStorage.getItem('pcp_loans');
    if (storedLoans) {
      try { setLoans(JSON.parse(storedLoans)); } catch (e) { /* ignore */ }
    } else {
      const defaultLoans = [
        { id: 1, bankId: 'sbi', bankName: 'State Bank of India', employment: 'Salaried', income: '150000', emis: '15000', status: 'Under Review', date: new Date(Date.now() - 3600000 * 24).toISOString() }
      ];
      localStorage.setItem('pcp_loans', JSON.stringify(defaultLoans));
      setLoans(defaultLoans);
    }

    // 6. Recently Viewed
    const storedRecent = localStorage.getItem('pcp_recently_viewed');
    if (storedRecent) {
      try { setRecentlyViewed(JSON.parse(storedRecent)); } catch (e) { /* ignore */ }
    }

    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    if (!email || !password) return false;
    const role = email.toLowerCase().includes('admin') ? 'Admin' : 'Seller'; // Default to Seller to let them access dashboard tools easily
    const userData = { 
      email, 
      name: email.split('@')[0], 
      loggedIn: true, 
      provider: 'email', 
      role,
      phone: '+91 99999 88888',
      address: 'Vaishali Nagar, Jaipur',
      age: 32,
      avatarUrl: null,
      lastProfileUpdate: null
    };
    localStorage.setItem('pcp_user', JSON.stringify(userData));
    // Set first time login tracker
    localStorage.setItem('pcp_welcome_popup_shown', 'false');
    setUser(userData);
    showToast('Logged in successfully!', 'success');
    return true;
  }, [showToast]);

  const signup = useCallback((name, email, password) => {
    if (!name || !email || !password) return false;
    const role = email.toLowerCase().includes('admin') ? 'Admin' : 'Seller';
    const userData = { 
      email, 
      name, 
      loggedIn: true, 
      provider: 'email', 
      role,
      phone: '+91 99999 88888',
      address: 'Vaishali Nagar, Jaipur',
      age: 32,
      avatarUrl: null,
      lastProfileUpdate: null
    };
    localStorage.setItem('pcp_user', JSON.stringify(userData));
    // Set first time login tracker
    localStorage.setItem('pcp_welcome_popup_shown', 'false');
    setUser(userData);
    showToast('Account registered successfully!', 'success');
    return true;
  }, [showToast]);

  const loginWithGoogle = useCallback(() => {
    const userData = { 
      email: 'guest@example.com', 
      name: 'Jaipur Guest', 
      loggedIn: true, 
      provider: 'google', 
      avatar: 'G', 
      role: 'Seller',
      phone: '+91 98888 77777',
      address: 'C-Scheme, Jaipur',
      age: 28,
      avatarUrl: null,
      lastProfileUpdate: null
    };
    localStorage.setItem('pcp_user', JSON.stringify(userData));
    // Set first time login tracker
    localStorage.setItem('pcp_welcome_popup_shown', 'false');
    setUser(userData);
    showToast('Welcome, connected with Google!', 'success');
    return true;
  }, [showToast]);

  const loginWithApple = useCallback(() => {
    const userData = { 
      email: 'apple_buyer@icloud.com', 
      name: 'Premium Apple User', 
      loggedIn: true, 
      provider: 'apple', 
      avatar: 'A', 
      role: 'Buyer',
      phone: '+91 90000 11111',
      address: 'Civil Lines, Jaipur',
      age: 35,
      avatarUrl: null,
      lastProfileUpdate: null
    };
    localStorage.setItem('pcp_user', JSON.stringify(userData));
    // Set first time login tracker
    localStorage.setItem('pcp_welcome_popup_shown', 'false');
    setUser(userData);
    showToast('Welcome, connected with Apple!', 'success');
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    localStorage.removeItem('pcp_user');
    localStorage.removeItem('pcp_welcome_popup_shown');
    setUser(null);
    showToast('Successfully logged out.', 'info');
  }, [showToast]);

  // Update Profile with 30-Day limit enforcement
  const updateProfile = useCallback((name, role, phone, address, age, avatarUrl, skipLockCheck = false) => {
    if (!user) return { success: false, message: 'Not logged in' };

    const now = Date.now();
    const lockDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    if (!skipLockCheck && user.lastProfileUpdate) {
      const timePassed = now - user.lastProfileUpdate;
      if (timePassed < lockDuration) {
        const remainingTime = lockDuration - timePassed;
        const days = Math.floor(remainingTime / (24 * 3600000));
        const hours = Math.floor((remainingTime % (24 * 3600000)) / 3600000);
        return { 
          success: false, 
          message: `Profile locked! You can modify details again in ${days} days, ${hours} hours.`, 
          remainingDays: days, 
          remainingHours: hours 
        };
      }
    }

    const updated = { 
      ...user, 
      name, 
      role, 
      phone: phone || user.phone,
      address: address || user.address,
      age: age || user.age,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
      lastProfileUpdate: skipLockCheck ? user.lastProfileUpdate : now
    };

    localStorage.setItem('pcp_user', JSON.stringify(updated));
    setUser(updated);
    showToast('Profile credentials saved!', 'success');
    return { success: true, message: 'Profile updated successfully!' };
  }, [user, showToast]);

  // Notifications Management
  const addNotification = useCallback((title, message, type = 'general') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('pcp_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('pcp_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('pcp_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('pcp_notifications', JSON.stringify([]));
  }, []);

  // Leads Inquiry Management
  const addLead = useCallback((buyerName, buyerEmail, buyerPhone, propertyId, propertyTitle, sellerEmail, message) => {
    const newLead = {
      id: Date.now(),
      buyerName,
      buyerEmail,
      buyerPhone,
      propertyId,
      propertyTitle,
      sellerEmail: sellerEmail || 'guest@example.com',
      time: new Date().toISOString(),
      status: 'Pending',
      message
    };
    
    setLeads(prev => {
      const updated = [newLead, ...prev];
      localStorage.setItem('pcp_leads', JSON.stringify(updated));
      return updated;
    });

    // Notify the Seller
    addNotification(
      'New Lead Inquiry!',
      `${buyerName} has requested information about your property "${propertyTitle}". View contact info in Leads Dashboard.`,
      'lead'
    );

    // Trigger visual toast confirmation
    showToast(`Inquiry request sent to agent!`, 'success');
  }, [addNotification, showToast]);

  const updateLeadStatus = useCallback((leadId, status) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, status } : l);
      localStorage.setItem('pcp_leads', JSON.stringify(updated));
      return updated;
    });
    
    // Notify the Buyer/Seller depending on who does what
    addNotification(
      'Lead Status Updated',
      `Lead inquiry status has been changed to "${status}".`,
      'lead'
    );
    showToast(`Lead inquiry status set to "${status}"`, 'info');
  }, [addNotification, showToast]);

  // Home Loan Management - REST API INTEGRATION
  const addLoanApplication = useCallback(async (bankId, bankName, employment, income, emis, amount) => {
    try {
      const res = await fetch('/api/loan-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankId, bankName, employment, income, emis, amount })
      });
      const resData = await res.json();
      
      if (resData.success) {
        const newLoan = resData.loan;
        setLoans(prev => {
          const updated = [newLoan, ...prev];
          localStorage.setItem('pcp_loans', JSON.stringify(updated));
          return updated;
        });

        addNotification(
          'Loan Application Submitted',
          `Your loan application with ${bankName} has been successfully submitted and is under initial pending screening.`,
          'loan'
        );

        showToast(`Loan application submitted to ${bankName}!`, 'success');
      } else {
        showToast(resData.message || 'Error applying for home loan.', 'error');
      }
    } catch (error) {
      console.error('Failed calling loans API:', error);
      // Resilient fallback logic in case of compile/port connection issues during build stage
      const fallbackLoan = {
        id: Date.now(),
        requestId: `REQ${Math.floor(100000 + Math.random() * 900000)}`,
        bankId,
        bankName,
        employment,
        income,
        emis,
        amount: amount || '2500000',
        status: 'Pending',
        date: new Date().toISOString()
      };
      setLoans(prev => {
        const updated = [fallbackLoan, ...prev];
        localStorage.setItem('pcp_loans', JSON.stringify(updated));
        return updated;
      });
      addNotification(
        'Loan Application Submitted (Offline)',
        `Your loan application with ${bankName} has been successfully recorded under offline mode.`,
        'loan'
      );
      showToast(`Loan application recorded!`, 'success');
    }
  }, [addNotification, showToast]);

  const updateLoanStatus = useCallback((loanId, status) => {
    setLoans(prev => {
      const updated = prev.map(l => l.id === loanId ? { ...l, status } : l);
      localStorage.setItem('pcp_loans', JSON.stringify(updated));
      
      const targetLoan = prev.find(l => l.id === loanId);
      if (targetLoan) {
        addNotification(
          'Loan Status Updated',
          `Your home loan application status with ${targetLoan.bankName} is now "${status}".`,
          'loan'
        );
        showToast(`Loan status updated: ${status}`, 'info');
      }
      return updated;
    });
  }, [addNotification, showToast]);

  // Recently Viewed Properties
  const addToRecentlyViewed = useCallback((propertyId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== propertyId);
      const updated = [propertyId, ...filtered].slice(0, 5); // limit to last 5
      localStorage.setItem('pcp_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Favorites management
  const toggleFavorite = useCallback((propertyId) => {
    let updated;
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        updated = prev.filter(id => id !== propertyId);
        showToast('Removed from favorites.', 'info');
      } else {
        updated = [...prev, propertyId];
        showToast('Added to favorites!', 'success');
      }
      localStorage.setItem('pcp_favorites', JSON.stringify(updated));
      return updated;
    });
  }, [showToast]);

  const isFavorite = useCallback((propertyId) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const setRedirectPath = useCallback((path) => {
    setRedirectAfterLogin(path);
    localStorage.setItem('pcp_redirect', path);
  }, []);

  const getRedirectPath = useCallback(() => {
    const path = redirectAfterLogin || localStorage.getItem('pcp_redirect');
    setRedirectAfterLogin(null);
    localStorage.removeItem('pcp_redirect');
    return path || '/';
  }, [redirectAfterLogin]);

  const requireAuth = useCallback((currentPath) => {
    if (user) return true;
    setRedirectPath(currentPath);
    router.push('/login');
    return false;
  }, [user, setRedirectPath, router]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout, loading, updateProfile,
      loginWithGoogle, loginWithApple,
      favorites, toggleFavorite, isFavorite,
      requireAuth, setRedirectPath, getRedirectPath,
      notifications, unreadNotificationsCount, addNotification, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications,
      leads, addLead, updateLeadStatus,
      loans, addLoanApplication, updateLoanStatus,
      recentlyViewed, addToRecentlyViewed,
      toast, showToast, clearToast // Exposing global glass toast hooks
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

