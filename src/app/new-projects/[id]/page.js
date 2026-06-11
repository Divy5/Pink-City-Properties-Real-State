'use client';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  // Realistic Dummy Data for a Project
  const project = {
    id: params.id,
    name: 'Aura Residency',
    builder: 'Jaipur Premium Developers',
    location: 'Vaishali Nagar, Jaipur',
    priceRange: '₹3.5 Cr - ₹5.2 Cr',
    possession: 'December 2026',
    status: 'Under Construction',
    rera: 'RAJ/P/2023/1234',
    description: `Aura Residency redefines luxury living in the heart of Vaishali Nagar. This under-construction premium project offers spacious 4 BHK and 5 BHK villas designed with state-of-the-art architecture. Enjoy the perfect blend of serenity and connectivity, with world-class amenities right at your doorstep.

The project features a sprawling clubhouse, infinity pool, landscaped zen gardens, and top-tier security systems. Whether you are looking for a dream home or a high-ROI investment, Aura Residency is the ultimate choice in Jaipur.`,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBt6b0pEWBQyjntjrg1TVqePyupCD2G33s9jCsL7XIB1r9Jdxh1i0e-gfUeCLVetR3oRbwLGRLq0b6csja5dgHtlsI4twAkETIii76jP0ftYBJxfoI-b42RjK1YEYYy6yryL2wU2DGPmS-57B5DWWpHQoixmm9NbZFBGlwpxBNoWHs-CLd3_FU9rVp6p6YoiwaguYqU1gSkDhmztji8CY_MC6PLtPVARSfs5Nx7UYeOsxiEJYIkqp-NXsGkX6cwnlo6oTurgdM-aZQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Gmp3vUCn-1C1AdA3mDCtsV9smrVPwB5vOXsmUBI9n9OOfLaOjut3zlZ1NXfiETXmQVmJesmlULhy8mM6RLR6J5wtZE3cX44y3oGsK826PnOjZ22GjBwIjFn8NmIdOhuDOGiDIZHcbTkvVg0NTElSnjtrInqTEBj05brVshIjFRO93Gpp06XKcxmOUGZulokf588hYOIdleQco0Yh-aF-xR-ItglOYeGPqGNo7Q1Ve0_E8S_C4PMoh1yAeCUhIfFNqLRigAqtx7E',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJkMEgH1ijNFv6rJ80fhWblWOP1mxAr8NdTRLVuSJODQOE_LqscHinJ-s4kqlJ5qlPdItv30f6b9Xd5Y2EtpvkvxJt_hxUnifDLESjKMtVC0Bi6pFBhwnIYzgR3B4Pk6aTXkvr3vO7eDJxK14ivC1WMdkrGOdEa1OTgqxk2oNbDi5aqxbB9qDBhRczBYt2UDvoHKKAUyoVuA17lK37qR_6Firq3eWZtQUNLNdarht70JfFVKi3KrwEnbgwjC7TSyFDiCMMsRrIA58'
    ],
    amenities: [
      { name: 'Clubhouse', icon: 'holiday_village' },
      { name: 'Swimming Pool', icon: 'pool' },
      { name: 'Gymnasium', icon: 'fitness_center' },
      { name: '24x7 Security', icon: 'security' },
      { name: 'Power Backup', icon: 'electrical_services' },
      { name: 'Kids Play Area', icon: 'child_care' }
    ]
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % project.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <Link href="/new-projects" className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-sm font-bold text-slate-700 mb-6">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Projects
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative rounded-[32px] overflow-hidden h-[400px] md:h-[600px] mb-8 bg-surface-container group shadow-lg">
            <AnimatePresence initial={false} mode="wait">
              <motion.img 
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={project.images[currentImage]} 
                alt={project.name} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </AnimatePresence>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"><span className="material-symbols-outlined">chevron_left</span></button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all z-10 shadow-lg"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2 border border-primary/20">NEW LAUNCH</span>
                <h1 className="font-jakarta font-extrabold text-4xl md:text-5xl text-slate-900">{project.name}</h1>
                <p className="text-on-surface-variant flex items-center gap-1 mt-2 text-lg font-medium">
                  <span className="material-symbols-outlined text-primary">location_on</span>{project.location}
                </p>
                <p className="text-slate-500 font-bold mt-1 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">domain</span> Builder: {project.builder}</p>
              </div>
              <div className="text-right">
                <span className="font-jakarta font-extrabold text-4xl text-primary drop-shadow-sm">{project.priceRange}</span>
                <p className="text-sm text-slate-500 font-bold mt-1">Status: {project.status}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-outline-variant/30 mb-8">
              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">event</span>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Possession</p><p className="font-bold text-slate-800">{project.possession}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">home</span>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Type</p><p className="font-bold text-slate-800">4 & 5 BHK</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">RERA ID</p><p className="font-bold text-slate-800">{project.rera}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">apartment</span>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Towers</p><p className="font-bold text-slate-800">3 Towers</p></div>
              </div>
            </div>
            
            <h3 className="font-bold text-2xl mb-4 text-slate-900">Project Description</h3>
            <p className="text-on-surface-variant text-body-lg leading-relaxed whitespace-pre-line bg-surface-container-low p-6 rounded-3xl mb-8">{project.description}</p>

            <h3 className="font-bold text-2xl mb-4 text-slate-900">Premium Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {project.amenities.map(amenity => (
                <div key={amenity.name} className="flex items-center gap-3 bg-white border border-outline-variant rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">{amenity.icon}</span></div>
                  <span className="font-bold text-slate-700">{amenity.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[32px] p-8 border border-outline-variant shadow-xl">
              <h3 className="font-bold text-2xl mb-2 text-slate-900">Register Interest</h3>
              <p className="text-sm text-on-surface-variant mb-6">Get the brochure, floor plans, and exclusive pre-launch offers.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Registration successful!'); }} className="space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input required className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
                  <input required className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium" placeholder="Phone Number" type="tel" />
                </div>
                <button type="submit" className="w-full accent-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[20px]">download</span> Download Brochure
                </button>
                <button type="button" onClick={() => alert('Visit Scheduled!')} className="w-full bg-white text-primary border-2 border-primary/20 hover:border-primary py-3.5 rounded-xl font-bold hover:bg-primary/5 transition-all flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">event</span> Schedule Site Visit
                </button>
              </form>
            </motion.div>
            
            <Link href="/home-loans" className="flex flex-col p-6 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white hover:-translate-y-1 transition-all shadow-xl group border border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white">account_balance</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Project Approved for Loans</h4>
              <p className="text-slate-400 text-sm mb-4">SBI, HDFC, and ICICI bank approved. Check your eligibility instantly.</p>
              <div className="flex items-center gap-2 text-accent font-bold text-sm">
                Apply Now <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
