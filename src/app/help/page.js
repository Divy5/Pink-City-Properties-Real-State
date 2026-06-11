'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { icon: 'home', title: 'Buying Guide', desc: 'Everything from property visits to final registration in Jaipur\'s prime areas.', color: 'bg-primary-fixed', iconColor: 'text-primary' },
  { icon: 'sell', title: 'Selling Tips', desc: 'Maximize your property value in Vaishali Nagar and Malviya Nagar markets.', color: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
  { icon: 'payments', title: 'Loan Assistance', desc: 'Exclusive home loan rates from leading banks for Rajasthan residents.', color: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  { icon: 'person', title: 'Account Management', desc: 'Manage your listings, saved properties, and premium membership settings.', color: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
];

const faqs = [
  { q: 'How do I verify a property listing\'s RERA status?', a: 'All premium listings on Pink City Properties are pre-verified. You can also visit the Rajasthan RERA portal and enter the registration number provided in the listing details.' },
  { q: 'What are the closing costs for property in Jaipur?', a: 'Closing costs typically include stamp duty (approx 6-8%), registration fees (1%), and professional legal fees. Costs vary slightly for female buyers in Rajasthan.' },
  { q: 'Can I list my property for free?', a: 'Yes, owners can list up to 2 properties for free. Premium packages are available for agents and those wanting faster visibility in high-demand areas like C-Scheme.' },
];

export default function HelpPage() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Hero */}
      <section className="pt-16 pb-12 px-6 md:px-gutter">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          <h1 className="font-jakarta font-extrabold text-display-xl mb-6">How can we help you find your <span className="text-gradient">Pink City Home?</span></h1>
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full pl-16 pr-8 py-5 rounded-2xl glass-panel shadow-lg focus:ring-2 focus:ring-primary text-body-lg outline-none" placeholder="Search for FAQs, guides, or help topics..." />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="text-label-bold text-outline uppercase tracking-wider">Popular:</span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer hover:bg-primary-container hover:text-white transition-colors">Mansarovar Property Rates</span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer hover:bg-primary-container hover:text-white transition-colors">Home Loan Eligibility</span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer hover:bg-primary-container hover:text-white transition-colors">Stamp Duty in Rajasthan</span>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 md:px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative p-8 rounded-[32px] bg-white border border-outline-variant hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg">
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6`}>
                <span className={`material-symbols-outlined ${cat.iconColor} text-3xl`}>{cat.icon}</span>
              </div>
              <h3 className="font-bold text-xl mb-2">{cat.title}</h3>
              <p className="text-on-surface-variant mb-6">{cat.desc}</p>
              <span className="text-primary font-bold flex items-center gap-1">Explore <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-6 md:px-gutter bg-surface-container-low rounded-[40px] mx-4 md:mx-10 mb-12">
        <div className="flex flex-col lg:flex-row gap-12 p-4 md:p-10">
          <div className="lg:w-1/3">
            <h2 className="font-bold text-headline-lg mb-4">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant text-body-lg mb-6">Quick answers to common questions about real estate in the Pink City.</p>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant">
              <p className="font-bold text-primary mb-2">Did not find your answer?</p>
              <p className="text-sm text-on-surface-variant mb-4">Our property experts are available 10 AM to 7 PM IST.</p>
              <Link href="/contact" className="block w-full text-center bg-surface-container-highest text-on-surface font-bold py-3 rounded-2xl hover:bg-primary hover:text-white transition-all">Contact Support</Link>
            </div>
          </div>
          <div className="lg:w-2/3 space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="bg-white p-6 rounded-2xl border border-outline-variant">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">help_outline</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                    <p className="text-on-surface-variant">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 md:px-gutter text-center mb-12">
        <div className="max-w-4xl mx-auto p-16 rounded-[48px] accent-gradient text-white relative overflow-hidden shadow-2xl">
          <h2 className="font-extrabold text-display-xl mb-4">Need expert advice?</h2>
          <p className="text-body-lg opacity-90 max-w-2xl mx-auto mb-10">Connect with our Rajasthan property specialists for a personalized consultation.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-white text-primary font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">chat</span> Chat with Expert
            </Link>
            <button className="border-2 border-white/40 text-white font-bold px-10 py-5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">call</span> Schedule a Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
