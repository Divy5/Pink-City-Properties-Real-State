'use client';
import { banks } from '@/data';
import { useParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function BankDetailPage() {
  const { bankName } = useParams();
  const bank = banks.find(b => b.id === bankName);
  const [applyForm, setApplyForm] = useState({ employment: 'Salaried', income: '', emis: '', amount: '' });
  const [applied, setApplied] = useState(false);
  const { requireAuth, addLoanApplication } = useAuth();
  const pathname = usePathname();

  if (!bank) return <div className="py-40 text-center text-2xl text-slate-500">Bank not found</div>;

  const handleApply = (e) => {
    e.preventDefault();
    if (requireAuth(pathname)) {
      addLoanApplication(
        bank.id,
        bank.name,
        applyForm.employment,
        applyForm.income,
        applyForm.emis,
        applyForm.amount
      );
      setApplied(true);
    }
  };

  const handleApplyClick = (e) => {
    if (!requireAuth(pathname)) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <Link href="/home-loans" className="text-primary font-bold flex items-center gap-1 mb-6 hover:underline">
        <span className="material-symbols-outlined">arrow_back</span> All Banks
      </Link>

      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden rounded-[32px] bg-slate-900 mb-16 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white mb-6 border border-white/20">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-sm font-bold">Official Banking Partner</span>
          </div>
          <h1 className="text-4xl md:text-display-xl font-extrabold text-white mb-6">{bank.name} <br /><span className="text-accent">Home Loans</span></h1>
          <p className="text-body-lg text-slate-300 max-w-xl mb-8">Turn your dream of owning a home in Jaipur into reality with competitive interest rates and transparent processing.</p>
          <div className="flex flex-wrap gap-8">
            <div><p className="text-slate-400 text-sm mb-1">Interest Starts From</p><p className="text-2xl font-bold text-white">{bank.interestRate} p.a.</p></div>
            <div className="w-px h-12 bg-white/20" />
            <div><p className="text-slate-400 text-sm mb-1">Processing Fee</p><p className="text-2xl font-bold text-white">{bank.processingFee}</p></div>
            <div className="w-px h-12 bg-white/20" />
            <div><p className="text-slate-400 text-sm mb-1">Max Tenure</p><p className="text-2xl font-bold text-white">{bank.maxTenure}</p></div>
          </div>
        </div>
        <div className="w-full max-w-md z-10">
          <div className="glass-card p-8 rounded-[32px] border border-white/30 shadow-2xl bg-white/5 backdrop-blur-xl">
            <h3 className="font-bold text-xl mb-6 text-white">Check Eligibility</h3>
            {applied ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-5xl text-green-400 mb-4 animate-bounce">check_circle</span>
                <p className="font-bold text-white mb-2">Application Submitted!</p>
                <p className="text-xs text-slate-300">Track status timeline in your Dashboard Loans tab.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <select className="w-full bg-white/10 text-white rounded-xl p-4 border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none appearance-none" value={applyForm.employment} onChange={e => setApplyForm({ ...applyForm, employment: e.target.value })}>
                  <option className="text-slate-900">Salaried</option><option className="text-slate-900">Self-Employed</option><option className="text-slate-900">Business Owner</option>
                </select>
                <input required className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl p-4 border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Required Loan Amount (₹) *" type="number" value={applyForm.amount} onChange={e => setApplyForm({ ...applyForm, amount: e.target.value })} />
                <input required className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl p-4 border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Monthly Net Income (₹) *" type="number" value={applyForm.income} onChange={e => setApplyForm({ ...applyForm, income: e.target.value })} />
                <input className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl p-4 border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Current Monthly EMIs (₹)" type="number" value={applyForm.emis} onChange={e => setApplyForm({ ...applyForm, emis: e.target.value })} />
                <button type="submit" onClick={handleApplyClick} className="w-full accent-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all mt-4">Check Eligibility</button>
              </form>
            )}
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <h2 className="font-bold text-headline-lg mb-8">Interest Rate Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-16">
        {bank.products.map(prod => (
          <div key={prod.name} className={`p-8 rounded-[24px] border ${prod.popular ? 'border-2 border-primary/20 bg-primary/5' : 'border-outline-variant bg-white'} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg">{prod.name}</h4>
              {prod.popular && <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">POPULAR</span>}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-primary">{prod.rate}</span>
              <span className="text-xs font-bold bg-surface-container text-on-surface-variant px-2 py-1 rounded mb-1">{prod.type}</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">{prod.desc}</p>
          </div>
        ))}
      </div>

      {/* Documents */}
      <h2 className="font-bold text-headline-lg mb-8">Required Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">
        {[
          { title: 'Identity & Address', docs: ['PAN Card (Mandatory)', 'Aadhaar Card / Voter ID', 'Passport Size Photographs'] },
          { title: 'Income Proof', docs: ['Last 3 Months Salary Slips', 'Form-16 for last 2 years', '6 Months Bank Statement'] },
          { title: 'Property Docs', docs: ['Sale Agreement', 'Approved Plan Copy', 'No Objection Certificate'] },
        ].map(section => (
          <div key={section.title} className="bg-white p-6 rounded-3xl border border-outline-variant/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/30 pb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h5 className="font-bold text-lg">{section.title}</h5>
            </div>
            <ul className="space-y-4">
              {section.docs.map(doc => (
                <li key={doc} className="flex gap-3 text-sm text-on-surface-variant items-start">
                  <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5 shrink-0">check_circle</span>
                  <span className="leading-snug">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
