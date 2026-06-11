'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SellPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-extrabold text-display-xl mb-6">Sell Your Property <br /><span className="text-gradient">Faster &amp; Smarter</span></h1>
          <p className="text-body-lg text-on-surface-variant mb-10 max-w-lg">List your property on Jaipur&apos;s most trusted platform. Reach thousands of verified buyers and close deals faster.</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/add-property" className="accent-gradient text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2"><span className="material-symbols-outlined">add_home</span> List Your Property</Link>
            <Link href="/contact" className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary/5 transition-colors">Get Free Valuation</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-6">
          {[
            { icon: 'group', num: '2L+', label: 'Active Buyers' },
            { icon: 'verified', num: '98%', label: 'Success Rate' },
            { icon: 'timer', num: '15 Days', label: 'Avg Sale Time' },
            { icon: 'support_agent', num: '24/7', label: 'Seller Support' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-outline-variant text-center hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-primary text-4xl mb-3">{stat.icon}</span>
              <p className="font-extrabold text-2xl text-on-background">{stat.num}</p>
              <p className="text-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* How it works */}
      <section className="py-16">
        <h2 className="font-bold text-headline-lg text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[
            { step: '01', title: 'List Your Property', desc: 'Add photos, details, and set your price. Our team optimizes your listing for maximum visibility.', icon: 'edit_note' },
            { step: '02', title: 'Get Verified Leads', desc: 'We connect you with serious, pre-verified buyers who match your property profile.', icon: 'people' },
            { step: '03', title: 'Close the Deal', desc: 'Our legal team assists with documentation, registration, and smooth handover.', icon: 'handshake' },
          ].map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-8 bg-white rounded-3xl border border-outline-variant hover:-translate-y-1 transition-all">
              <span className="text-7xl font-extrabold text-primary/10 absolute top-4 right-6">{item.step}</span>
              <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center text-white mb-6"><span className="material-symbols-outlined text-2xl">{item.icon}</span></div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-on-surface-variant">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
