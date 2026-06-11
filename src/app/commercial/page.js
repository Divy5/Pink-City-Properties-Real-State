'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CommercialPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden px-6 md:px-10">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover brightness-50" 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop" 
            alt="Jaipur Commercial Hub Tower" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-6 text-left"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-200 border border-amber-500/20 font-extrabold text-xs uppercase tracking-widest">
              Commercial Excellence
            </span>
            <h1 className="font-jakarta font-extrabold text-4xl md:text-6xl text-white leading-tight tracking-tight">
              Scale Your Business in the Heart of Rajasthan
            </h1>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
              Premium corporate office towers, high-footfall retail complexes, and strategic industrial warehouses curated for high yield ROI and robust growth.
            </p>
            <div className="flex gap-4 flex-wrap pt-2">
              <Link href="/buy?type=Commercial" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white rounded-xl font-extrabold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider">
                View Opportunities
              </Link>
              <Link href="/contact" className="border border-white/40 text-white hover:border-white px-8 py-4 rounded-xl font-extrabold hover:bg-white/10 active:scale-95 transition-all text-sm uppercase tracking-wider">
                Schedule Advisory
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commercial Hubs Bento */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-left">
        <div className="mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Jaipur Enterprise Zones</span>
          <h2 className="font-jakarta font-extrabold text-3xl md:text-5xl text-slate-900 tracking-tight">Top Commercial Hubs</h2>
          <p className="text-sm md:text-base text-slate-500 font-semibold mt-1">Strategically situated commercial real estate driving Jaipur&apos;s trade boom.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Bento Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 relative rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end min-h-[350px] md:min-h-[480px] bg-slate-900"
          >
            <img 
              className="w-full h-full object-cover absolute inset-0 z-0 opacity-80 transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
              alt="C-Scheme Commercial District" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent z-10" />
            
            <div className="relative z-20 p-8 md:p-10 text-white text-left">
              <h3 className="font-jakarta font-extrabold text-2xl md:text-3xl mb-2">C-Scheme Premium District</h3>
              <p className="text-slate-200 font-semibold text-sm max-w-lg mb-4 leading-relaxed">
                The ultimate blue-chip enterprise district in central Jaipur, hosting regional headquarters of major banks, fintech enterprises, and corporate offices.
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20">
                <span className="material-symbols-outlined text-sm text-amber-300">trending_up</span> Avg. ₹25,000 / sq.ft
              </span>
            </div>
          </motion.div>

          {/* Side Bento Column */}
          <div className="md:col-span-4 flex flex-col gap-8 justify-between">
            {/* Bento Item 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end flex-1 min-h-[220px] bg-slate-900"
            >
              <img 
                className="w-full h-full object-cover absolute inset-0 z-0 opacity-75 transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
                alt="Vaishali Nagar High-street Retail" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
              
              <div className="relative z-20 p-6 text-white text-left">
                <h3 className="font-jakarta font-extrabold text-xl mb-1">Vaishali Nagar</h3>
                <p className="text-slate-200 font-semibold text-xs mb-3">High-footfall highstreet retail spaces and commercial complexes.</p>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-extrabold border border-white/20">
                  Avg. ₹18,000 / sq.ft
                </span>
              </div>
            </motion.div>

            {/* Bento Item 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end flex-1 min-h-[220px] bg-slate-900"
            >
              <img 
                className="w-full h-full object-cover absolute inset-0 z-0 opacity-75 transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" 
                alt="Malviya Nagar IT Hub" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
              
              <div className="relative z-20 p-6 text-white text-left">
                <h3 className="font-jakarta font-extrabold text-xl mb-1">Malviya Nagar</h3>
                <p className="text-slate-200 font-semibold text-xs mb-3">Premium IT parks, startup incubators, and corporate workspaces.</p>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-extrabold border border-white/20">
                  Avg. ₹20,000 / sq.ft
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <h2 className="font-jakarta font-extrabold text-3xl md:text-5xl mb-4 relative z-10 tracking-tight leading-tight">
            Partner with Jaipur&apos;s Economic Expansion
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 font-semibold leading-relaxed">
            Whether you seek an premium regional corporate office or a secure high-yield retail asset portfolio, our commercial advisors provide expert end-to-end guidance.
          </p>
          <div className="relative z-10">
            <Link href="/contact" className="inline-block bg-white text-slate-900 hover:bg-slate-50 px-10 py-4 rounded-xl font-extrabold hover:scale-105 active:scale-95 transition-all shadow-xl text-xs uppercase tracking-widest">
              Connect with Commercial Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
