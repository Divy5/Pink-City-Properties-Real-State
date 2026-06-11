'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="w-full rounded-t-[48px] bg-slate-900 text-slate-300 border-t border-slate-800 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-20">
        
        {/* Core footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 border-b border-slate-800 pb-16">
          
          {/* Brand & Socials Column */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-2xl font-black bg-gradient-to-r from-white to-accent bg-clip-text text-transparent font-jakarta tracking-tight">
              Pink City Properties
            </span>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              Curating high-ROI luxury residences, premium commercial suites, and strategic investment land plots in the heart of Rajasthan since 2024.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'public', name: 'Web', href: '/' },
                { icon: 'share', name: 'Twitter', href: '#' },
                { icon: 'mail', name: 'Email', href: '/contact' },
                { icon: 'chat', name: 'WhatsApp', href: '#' }
              ].map(social => (
                <a 
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-secondary hover:border-transparent transition-all flex items-center justify-center shadow hover:scale-105 active:scale-95"
                  title={social.name}
                >
                  <span className="material-symbols-outlined text-[18px]">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Directory column: Locations */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Top Localities</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              {['Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Malviya Nagar', 'Jagatpura', 'Ajmer Road'].map(l => (
                <li key={l}>
                  <Link className="hover:text-accent transition-colors" href="/buy">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory column: Company */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Company</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              {['About Jaipur', 'Privacy Policy', 'Terms of Registry', 'Careers Support', 'Client Testimonials', 'Contact Us'].map(l => (
                <li key={l}>
                  <Link className="hover:text-accent transition-colors" href="/contact">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory column: Services */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Services</h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li><Link className="hover:text-accent transition-colors" href="/home-loans">Home Loans</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/emi-calculator">EMI Calculator</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/conversion-calculator">Area Converter</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/area-calculator">Super Area Calculator</Link></li>
              <li><Link className="hover:text-accent transition-colors" href="/sell">Seller Listing Plans</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription column */}
          <div className="lg:col-span-1 space-y-4">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Newsletter</h5>
            <p className="text-[11px] text-slate-400 font-semibold leading-normal">Subscribe to get monthly registry guides and off-market Jaipur hot deals.</p>
            
            {subscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1 }} className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-[10px] font-bold text-center">
                Subscribed successfully!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input 
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-secondary transition-all font-semibold"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow hover:opacity-95 active:scale-95 transition-all cursor-pointer">
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 text-xs font-semibold text-slate-500">
          <p>© 2026 Pink City Properties. Curated Luxury in the Heart of Rajasthan.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-slate-500">location_on</span> WTP Campus, JLN Marg, Jaipur, RJ 302017</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-slate-500">call</span> +91 141 2345 678</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
