'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LeasePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpXWCD2zYMYRJ0WYB4e-zjCMcGO55AF8fI7gCM2cXfzQp_VciDzFNBHkcZXrXM28_X9fTtBaWaJX0ftrtagodNqaRo1-SGcPoaTFd2hDxqSg3jLfzet_Wg1y3skIxSvrtxfrnswZ6_UDFs1jnmJfVzHgpmS6NqKyWfSQyS-DidkugnJwhmyWt2lHfDmU6VuS5NQDgj03uovYMjcqBM9yfE30pbF11PglGi-5HF3LBGFOoTyROy4WkumXHve-MpxCNYcTumHY5XpNs" alt="Lease" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container text-white font-bold mb-6">PREMIUM LEASING HUB</span>
            <h1 className="font-extrabold text-display-xl text-white mb-6">Curated Commercial &amp; Residential Leases</h1>
            <p className="text-body-lg text-white/80 mb-8">Secure your next business headquarters or luxury residence in Rajasthan&apos;s most prestigious locations.</p>
            <div className="glass-card p-2 rounded-2xl inline-flex items-center gap-2">
              <input className="bg-transparent border-none focus:ring-0 text-on-background w-64 px-4" placeholder="Search by area (e.g. C-Scheme)..." />
              <button className="px-6 py-3 accent-gradient text-white rounded-xl font-bold">Search Now</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Chips */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 -mt-8 relative z-20">
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-xl border border-outline-variant/30">
          {[{ icon: 'corporate_fare', label: 'Corporate Office' }, { icon: 'apartment', label: 'Luxury Villa' }, { icon: 'storefront', label: 'Retail Space' }, { icon: 'warehouse', label: 'Industrial' }, { icon: 'hotel', label: 'Serviced Apt' }].map(cat => (
            <button key={cat.label} className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold flex items-center gap-2 hover:scale-105 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Leases */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-20">
        <h2 className="font-bold text-headline-lg mb-4">Signature Listings</h2>
        <p className="text-on-surface-variant mb-12">Exclusive opportunities in Jaipur&apos;s prime business districts.</p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Large Card */}
          <div className="md:col-span-8 group">
            <div className="relative overflow-hidden rounded-[32px] h-[400px] md:h-[500px] premium-border transition-all duration-300 hover:-translate-y-1">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUw8LVvtMcg1Lho8Pb1ob-v7CiyeYZ6cHPTVZi49S9ZRE-Log1svXzmgBC0DLPp1_1dMZMTSXYqocbGFHJePj1ZFBeDNJsbKnFA-rGAEAdQIUmpHo5rU0iyYxz3gWP_266X4UVswOQNJtkgioHeHvbi6A8_kV0yDjCQnfuGurKpl1BZZsaxh699vAEonFAeyG7Tn5y9whVURGZRKi9FgGBV_WKNx2yDWQJK2JDRiAdYW8P9NC2w94c4GqTepRGFJNfQtEBLpRqPxk" alt="Corporate Office" loading="lazy" />
              <div className="absolute top-6 left-6"><span className="bg-tertiary text-white px-4 py-1 rounded-full font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined text-sm">stars</span> Featured</span></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-on-background/90 to-transparent">
                <div className="flex justify-between items-end">
                  <div><h3 className="text-white font-bold text-headline-md mb-2">The Hub: Vaishali Nagar</h3><p className="text-white/70 flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-lg">location_on</span> Main Queens Road, Vaishali Nagar</p><div className="flex gap-4"><span className="glass-card px-3 py-1 rounded-lg text-white text-sm">4,500 Sq.Ft</span><span className="glass-card px-3 py-1 rounded-lg text-white text-sm">Corporate Ready</span></div></div>
                  <div className="text-right"><div className="text-white font-extrabold text-2xl">₹4.2 L <span className="text-sm font-normal">/month</span></div><button className="mt-4 px-6 py-3 accent-gradient text-white rounded-xl font-bold shadow-lg">Lease Terms</button></div>
                </div>
              </div>
            </div>
          </div>
          {/* Side Cards */}
          <div className="md:col-span-4 flex flex-col gap-gutter">
            <div className="glass-card rounded-[32px] overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-all">
              <div className="h-48 relative"><img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkQGJJE73o_rYfvCeAY-4eYqLgMN20hcxQXEYD2qJgofRsz8BuNAXkXSVzF4ZYcEkP8V45lX-SGyKGofKEWX5Pvp8yI_7zdAM2xSFIgErQ4j3MuykgMfFRe09ZfhOQeJ2aqVI8IcDTNFIWiRcP-PZEzYS-cBXNFAyA8yv-pi8ze-3waMDAETxwQOF_zZM2_9bacKYtK5LGYfD2ER18_tu-9WPWoUc0aqRTydCwXuUIdrUGXYDHamfSUxNr-gh2jyzMM-AL4AgX--w" alt="Penthouse" loading="lazy" /><div className="absolute bottom-4 left-4"><span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-bold text-primary text-sm">₹85k /mo</span></div></div>
              <div className="p-6"><h4 className="font-bold text-lg mb-2">The Penthouse: C-Scheme</h4><p className="text-on-surface-variant text-sm mb-4">Modern 3BHK with panoramic views.</p><button className="w-full py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">Corporate Booking</button></div>
            </div>
            <div className="glass-card rounded-[32px] overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-all">
              <div className="h-48 relative"><img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgzblW9EM9b8HayqLTa0SiP0SvNa-YRg0vzJBpcJFWNxyD41yRjVAni59SK1pfvBL4N28zAHKw72v2FxEkNA8SdGU69iBgwS35OVGwgbyEYHf3DFMHRU9s0vHuNpdT3ee_FUnQSrUlhPUvedILYJIyod1RDAKVthLDS-flGS8naymx6BZb0yAKsUTd3tW0kREDOW1l9KEMwL8O6g-mj4zW3Jqj6xP65mkgtGhVzjwJHmCOm_IEpw4HR_E-DV-a8GfyO6wwSKxDw0g" alt="Co-working" loading="lazy" /><div className="absolute bottom-4 left-4"><span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-bold text-primary text-sm">₹15k /seat</span></div></div>
              <div className="p-6"><h4 className="font-bold text-lg mb-2">Ignite Hub: Malviya Nagar</h4><p className="text-on-surface-variant text-sm mb-4">Flexible desk options for startups.</p><div className="flex gap-2"><button className="flex-1 py-2 bg-surface-container-high rounded-lg font-bold text-sm">Details</button><button className="flex-1 py-2 accent-gradient text-white rounded-lg font-bold text-sm">Inquire</button></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-10 text-center">
        <h2 className="font-bold text-headline-lg mb-4">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Our commercial agents can source bespoke off-market spaces tailored to your needs.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="px-8 py-4 accent-gradient text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"><span className="material-symbols-outlined">call</span> Schedule Consultation</Link>
          <Link href="/buy" className="px-8 py-4 bg-white text-on-surface border-2 border-outline-variant rounded-2xl font-bold hover:bg-surface-container-low transition-colors">Browse Full Catalog</Link>
        </div>
      </section>
    </>
  );
}
