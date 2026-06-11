'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', propertyRef: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { requireAuth } = useAuth();
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth(pathname)) return;
    setIsSending(true);

    try { 
      await fetch('/api/leads', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      }); 
    } catch (err) { /* ignore */ }
    
    // Simulate premium submit delay
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
    }, 1200);
  };

  const handleLeadClick = (e) => {
    if (!requireAuth(pathname)) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-16 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Info Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-8"
        >
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest inline-block mb-3">
              Contact Center
            </span>
            <h1 className="font-jakarta font-extrabold text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-slate-500 font-semibold text-sm leading-relaxed mt-2">
              Our real estate investment advisors are available 24/7 to assist you with acquiring, selling, or leasing luxury properties in Jaipur.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {[
              { icon: 'location_on', title: 'Jaipur HQ', desc: 'Opposite World Trade Park, JLN Marg, Jaipur, Rajasthan 302017' },
              { icon: 'phone', title: 'Advisory Phone', desc: '+91 141 2345 678' },
              { icon: 'mail', title: 'Support Email', desc: 'hello@pinkcityproperties.in' },
              { icon: 'schedule', title: 'Business Hours', desc: 'Monday - Saturday: 10:00 AM - 7:00 PM IST' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-base font-bold">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{item.title}</h3>
                  <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Form Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-white rounded-2xl p-8 md:p-10 border border-slate-200/80 shadow-xl relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-md animate-bounce">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h2 className="font-jakarta font-extrabold text-3xl text-slate-900 leading-none">Message Enrolled!</h2>
                  <p className="text-slate-500 font-semibold text-sm max-w-sm mx-auto">Your inquiry has been successfully parsed. Our Jaipur advisor will contact you within 2-4 hours.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-jakarta font-extrabold text-2xl text-slate-800">Send us a message</h2>
                  <p className="text-slate-400 font-bold text-xs mt-0.5">We usually respond within a few hours.</p>
                </div>

                {/* Floating Input 1: Name */}
                <div className="relative w-full">
                  <input 
                    type="text" 
                    required 
                    id="contact-name"
                    className="peer w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold text-slate-800 placeholder-transparent pt-3.5"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none text-lg">person</span>
                  <label 
                    htmlFor="contact-name"
                    className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-3.5 peer-focus:text-[9px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    Full Name *
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Floating Input 2: Email */}
                  <div className="relative w-full">
                    <input 
                      type="email" 
                      required 
                      id="contact-email"
                      className="peer w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold text-slate-800 placeholder-transparent pt-3.5"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none text-lg">mail</span>
                    <label 
                      htmlFor="contact-email"
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-3.5 peer-focus:text-[9px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[9px]"
                    >
                      Email Address *
                    </label>
                  </div>

                  {/* Floating Input 3: Phone */}
                  <div className="relative w-full">
                    <input 
                      type="tel" 
                      required
                      id="contact-phone"
                      className="peer w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold text-slate-800 placeholder-transparent pt-3.5"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none text-lg">phone</span>
                    <label 
                      htmlFor="contact-phone"
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-3.5 peer-focus:text-[9px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[9px]"
                    >
                      Phone Number *
                    </label>
                  </div>
                </div>

                {/* Floating Input 4: Property Reference */}
                <div className="relative w-full">
                  <input 
                    type="text" 
                    id="contact-property-ref"
                    className="peer w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold text-slate-800 placeholder-transparent pt-3.5"
                    placeholder="Property Reference (e.g. Opal Heights)"
                    value={form.propertyRef}
                    onChange={e => setForm({ ...form, propertyRef: e.target.value })}
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none text-lg">link</span>
                  <label 
                    htmlFor="contact-property-ref"
                    className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-3.5 peer-focus:text-[9px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    Property Reference (Optional)
                  </label>
                </div>

                {/* Floating Input 5: Message Textarea */}
                <div className="relative w-full">
                  <textarea 
                    required
                    id="contact-message"
                    className="peer w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all text-xs font-bold text-slate-800 min-h-[140px] resize-none placeholder-transparent pt-6"
                    placeholder="Your inquiry details..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                  <span className="material-symbols-outlined absolute left-4 top-5 text-slate-400 select-none pointer-events-none text-lg">chat</span>
                  <label 
                    htmlFor="contact-message"
                    className="absolute left-12 top-5 text-slate-400 text-xs font-bold pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px]"
                  >
                    Inquiry Message *
                  </label>
                </div>

                <button 
                  type="submit" 
                  onClick={handleLeadClick} 
                  disabled={isSending}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white py-4 rounded-xl font-extrabold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {isSending ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
