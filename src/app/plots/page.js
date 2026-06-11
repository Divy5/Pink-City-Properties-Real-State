'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plots = [
  { title: 'The Ridge, Jagatpura', price: '₹1.1 Cr', size: '250 Sq. Yard', pricePerUnit: '₹44,000/Sq.Yd', badge: 'JDA APPROVED', badgeIcon: 'verified', location: 'Near 7-Number Stand, Jagatpura', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPnDDo-BB68fyNrGlMNzTmNVLYRnZbDqYWYchFs1zAGFnye72IGelBE00-GQUZJoNHHae-RTLGqRjI-0Meyi0MHX-rBX4Epbr4kQzhXDJthUHNRHGMiyAZbbHQ-xTqBf9MNb2anwl7U8oFijhb_JYgpQfWOUaK2pPghy3AIOOtDcVL6PwANEfaLq3z_zuyw-NN7CGv64tKGwxuXvqapFJm3hbSS8TAE1Wy4YkgTgcukNcPKgJPhxgQABMDBQtKRnf2PN0EKbWStwU', featured: true },
  { title: 'Mahapura Greens', price: '₹65 L', size: '1,000 Sq. Yard', pricePerUnit: '₹6,500/Sq.Yd', badge: 'AGRICULTURAL', badgeIcon: 'agriculture', location: 'Ajmer Road, West Jaipur', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBasXIGLWeDz5-oA4BwkQtbCudA4IQGhTSZfS3qzbNLOw_ubEG7qm4Krxm9KzcVOPOAUryr6YKQdNqMrta5QEioud2uPdKARQrVTgcu8vE2mXJB7lTIVXSmGrz05gpe3YhadBkDNHU_3bJU0c3h4TNkqZTLA85rLcoJKONoDamDg17DPnKaLSyCd42c6AHeCsWgAcce337snGvWIjC3FSuJqaHBKM6_gZbz5D9dvwpHhF0qWeRikdLFkFJGYsPCWRMMVvgvhRhoOMw', featured: false },
  { title: 'Skyline Avenue', price: '₹4.8 Cr', size: '400 Sq. Yard', pricePerUnit: '₹1,20,000/Sq.Yd', badge: 'COMMERCIAL', badgeIcon: 'business', location: 'Near 200 Ft Road, Sikar Road', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3Fnd3Z-cflJAUFCLQozidOb6RtsngT6PywF2_BhlPKjgCUAwhm-5vQOFvgnpMjwXODLWXo4WCWNt-IUipCjO4tNbh_S3B4NIT2buYvXuWGU0yl8fOU0oQUBM9LR7Ot-uGSK6vJLwmnODMcESle6p5j0QjtHLWKjzKRPc2nSYENUd8fICIMZBAIX58HI7XBfsmogv3vvUS-s45Kkt4TfGaL7nCHTm9OTMJfrofRyuvIWeuBkezSHG9RO2PiIOcLrrkMHAXSS-Q84', featured: true },
];

export default function PlotsPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-16">
        <div className="relative overflow-hidden rounded-[2rem] h-[350px] md:h-[450px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo1eMTFdGoH6578xd6UW3kpr1Hw3n1xTa1aSwvqAsiExSK20UFa-RDtf8vMlDhwOZBc_snSDxu1TnIDBXEFbaKTIzV15JUtd5j153YXAh5rpy6rwj1LLJWh0tg4c4wx_efMqK8y43mOmks56X_k2CDsrJMqWJ0vLY879V3vICQWoRKH-2lIKtrFwhIdU8CVDdz3meq0bNoPwcRhwgSTVamjQlau2YTUZfOr32RzH6qa2X2VdhMoAICCFAosfY-vHthYaz0IsCUmSc" alt="Plots" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-transparent" />
          </div>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 px-8 md:px-16 max-w-2xl">
            <h1 className="font-extrabold text-display-xl text-white mb-4">Find Your Perfect <br /><span className="text-primary-fixed">Piece of Jaipur</span></h1>
            <p className="text-white/80 text-body-lg mb-8">Explore JDA-approved residential and commercial plots in Jaipur&apos;s highest-growth corridors.</p>
            <div className="flex gap-4 flex-wrap">
              <button className="accent-gradient text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-all">View Hot Plots</button>
              <Link href="/contact" className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">Consult Expert</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
        <h2 className="font-bold text-headline-lg mb-8">High-ROI Plot Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plots.map((plot, i) => (
            <motion.div 
              key={plot.title} 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-20px" }} 
              transition={{ delay: i * 0.04, duration: 0.35 }} 
              className="group relative rounded-xl border border-slate-200 hover:border-primary/30 cursor-pointer shadow-sm hover:shadow-[0_8px_24px_rgba(15,76,129,0.06)] transition-all duration-300 flex flex-col h-full bg-white"
            >
              {/* Badges Overlay */}
              <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start select-none pointer-events-none">
                {plot.featured && (
                  <span className="bg-gradient-to-r from-amber-500 to-[#D4AF37] text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm border border-amber-300/30">
                    ★ FEATURED
                  </span>
                )}
                <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[10px] text-white shrink-0">{plot.badgeIcon}</span>
                  <span>{plot.badge}</span>
                </span>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-slate-100 shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" src={plot.img} alt={plot.title} loading="lazy" />
              </div>

              {/* Content */}
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div className="space-y-1">
                  {/* Price */}
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-jakarta font-extrabold text-[15px] text-primary tracking-tight">
                      {plot.price}
                    </span>
                    <span className="bg-slate-50 border border-slate-200/80 text-slate-500 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                      Plot
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-jakarta font-extrabold text-slate-800 text-xs hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {plot.title}
                  </h3>

                  {/* Location */}
                  <div className="text-slate-450 text-[10px] flex items-center gap-0.5 font-semibold truncate">
                    <span className="material-symbols-outlined text-slate-400 text-xs shrink-0 select-none">location_on</span>
                    <span className="truncate">{plot.location}</span>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2.5 mt-2">
                    <span className="truncate">{plot.size} • {plot.pricePerUnit}</span>
                    <span className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60 text-[8px] uppercase font-black tracking-wider truncate shrink-0">
                      JDA APPROVED
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 z-10 relative">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      e.preventDefault(); 
                    }}
                    className="favorite-button w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-[14px] h-[14px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>

                  <Link 
                    href="/contact"
                    className="contact-button flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[9px] font-black py-2 rounded-lg transition-colors uppercase tracking-wider text-center cursor-pointer"
                  >
                    Contact
                  </Link>

                  <Link 
                    href="/contact"
                    className="flex-1 bg-primary text-white hover:bg-primary/95 text-[9px] font-black py-2 rounded-lg transition-colors uppercase tracking-wider text-center cursor-pointer"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
