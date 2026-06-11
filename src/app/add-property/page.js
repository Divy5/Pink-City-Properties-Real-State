'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/context/PropertyContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AddPropertyPage() {
  const { requireAuth, user, updateProfile, addNotification } = useAuth();
  const { addProperty } = useProperties();
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState(1); // 1: Details & Images, 2: Subscription Plan Selector
  const [form, setForm] = useState({
    title: '', price: '', location: '', description: '',
    bhk: '', bathrooms: '', area: '', type: 'Apartment',
    parking: '', furnishing: 'Unfurnished', contactNumber: '', listedBy: 'Owner',
    listingType: 'Sell'
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [errorLimitMessage, setErrorLimitMessage] = useState(null);

  // Simulated Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Method select, 2: Loading progress, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, Card, Net Banking, Wallet
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Authenticate user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      requireAuth(pathname);
    }
  }, [requireAuth, pathname]);

  const handleUpgradeToSeller = () => {
    if (user) {
      updateProfile(user.name, 'Seller', user.phone, user.address, user.age, user.avatarUrl, true);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const processFiles = async (files) => {
    if (images.length + files.length > 7) {
      alert('You can upload a maximum of 7 images.');
      return;
    }

    const base64Promises = files.map(file => fileToBase64(file));
    try {
      const base64Results = await Promise.all(base64Promises);
      const compressedResults = await Promise.all(base64Results.map(base64 => compressImage(base64)));
      setImages(prev => [...prev, ...compressedResults]);
      setImagePreviews(prev => [...prev, ...compressedResults]);
    } catch (err) {
      console.error('Failed to convert files to base64:', err);
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    setImages(prev => {
      const updated = [...prev];
      [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
      return updated;
    });

    setImagePreviews(prev => {
      const updated = [...prev];
      [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    await processFiles(files);
  };

  const goToPlanSelection = (e) => {
    e.preventDefault();
    if (!requireAuth(pathname)) return;

    // Check Buyer role lock
    if (user?.role === 'Buyer') {
      return;
    }

    // Basic Validation
    if (!form.title || !form.price || !form.location || !form.description || !form.area || !form.contactNumber) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one property image to represent your listing.');
      return;
    }

    setStep(2);
  };

  const handlePublish = async () => {
    if (!requireAuth(pathname)) return;
    setIsUploading(true);

    const propertyData = {
      ...form,
      price: Number(form.price),
      bhk: form.bhk ? Number(form.bhk) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      images: images,
      plan: selectedPlan
    };

    // Call addProperty
    const result = addProperty(propertyData, user?.email);

    if (result.success === false) {
      setErrorLimitMessage(result.message);
      setIsUploading(false);
      return;
    }

    // Notify user
    addNotification(
      'Property Published successfully!',
      `Your listing "${form.title}" is now active under the ${selectedPlan} plan.`,
      'subscription'
    );

    setSubmitted(true);
    setIsUploading(false);

    setTimeout(() => {
      router.push('/dashboard?tab=listings');
    }, 2500);
  };

  const handleSubmitClick = () => {
    if (selectedPlan === 'Free') {
      handlePublish();
    } else {
      setPaymentStep(1);
      setPaymentProgress(0);
      setShowPaymentModal(true);
    }
  };

  const startPaymentSimulation = () => {
    setPaymentStep(2);
    setPaymentProgress(0);
    
    const interval = setInterval(() => {
      setPaymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPaymentStep(3);
          
          setTimeout(() => {
            setShowPaymentModal(false);
            handlePublish();
          }, 1800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Auth Wall for Buyer Accounts
  if (user && user.role === 'Buyer') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-20 relative overflow-hidden bg-slate-50/50">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="w-full max-w-lg bg-white rounded-[32px] p-8 md:p-10 border border-slate-200 shadow-2xl text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 mb-6 text-amber-600">
            <span className="material-symbols-outlined text-4xl">gavel</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-3xl mb-3 text-slate-900">Seller Privileges Required</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your account is currently registered as a <span className="font-bold text-primary">Buyer</span>. 
            Only <span className="font-semibold text-slate-800">Sellers, Agents, and Builders</span> are authorized to list property advertisements on this platform.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleUpgradeToSeller}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">upgrade</span> Upgrade to Seller &amp; Continue
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-screen-md mx-auto px-6 py-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-lg">
            <span className="material-symbols-outlined text-5xl">check_circle</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl mb-4 text-slate-900">Property Published!</h1>
          <p className="text-slate-600 text-lg max-w-md mx-auto mb-2">Your property has been successfully listed under the <span className="font-bold text-primary">{selectedPlan} plan</span>.</p>
          <p className="text-sm text-slate-400">Redirecting to your listings dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-10">
      <div className="max-w-screen-lg mx-auto">
        
        {/* Navigation Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${step === 1 ? 'bg-primary text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span> Fill Details
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${step === 2 ? 'bg-primary text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span> Choose Seller Plan
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8">
                <h1 className="font-jakarta font-extrabold text-4xl mb-2 text-slate-900">Post Property Listing</h1>
                <p className="text-slate-500 font-medium">Represent your property with precise configurations and high-resolution visuals.</p>
              </div>

              <form onSubmit={goToPlanSelection} className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-200/60 shadow-xl space-y-8">
                
                {/* Basic Info */}
                <div>
                  <h3 className="font-jakarta font-extrabold text-lg mb-5 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">description</span> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Property Title *</label>
                      <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. Ultra Luxury Penthouse in Vaishali Nagar" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹) *</label>
                      <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. 45000000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Location / Locality *</label>
                      <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. C-Scheme, Jaipur" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Penthouse</option>
                        <option>Commercial</option>
                        <option>Plot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Listing Purpose *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value })}>
                        <option value="Sell">Sell (For Buy)</option>
                        <option value="Rent">Rent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Configuration */}
                <div>
                  <h3 className="font-jakarta font-extrabold text-lg mb-5 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">settings</span> Configuration &amp; Layout
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">BHK</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. 4" value={form.bhk} onChange={e => setForm({ ...form, bhk: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. 4" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Super Area *</label>
                      <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. 3,800 sqft" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Furnishing</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" value={form.furnishing} onChange={e => setForm({ ...form, furnishing: e.target.value })}>
                        <option>Fully Furnished</option>
                        <option>Semi-Furnished</option>
                        <option>Unfurnished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Parking</label>
                      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. 2 Covered Cars" value={form.parking} onChange={e => setForm({ ...form, parking: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Owner details */}
                <div>
                  <h3 className="font-jakarta font-extrabold text-lg mb-5 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">contact_mail</span> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Listed By</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" value={form.listedBy} onChange={e => setForm({ ...form, listedBy: e.target.value })}>
                        <option>Owner</option>
                        <option>Agent</option>
                        <option>Builder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number *</label>
                      <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-semibold text-slate-800" placeholder="e.g. +91 98765 43210" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Property Description *</label>
                    <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none min-h-[120px] resize-none transition-all font-medium text-slate-800" placeholder="Describe the layout, ventilation, spacing, registry paperwork, and specific benefits..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>

                {/* Advanced Image Upload */}
                <div>
                  <h3 className="font-jakarta font-extrabold text-lg mb-5 text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">image</span> Property Images Manager (Up to 7)
                  </h3>
                  
                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full py-12 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'}`}
                    onClick={() => document.getElementById('property-image-input').click()}
                  >
                    <span className="material-symbols-outlined text-5xl text-slate-400 mb-3 animate-pulse">cloud_upload</span>
                    <h4 className="font-jakarta font-extrabold text-slate-800 text-sm mb-1">Drag &amp; drop photos here</h4>
                    <p className="text-xs text-slate-500 font-medium">Or click to select files from device storage</p>
                    <input 
                      id="property-image-input" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </div>

                  {/* Previews & Reordering Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group shadow-sm flex flex-col justify-end bg-slate-900">
                          <img src={src} className="w-full h-full object-cover absolute inset-0 z-0 opacity-90 group-hover:scale-105 transition-transform duration-300" alt={`Property photo ${i + 1}`} />
                          
                          {/* Top Controls Overlay */}
                          <div className="absolute top-2 right-2 z-10">
                            <button 
                              type="button"
                              onClick={() => removeImage(i)}
                              className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 active:scale-90 transition-all"
                              title="Delete Photo"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>

                          {/* Reordering Controls Overlay */}
                          <div className="absolute inset-x-2 bottom-2 z-10 flex justify-between bg-black/45 backdrop-blur-md rounded-lg py-1 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => moveImage(i, -1)}
                              className="text-white hover:text-blue-300 disabled:opacity-30 disabled:hover:text-white"
                            >
                              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <span className="text-[10px] text-white font-extrabold flex items-center">
                              Order {i + 1}
                            </span>
                            <button
                              type="button"
                              disabled={i === imagePreviews.length - 1}
                              onClick={() => moveImage(i, 1)}
                              className="text-white hover:text-blue-300 disabled:opacity-30 disabled:hover:text-white"
                            >
                              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 text-right">
                  <button type="submit" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-extrabold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 ml-auto">
                    Proceed to Listing Plan <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h1 className="font-jakarta font-extrabold text-4xl mb-2 text-slate-900">Select Seller Listing Plan</h1>
                <p className="text-slate-500 font-medium">Choose a subscription tier to match your advertisement budget and exposure target.</p>
              </div>

              {/* Free Limit Warning */}
              {errorLimitMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 text-red-800 border border-red-200 rounded-[24px] font-semibold text-sm flex items-start gap-3 mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-red-600 text-2xl shrink-0 mt-0.5">warning</span>
                  <div>
                    <h4 className="font-jakarta font-extrabold text-sm mb-1">Listing Limit Restricted</h4>
                    <p className="text-xs text-red-700 leading-normal">{errorLimitMessage}</p>
                  </div>
                </motion.div>
              )}

              {/* Three Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Plan 1: Free */}
                <div 
                  onClick={() => setSelectedPlan('Free')}
                  className={`bg-white rounded-[32px] border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden h-full shadow-sm hover:shadow-lg ${selectedPlan === 'Free' ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50/20' : 'border-slate-200'}`}
                >
                  <div>
                    <h3 className="font-jakarta font-extrabold text-slate-900 text-xl mb-1 flex items-center justify-between">
                      Free Plan
                      {selectedPlan === 'Free' && <span className="material-symbols-outlined text-2xl text-slate-900">check_circle</span>}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Standard Listing</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-black text-slate-900">₹0</span>
                      <span className="text-slate-500 text-xs font-bold">Free</span>
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-6" />

                    <ul className="space-y-4 text-xs font-semibold text-slate-600">
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        Max 2 properties total
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        Low priority placement
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        Visible in standard listings only
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal text-slate-400">
                        <span className="material-symbols-outlined text-slate-300 text-[18px]">cancel</span>
                        No premium homepage placement
                      </li>
                    </ul>
                  </div>
                  
                  <button type="button" className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${selectedPlan === 'Free' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                    {selectedPlan === 'Free' ? 'Selected' : 'Select Plan'}
                  </button>
                </div>

                 {/* Plan 2: Premium */}
                <div 
                  onClick={() => setSelectedPlan('Premium')}
                  className={`bg-white rounded-[32px] border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden h-full shadow-sm hover:shadow-lg ${selectedPlan === 'Premium' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-slate-200'}`}
                >
                  <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">
                    Best Value
                  </div>
                  <div>
                    <h3 className="font-jakarta font-extrabold text-slate-900 text-xl mb-1 flex items-center justify-between">
                      Premium Plan
                      {selectedPlan === 'Premium' && <span className="material-symbols-outlined text-2xl text-primary">check_circle</span>}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Boost Visibility</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-black text-slate-900">₹3,000</span>
                      <span className="text-slate-500 text-xs font-bold">/ 60 Days</span>
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-6" />

                    <ul className="space-y-4 text-xs font-semibold text-slate-600">
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        Medium traffic boost
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        Priority listing placement
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        Appears in recommended tab
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        WhatsApp quick connect button
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal text-slate-400">
                        <span className="material-symbols-outlined text-slate-300 text-[18px]">cancel</span>
                        Renewal required after 60 days
                      </li>
                    </ul>
                  </div>
                  
                  <button type="button" className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${selectedPlan === 'Premium' ? 'bg-primary text-white font-extrabold' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                    {selectedPlan === 'Premium' ? 'Selected' : 'Select Plan'}
                  </button>
                </div>

                {/* Plan 3: Elite */}
                <div 
                  onClick={() => setSelectedPlan('Elite')}
                  className={`bg-white rounded-[32px] border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden h-full shadow-sm hover:shadow-lg ${selectedPlan === 'Elite' ? 'border-warning ring-2 ring-warning bg-warning/5' : 'border-slate-200'}`}
                >
                  <div className="absolute top-0 right-0 bg-warning text-white text-[9px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">
                    Maximum Exposure
                  </div>
                  <div>
                    <h3 className="font-jakarta font-extrabold text-slate-900 text-xl mb-1 flex items-center justify-between">
                      Elite Plan
                      {selectedPlan === 'Elite' && <span className="material-symbols-outlined text-2xl text-warning">check_circle</span>}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Top Placed Ad</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-black text-slate-900">₹5,000</span>
                      <span className="text-slate-500 text-xs font-bold">/ 90 Days</span>
                    </div>
 
                    <div className="w-full h-px bg-slate-100 mb-6" />
 
                    <ul className="space-y-4 text-xs font-semibold text-slate-600">
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-warning text-[18px]">check_circle</span>
                        Maximum traffic exposure (top slider)
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-warning text-[18px]">check_circle</span>
                        Premium verified seller badge
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-warning text-[18px]">check_circle</span>
                        Appears above standard properties
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-warning text-[18px]">check_circle</span>
                        Full property analytics report access
                      </li>
                      <li className="flex items-start gap-2.5 leading-normal">
                        <span className="material-symbols-outlined text-warning text-[18px]">check_circle</span>
                        Priority customer support
                      </li>
                    </ul>
                  </div>
                  
                  <button type="button" className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${selectedPlan === 'Elite' ? 'bg-warning text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                    {selectedPlan === 'Elite' ? 'Selected' : 'Select Plan'}
                  </button>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex gap-4 items-center justify-end pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setErrorLimitMessage(null); }}
                  className="px-6 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Back to details
                </button>
                <button 
                  type="button"
                  onClick={handleSubmitClick}
                  disabled={isUploading}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-extrabold text-sm shadow-md hover:shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
                >
                  {isUploading ? 'Publishing Listing...' : `Publish with ${selectedPlan} Plan`}
                  <span className="material-symbols-outlined text-sm font-bold">publish</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Glassmorphic Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] border border-slate-250 shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
              >
                {/* Decorative premium accents */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-tertiary to-accent" />
                
                {paymentStep === 1 && (
                  <div>
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Secure Checkout</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-6">Complete payment to activate your <span className="text-primary font-bold">{selectedPlan} plan</span>.</p>
                    
                    {/* Summary */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{selectedPlan} Listing Plan</span>
                        <span className="font-black text-slate-800 text-sm">{selectedPlan === 'Premium' ? '₹3,000' : '₹5,000'}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200/50 pt-2 text-xs">
                        <span className="text-slate-400 font-medium">Duration</span>
                        <span className="text-slate-600 font-bold">{selectedPlan === 'Premium' ? '60 Days' : '90 Days'}</span>
                      </div>
                    </div>
                    
                    {/* Method selection */}
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Choose Payment Method</h4>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {[
                        { id: 'UPI', name: 'UPI / QR', icon: 'qr_code_2' },
                        { id: 'Card', name: 'Credit/Debit', icon: 'credit_card' },
                        { id: 'Net Banking', name: 'Net Banking', icon: 'account_balance' },
                        { id: 'Wallet', name: 'Wallets', icon: 'wallet' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${paymentMethod === method.id ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          <span className="material-symbols-outlined text-lg">{method.icon}</span>
                          {method.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPaymentModal(false)}
                        className="flex-1 py-3.5 rounded-xl font-bold text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={startPaymentSimulation}
                        className="flex-1 py-3.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-primary to-primary-container text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1 uppercase tracking-wider"
                      >
                        Pay &amp; Activate <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {paymentStep === 2 && (
                  <div className="text-center py-10 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="var(--primary)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * paymentProgress) / 100} strokeLinecap="round" className="transition-all duration-100" />
                      </svg>
                      <span className="font-extrabold text-slate-800 text-sm">{paymentProgress}%</span>
                    </div>
                    <h3 className="font-jakarta font-extrabold text-xl text-slate-900 mb-1">Processing Payment</h3>
                    <p className="text-slate-500 text-xs font-semibold animate-pulse">
                      {paymentProgress < 30 && 'Contacting secure server...'}
                      {paymentProgress >= 30 && paymentProgress < 75 && 'Authorizing transaction with bank...'}
                      {paymentProgress >= 75 && 'Creating premium activation token...'}
                    </p>
                  </div>
                )}
                
                {paymentStep === 3 && (
                  <div className="text-center py-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-md animate-bounce">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Payment Approved!</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-6">Txn ID: TXN_{Math.floor(100000 + Math.random() * 900000)}</p>
                    <p className="text-xs text-slate-400 font-medium">Activating plan and publishing listing...</p>
                  </div>
                )}
                
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
