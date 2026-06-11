'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  { name: 'Aura Residency', location: 'Vaishali Nagar', price: '₹3.5 Cr+', possession: 'Dec 2026', type: '4 BHK Villas', status: 'Booking Open', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt6b0pEWBQyjntjrg1TVqePyupCD2G33s9jCsL7XIB1r9Jdxh1i0e-gfUeCLVetR3oRbwLGRLq0b6csja5dgHtlsI4twAkETIii76jP0ftYBJxfoI-b42RjK1YEYYy6yryL2wU2DGPmS-57B5DWWpHQoixmm9NbZFBGlwpxBNoWHs-CLd3_FU9rVp6p6YoiwaguYqU1gSkDhmztji8CY_MC6PLtPVARSfs5Nx7UYeOsxiEJYIkqp-NXsGkX6cwnlo6oTurgdM-aZQ' },
  { name: 'The Corporate Hub', location: 'C-Scheme', price: '₹85 L+', possession: 'June 2025', type: 'Retail/Office', status: 'Pre-Leased', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXeiAfHpu8DNWVD0UpTu_JPC1GFyjqv6oPmmiJGXdcxxPNiUibUwC_qVWkRSQiF4Eiwi6H29MID5LdaeBs3rL4bVSEOSZpni2rumn2cghXwjILGvYIHFlQrnYIV5hP2EjgZhKrDZKcHuCd4r6BO6pUmVF8J8wFmabMd1rxqkP4C4CMQhIxO8oty_64MsB50yBkmR-q4r9WfHsJ0nWmHW010uhq2Cm4bQC0soY8cTytpnPNAZ9oLIcgPyUKHT8u9hota7QhHP0uAIs' },
  { name: 'Zen Gardens', location: 'Malviya Nagar', price: '₹1.8 Cr+', possession: 'Mar 2027', type: '3 BHK Flats', status: 'Launching Soon', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Gmp3vUCn-1C1AdA3mDCtsV9smrVPwB5vOXsmUBI9n9OOfLaOjut3zlZ1NXfiETXmQVmJesmlULhy8mM6RLR6J5wtZE3cX44y3oGsK826PnOjZ22GjBwIjFn8NmIdOhuDOGiDIZHcbTkvVg0NTElSnjtrInqTEBj05brVshIjFRO93Gpp06XKcxmOUGZulokf588hYOIdleQco0Yh-aF-xR-ItglOYeGPqGNo7Q1Ve0_E8S_C4PMoh1yAeCUhIfFNqLRigAqtx7E' },
];

const underConstruction = [
  { name: 'The Oasis Enclave', location: 'Jagatpura, Jaipur', progress: 65, desc: 'Structural work complete for Phase 1. Expected handover by mid-2025.', tags: ['Structure Completed', 'Plastering Underway', 'Sample Flat Ready'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJkMEgH1ijNFv6rJ80fhWblWOP1mxAr8NdTRLVuSJODQOE_LqscHinJ-s4kqlJ5qlPdItv30f6b9Xd5Y2EtpvkvxJt_hxUnifDLESjKMtVC0Bi6pFBhwnIYzgR3B4Pk6aTXkvr3vO7eDJxK14ivC1WMdkrGOdEa1OTgqxk2oNbDi5aqxbB9qDBhRczBYt2UDvoHKKAUyoVuA17lK37qR_6Firq3eWZtQUNLNdarht70JfFVKi3KrwEnbgwjC7TSyFDiCMMsRrIA58' },
  { name: 'Emerald Towers', location: 'Ajmer Road, Jaipur', progress: 30, desc: 'Foundation work completed. Ground floor slab casting in progress.', tags: ['Foundation Done', 'RCC Work Started'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm4FH1eDgW9RsICu3pHNAlhxxDL2EylQbBJOXR8gXvrZp-tOYEcUrt458uMUFeb5IUJ5iWGFqeHk-5WmrU0ZX1qhgmQ7iV3a9lWrUK3WJu42DxjN3xXsivtRDr6EXfoJzFHGl9f5vhdgsiFcAJGKm3_tLFGIUXwU1LeK80ODoSD0Msn6Srpf3tzN9bYMqRUYrShxS0SGfxGIFIyN2Q15EHWr0xwI2fHeyCBNwkMsqflNObQ8tCq1Anzs2Hh8ovpS_afJQUrsC6FI4' },
];

export default function NewProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[700px] md:h-[819px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTLYnQtIlGDrkNiI-OpabgCKgGCjjK1ojBd_Kq-CspSBwpJwX_S6V-AuTrZZJ8x48NBzyVvkxCEcuN7_kO36IdveFhvbd5yvl2qUW2VO8Vzh-kU3GkIjEy3Db9x2RRZhzx99qT_DVoDdSD3uWq1KLlDiDs6cIbmDS7x_Y7Iq6JVt1nnQDshAJ5NPJN6g9-Ov_vmXLiXwJqi3ipAsmcwZp6Y8Q34Wa02hQhVSYhPCBVJqwegqgOJ-fziNwIRr1fdLUzmKce1KzUUiE" alt="New Projects" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 w-full">
          <div className="max-w-2xl glass-card p-10 rounded-[32px] shadow-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary text-white font-bold text-xs mb-4">FLAGSHIP PROJECT</span>
            <h1 className="font-extrabold text-display-xl mb-6">The Sapphire Heights: Luxury Reimagined</h1>
            <p className="text-body-lg text-on-surface-variant mb-8">Experience a new paradigm of royal living at Mansarovar&apos;s most iconic address.</p>
            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-xl accent-gradient text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"><span className="material-symbols-outlined">explore</span> Explore</button>
              <button className="px-8 py-4 rounded-xl glass-card font-bold flex items-center gap-2 hover:bg-white/90 transition-all"><span className="material-symbols-outlined">download</span> Brochure</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recently Launched */}
      <section className="py-20 max-w-screen-2xl mx-auto px-6 md:px-10">
        <h2 className="font-bold text-headline-lg mb-10">Recently Launched</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {projects.map((proj, i) => (
            <motion.div key={proj.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="gradient-border-card rounded-[24px] overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-xl">
              <div className="relative h-64"><img className="w-full h-full object-cover" src={proj.img} alt={proj.name} loading="lazy" /><div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> NEW LAUNCH</div></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold text-xl">{proj.name}</h3><div className="flex items-center gap-1 text-on-surface-variant text-sm mt-1"><span className="material-symbols-outlined text-sm">location_on</span>{proj.location}</div></div><span className="font-extrabold text-primary">{proj.price}</span></div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-surface-container p-2 rounded-lg text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">POSSESSION</p><p className="font-bold text-xs">{proj.possession}</p></div>
                  <div className="bg-surface-container p-2 rounded-lg text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">TYPE</p><p className="font-bold text-xs">{proj.type}</p></div>
                  <div className="bg-surface-container p-2 rounded-lg text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">STATUS</p><p className="font-bold text-xs">{proj.status}</p></div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/new-projects/1`} className="flex-1 py-3 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors border border-primary/20"><span className="material-symbols-outlined text-lg">visibility</span> VIEW PROJECT</Link>
                  <button className="flex-1 py-3 rounded-lg bg-surface-container-high font-bold text-xs flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors"><span className="material-symbols-outlined text-lg">event</span> BOOK VISIT</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Under Construction */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-12"><div className="h-1 w-12 bg-primary" /><h2 className="font-bold text-headline-lg">Under Construction</h2></div>
          <div className="space-y-gutter">
            {underConstruction.map(proj => (
              <div key={proj.name} className="glass-card rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch p-4 gap-8 shadow-lg border border-white">
                <div className="w-full md:w-1/3 h-72 rounded-[24px] overflow-hidden"><img className="w-full h-full object-cover" src={proj.img} alt={proj.name} loading="lazy" /></div>
                <div className="flex-1 flex flex-col justify-center pr-0 md:pr-6">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div><h3 className="font-bold text-xl">{proj.name}</h3><p className="text-on-surface-variant">{proj.location}</p></div>
                    <div className="text-right"><span className="text-sm font-bold text-primary">{proj.progress}% COMPLETED</span><div className="w-48 h-2 bg-surface-variant rounded-full mt-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${proj.progress}%` }} /></div></div>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-6">{proj.desc}</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    {proj.tags.map(tag => <span key={tag} className="px-3 py-1 bg-white rounded-full text-xs font-bold border border-outline-variant">{tag}</span>)}
                    <div className="ml-auto flex gap-4">
                      <Link href={`/new-projects/1`} className="px-5 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
