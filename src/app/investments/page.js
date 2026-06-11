'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function InvestmentsPage() {
  return (
    <>
      <section className="relative px-6 md:px-10 pt-16 pb-20 max-w-screen-2xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold mb-6">
              <span className="material-symbols-outlined text-lg">trending_up</span> High Yield Real Estate
            </div>
            <h1 className="font-extrabold text-display-xl mb-8">Invest in Jaipur&apos;s <br /><span className="text-primary">Next Growth Wave</span></h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg mb-10">Secure high-yield residential and commercial opportunities in Rajasthan&apos;s capital. Data-driven ROI analysis for Jaipur&apos;s most promising corridors.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/buy" className="accent-gradient text-white px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-all">View Opportunities <span className="material-symbols-outlined">arrow_forward</span></Link>
              <Link href="/emi-calculator" className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary/5 transition-colors">ROI Calculator</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="relative h-[400px] lg:h-[500px] rounded-[40px] overflow-hidden shadow-2xl">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp1rLsQhRQgU0DAi3ScR0A9hu5j6DIOEIUviVqwdA81ChjoLkrEH5ZbdXZ-LUIRepYT1EXwvjAs5Ng9Y5cr-btwbcH3b1THEaKUBFXOCfV6SLAAwG6PpzwOUrPVRfYNJTND5pYHPxfdljm9Po8qp4eR1_UFjhNQLE7_CRbS98J9L_aYrhWZJS2iA1ym6-fkJjKdHggo1P6623sY6dV3XfzdHRM8-6oBl0s6M-k8VszqYyqzsojI_mvyEkAQReAzS6fcLMhzLMzzCc" alt="Investment" loading="lazy" />
            <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl shadow-lg border border-white/30">
              <div className="flex justify-between items-end">
                <div><p className="text-xs uppercase font-bold text-on-surface-variant">Projected Growth</p><h3 className="font-bold text-xl mt-1">Jagatpura Sector 7</h3></div>
                <span className="text-primary font-bold text-xl">+18.5% YoY</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Chips */}
      <section className="px-6 md:px-10 pb-12 max-w-screen-2xl mx-auto">
        <h2 className="font-bold text-headline-lg mb-6">Trending Growth Corridors</h2>
        <div className="flex flex-wrap gap-4">
          {['Mansarovar Extension', 'Jagatpura', 'Vaishali Nagar West', 'C-Scheme (Commercial)', 'Malviya Nagar'].map(loc => (
            <span key={loc} className="px-6 py-3 rounded-full bg-primary/10 text-primary font-bold flex items-center gap-2 hover:bg-primary/20 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-lg">location_on</span>{loc}
            </span>
          ))}
        </div>
      </section>

      {/* Intelligence Grid */}
      <section className="px-6 md:px-10 pb-20 max-w-screen-2xl mx-auto">
        <h2 className="font-bold text-headline-lg mb-10">Investment Intelligence</h2>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container p-10 rounded-[32px] text-white">
            <h3 className="font-bold text-headline-lg mb-4">Market Outlook 2025</h3>
            <p className="opacity-80 mb-8">Jaipur is witnessing a tech-corridor boom. Properties near Jagatpura are expected to appreciate by an additional 12% following the airport expansion.</p>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex-1"><p className="text-sm opacity-60">Avg. Growth</p><p className="text-2xl font-bold">14.2%</p></div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex-1"><p className="text-sm opacity-60">Rental Yield</p><p className="text-2xl font-bold">5.8%</p></div>
            </div>
          </div>
          <div className="bg-surface-container-high p-8 rounded-[32px] border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">account_balance_wallet</span>
            <h4 className="font-bold text-xl mb-2">Financing Options</h4>
            <p className="text-on-surface-variant text-sm">Exclusive tie-ups with HDFC and SBI for investment loans at 8.4%.</p>
            <Link href="/home-loans" className="text-primary font-bold flex items-center gap-1 mt-4 hover:underline">Learn More <span className="material-symbols-outlined text-sm">arrow_outward</span></Link>
          </div>
          <div className="bg-secondary p-8 rounded-[32px] text-white">
            <span className="material-symbols-outlined text-4xl mb-4">verified</span>
            <h4 className="font-bold text-xl mb-2">Verified RERA</h4>
            <p className="opacity-80 text-sm">Every listing on our investment portal is 100% RERA compliant.</p>
            <Link href="/contact" className="inline-block bg-white text-secondary py-2 px-4 rounded-lg font-bold mt-4">Request Portfolio</Link>
          </div>
        </div>
      </section>
    </>
  );
}
