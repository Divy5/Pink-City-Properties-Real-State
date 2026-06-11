'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UpcomingProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[716px] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ULPNRQXlURBzn00R2JQyNlxlwBEOjdp2oXlFFrtt2_fc77TzBxqWwCnxp2o99RGb4W5PiY2B7QTNcfZ_CeecTIqU38oyXosb1syskZM2XACLMSKDxORWzu1VWdfHswqjpA49enhJWBcPFnPIJZr8fobNGuQQj4E7q-2SuHi4kqraoC0U30MM_-9ZghfvURRLq_Ug-tF1NGgOPXB3LKG8qSdj40Krq_JiQ3m6KSnGi85bvTE0Lq_H1s3XdiZ3V26URAeKEu59Kjw" alt="Upcoming" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold mb-6 border border-primary/20">INVESTMENT OPPORTUNITIES</span>
            <h1 className="font-extrabold text-display-xl mb-6">The Next Era of <br /><span className="text-gradient">Jaipur Living</span></h1>
            <p className="text-body-lg text-on-surface-variant max-w-xl mb-10">Unlock early-bird pricing on upcoming luxury developments in Rajasthan&apos;s most sought-after postcodes.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/buy" className="px-8 py-4 accent-gradient text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2">View Opportunities <span className="material-symbols-outlined">arrow_forward</span></Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-all">Partner With Us</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
            <div className="glass-card p-2 rounded-[32px] premium-border">
              <div className="bg-surface rounded-[24px] p-8">
                <h3 className="font-bold text-xl mb-2">Get Early Access</h3>
                <p className="text-on-surface-variant mb-6">Be the first to receive floor plans and investor briefs.</p>
                <form className="space-y-4">
                  <input className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary" placeholder="Full Name" />
                  <input className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary" placeholder="Email Address" type="email" />
                  <select className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"><option>Select Preferred Area</option><option>Mansarovar</option><option>Vaishali Nagar</option><option>C-Scheme</option><option>Malviya Nagar</option></select>
                  <button className="w-full py-4 accent-gradient text-white rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Notify Me</button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Pre-Launches */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
          <h2 className="font-bold text-headline-lg mb-2">Featured Pre-Launches</h2>
          <p className="text-on-surface-variant mb-12">Handpicked opportunities with high growth potential.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {/* Large Card */}
            <div className="md:col-span-2 lg:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[32px] glass-card premium-border min-h-[500px]">
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <span className="px-4 py-1.5 bg-tertiary text-white rounded-full font-bold text-xs flex items-center gap-1"><span className="material-symbols-outlined text-sm">bolt</span> PRE-LAUNCH</span>
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-slate-900 rounded-full font-bold text-xs">MANSAROVAR</span>
              </div>
              <img className="w-full h-full min-h-[500px] object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUMM7kVj63bahrO3ZXFm2OjbGgIhLl5fbTgdaQTsUoBH0uDajKYBZcNzJMGezCOsQY0yVsmHnm3HKaaCXU-4lyDUipgER-1YV75OMKMVeHq-AnfYctAkuZonKpEq_oll-nN79T-3Hqb0Wr4yxqWhxlU7k2xTvF25S7JBKyPapc8-ObJDq-oa-3iEB3Fv8XTXCKDGf8eErG9yCosl5VrL9XyJspmy-clptmKtmzv7o1-XVo6pGwZzG6rGjfojv7zKo7J8EGKf6Aj8E" alt="The Jaipur Zenith" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-headline-lg mb-2">The Jaipur Zenith</h3>
                    <p className="text-white/80 max-w-md mb-4">Ultra-modern 4BHK apartments with private sky gardens.</p>
                    <div className="flex gap-4">
                      <div className="text-center"><span className="block text-2xl font-bold">14</span><span className="text-xs uppercase opacity-60">Days</span></div>
                      <div className="text-center"><span className="block text-2xl font-bold">22</span><span className="text-xs uppercase opacity-60">Hrs</span></div>
                      <div className="text-center"><span className="block text-2xl font-bold">45</span><span className="text-xs uppercase opacity-60">Mins</span></div>
                    </div>
                  </div>
                  <div className="text-right"><p className="text-xs uppercase opacity-60 mb-1">Starts From</p><p className="font-extrabold text-2xl text-primary-fixed-dim">₹3.2 Cr</p></div>
                </div>
              </div>
            </div>

            {/* Smaller cards */}
            <div className="md:col-span-1 lg:col-span-2 glass-card rounded-[32px] overflow-hidden group">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 h-48 md:h-full overflow-hidden"><img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPxSFVsqxvv3gZNx3qnxUJShKHvFk-4jygQLNrtpQXroNGCeJ5tVe7CmUrXCGiv7DBdEM4MNv9cbZO05BW-4Sx_4Ef9lnvYjiT9In-39X6sbNE5WHpXop6-gMTJrsqvi4geTL91IemiC7Siu3IuN28uTuhi9bQaNkJL2PHf_8oT2hfTQSU7cY3elDoD4g10EcmvItN6n73hio_3YIOChxvkqeGhv1mR7nEwswGTZ9i3dTlB-sibXVBAl68001t9AcMHDXM7mydzZU" alt="Emerald Terraces" loading="lazy" /></div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                  <div><span className="text-tertiary font-bold text-xs uppercase block mb-1">Limited Phase Release</span><h3 className="font-bold text-xl mb-2">Emerald Terraces</h3><p className="text-on-surface-variant text-sm">Boutique luxury villas featuring Rajasthani stone craft.</p></div>
                  <div className="mt-4"><p className="font-extrabold text-primary text-xl mb-2">₹1.8 Cr onwards</p><span className="text-primary font-bold flex items-center gap-1">View Brochure <span className="material-symbols-outlined">arrow_forward</span></span></div>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="md:col-span-1 accent-gradient rounded-[32px] p-8 text-white flex flex-col justify-between min-h-[250px]">
              <span className="material-symbols-outlined text-5xl opacity-40">trending_up</span>
              <div>
                <h3 className="font-bold text-xl mb-2">Investor Analytics</h3>
                <p className="text-white/80 text-sm mb-6">Access detailed ROI forecasts and rental yield analytics.</p>
                <button className="w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-opacity-90 transition-all">Request Report</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 bg-white border-y border-surface-container">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-bold text-headline-lg mb-4">Don&apos;t Miss the Next Big Release</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">Join our exclusive circle of investors to receive off-market listings.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input className="flex-grow bg-surface-container-low border-none rounded-xl px-6 py-4" placeholder="Enter your email" type="email" />
            <button className="px-8 py-4 accent-gradient text-white rounded-xl font-bold">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}
