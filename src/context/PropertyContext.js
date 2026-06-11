'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { properties as baseMockProperties } from '@/data';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and check plan expirations
  useEffect(() => {
    // Helper to augment base mock properties with proper ownership and subscription plans
    const augmentMocks = () => {
      return baseMockProperties.map((p, idx) => {
        // Distribute plans to mock data
        if (p.id === 1) {
          // Elite Plan (Active - started 2 days ago)
          const start = new Date(Date.now() - 3600000 * 48);
          const expiry = new Date(start.getTime() + 90 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com', // Guest logged-in user owns this
            plan: 'Elite',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Elite Verified'
          };
        } else if (p.id === 2) {
          // Premium Plan (Active - started 5 days ago)
          const start = new Date(Date.now() - 3600000 * 120);
          const expiry = new Date(start.getTime() + 60 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com',
            plan: 'Premium',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Premium'
          };
        } else if (p.id === 3) {
          // Elite Plan - Active (started 10 days ago)
          const start = new Date(Date.now() - 10 * 24 * 3600000);
          const expiry = new Date(start.getTime() + 90 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com',
            plan: 'Elite',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Elite Verified'
          };
        } else if (p.id === 4) {
          // Premium Plan - Active (started 8 days ago)
          const start = new Date(Date.now() - 8 * 24 * 3600000);
          const expiry = new Date(start.getTime() + 60 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'agent@example.com',
            plan: 'Premium',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Premium'
          };
        } else if (p.id === 5) {
          // Premium Plan - Active (started 12 days ago)
          const start = new Date(Date.now() - 12 * 24 * 3600000);
          const expiry = new Date(start.getTime() + 60 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'builder@example.com',
            plan: 'Premium',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Premium'
          };
        } else if (p.id === 6) {
          // Premium Plan (Expired - started 62 days ago, should show "Plan Expired" but remain active/visible)
          const start = new Date(Date.now() - 62 * 24 * 3600000);
          const expiry = new Date(start.getTime() + 60 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com',
            plan: 'Premium',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'expired',
            badge: 'Plan Expired'
          };
        } else if (p.id === 7) {
          // Premium Plan - Active (started 1 day ago)
          const start = new Date(Date.now() - 24 * 3600000);
          const expiry = new Date(start.getTime() + 60 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com',
            plan: 'Premium',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Premium'
          };
        } else if (p.id === 8) {
          // Elite Plan - Active (started 4 days ago)
          const start = new Date(Date.now() - 4 * 24 * 3600000);
          const expiry = new Date(start.getTime() + 90 * 24 * 3600000);
          return {
            ...p,
            ownerEmail: 'guest@example.com',
            plan: 'Elite',
            planStartDate: start.toISOString(),
            planExpiryDate: expiry.toISOString(),
            planStatus: 'active',
            badge: 'Elite Verified'
          };
        }
        // Others are Free Plan
        return {
          ...p,
          ownerEmail: idx % 2 === 0 ? 'agent@example.com' : 'builder@example.com',
          plan: 'Free',
          planStartDate: new Date(Date.now() - 3600000 * 240).toISOString(),
          planExpiryDate: new Date(Date.now() + 3600000 * 2400).toISOString(),
          planStatus: 'active'
        };
      });
    };

    const checkExpirations = (list) => {
      const now = Date.now();
      return list.map(p => {
        if (!p.plan || p.plan === 'Free') return p;
        const expiryTime = new Date(p.planExpiryDate).getTime();
        if (now > expiryTime && p.planStatus === 'active') {
          return {
            ...p,
            planStatus: 'expired',
            badge: 'Plan Expired'
          };
        }
        return p;
      });
    };

    const stored = localStorage.getItem('pcp_properties');
    let loadedProps = augmentMocks();
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          loadedProps = [...parsed, ...loadedProps];
        }
      } catch (e) {
        console.error('Failed to parse pcp_properties:', e);
      }
    }

    const processedProps = checkExpirations(loadedProps).map(p => ({
      ...p,
      listingType: p.listingType || ([2, 4, 6].includes(p.id) ? 'Rent' : 'Sell')
    }));
    setProperties(processedProps);
    setLoading(false);
  }, []);

  const addProperty = (newProperty, ownerEmail) => {
    const owner = ownerEmail || 'guest@example.com';
    const planType = newProperty.plan || 'Free';
    
    // Enforce Plan Rules: Free Plan maximum 2 active properties
    if (planType === 'Free') {
      const activeFreeCount = properties.filter(
        p => p.ownerEmail === owner && p.plan === 'Free' && p.planStatus === 'active'
      ).length;
      
      if (activeFreeCount >= 2) {
        return {
          success: false,
          message: 'Free Plan listing limit reached! You can list a maximum of 2 properties on the Free Plan. Please upgrade to Premium or Elite for unlimited listings.'
        };
      }
    }

    // Calculate dates
    const start = new Date();
    let durationDays = 3650; // Free plan has long expiry
    if (planType === 'Premium') durationDays = 60;
    if (planType === 'Elite') durationDays = 90;
    
    const expiry = new Date(start.getTime() + durationDays * 24 * 3600000);

    const id = Date.now();
    const propertyWithId = { 
      ...newProperty, 
      id, 
      ownerEmail: owner,
      priceDisplay: newProperty.priceDisplay || `₹${(newProperty.price / 10000000).toFixed(1)} Cr`, 
      premium: planType === 'Premium' || planType === 'Elite', // Show in featured if Premium or Elite
      badge: planType === 'Elite' ? 'Elite Verified' : (planType === 'Premium' ? 'Premium' : 'Verified'),
      plan: planType,
      planStartDate: start.toISOString(),
      planExpiryDate: expiry.toISOString(),
      planStatus: 'active',
      listingType: newProperty.listingType || 'Sell',
      images: newProperty.images && newProperty.images.length > 0 ? newProperty.images : ['https://lh3.googleusercontent.com/aida-public/AB6AXuAE_lcSXfDZewbJkq5VVC2syk_9KFoyoKevQJXV3RILpahf_Lfqinvv4m8kLRkdWhbJzVrmoqwMGtPXwffeko6HdwcNrtABs2rP4y6LYeFmVtZ_ShjYALQH9RkuQZzQLCNaogRxS69ZpaSHLtWFq2n9ctp3W2adxdH0K3ExyjSa2KFbyad8wA49WG3Ba5SlcIk19JQ-IA42REY0rEmPb6RWYV4jSDctJVHqo3vLpBBoXG-8xsKS_k_V0Fe4c6u2FWxPnW9jZAQsEUo'] 
    };
    
    // Save to local storage pcp_properties
    const stored = localStorage.getItem('pcp_properties');
    let savedProps = [];
    if (stored) {
      try { 
        const parsed = JSON.parse(stored); 
        if (Array.isArray(parsed)) {
          savedProps = parsed;
        }
      } catch (e) { /* ignore */ }
    }
    savedProps.unshift(propertyWithId);
    try {
      localStorage.setItem('pcp_properties', JSON.stringify(savedProps));
    } catch (e) {
      console.error('Failed to save to localStorage due to quota limits:', e);
      alert('Local device storage limit exceeded. The property has been added to your current session, but older properties could not be saved to your device. Try removing some old properties.');
    }
    
    // Update state
    setProperties([propertyWithId, ...properties]);
    return { success: true, property: propertyWithId };
  };

  const deleteProperty = (id) => {
    // 1. Remove from localStorage pcp_properties
    const stored = localStorage.getItem('pcp_properties');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(p => p.id !== id);
          localStorage.setItem('pcp_properties', JSON.stringify(filtered));
        }
      } catch (e) { /* ignore */ }
    }
    // 2. Remove from active state
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const renewPropertyPlan = (id, newPlan) => {
    const start = new Date();
    let durationDays = 3650;
    if (newPlan === 'Premium') durationDays = 60;
    if (newPlan === 'Elite') durationDays = 90;
    
    const expiry = new Date(start.getTime() + durationDays * 24 * 3600000);

    const updatePlan = (list) => list.map(p => {
      if (p.id === id) {
        return {
          ...p,
          plan: newPlan,
          planStartDate: start.toISOString(),
          planExpiryDate: expiry.toISOString(),
          planStatus: 'active',
          premium: newPlan === 'Premium' || newPlan === 'Elite',
          badge: newPlan === 'Elite' ? 'Elite Verified' : (newPlan === 'Premium' ? 'Premium' : 'Verified')
        };
      }
      return p;
    });

    // 1. Update localStorage
    const stored = localStorage.getItem('pcp_properties');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localStorage.setItem('pcp_properties', JSON.stringify(updatePlan(parsed)));
        }
      } catch (e) { /* ignore */ }
    }

    // 2. Update state
    setProperties(prev => updatePlan(prev));
  };

  const toggleVerifyProperty = (id) => {
    const toggleBadge = (list) => list.map(p => {
      if (p.id === id) {
        return { ...p, badge: p.badge === 'Verified' ? null : 'Verified' };
      }
      return p;
    });

    const stored = localStorage.getItem('pcp_properties');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localStorage.setItem('pcp_properties', JSON.stringify(toggleBadge(parsed)));
        }
      } catch (e) { /* ignore */ }
    }

    setProperties(prev => toggleBadge(prev));
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      addProperty, 
      deleteProperty, 
      renewPropertyPlan, 
      toggleVerifyProperty, 
      loading 
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);

