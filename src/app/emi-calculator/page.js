'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const r = interestRate / 12 / 100;
  const n = tenure * 12;
  const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <h1 className="font-jakarta font-extrabold text-display-xl mb-4">EMI <span className="text-gradient">Calculator</span></h1>
        <p className="text-body-lg text-on-surface-variant">Plan your home loan EMI for properties in Jaipur</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-8 md:p-12 border border-outline-variant shadow-xl">
        <div className="space-y-10">
          <div>
            <div className="flex justify-between mb-3"><label className="font-bold">Loan Amount</label><span className="font-extrabold text-primary">{formatCurrency(loanAmount)}</span></div>
            <input type="range" min="500000" max="100000000" step="100000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹5 L</span><span>₹10 Cr</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-3"><label className="font-bold">Interest Rate (% p.a.)</label><span className="font-extrabold text-primary">{interestRate}%</span></div>
            <input type="range" min="5" max="20" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5%</span><span>20%</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-3"><label className="font-bold">Loan Tenure (Years)</label><span className="font-extrabold text-primary">{tenure} yrs</span></div>
            <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 yr</span><span>30 yrs</span></div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="accent-gradient rounded-2xl p-6 text-white text-center">
              <p className="text-sm opacity-80 mb-2">Monthly EMI</p>
              <p className="text-3xl font-extrabold">{formatCurrency(emi)}</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-6 text-center">
              <p className="text-sm text-on-surface-variant mb-2">Total Interest</p>
              <p className="text-2xl font-extrabold text-secondary">{formatCurrency(totalInterest)}</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-6 text-center">
              <p className="text-sm text-on-surface-variant mb-2">Total Payment</p>
              <p className="text-2xl font-extrabold">{formatCurrency(totalPayment)}</p>
            </div>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="mt-8">
          <p className="text-sm font-bold mb-3">Payment Breakdown</p>
          <div className="w-full h-6 rounded-full overflow-hidden flex">
            <div className="bg-primary h-full" style={{ width: `${(loanAmount / totalPayment) * 100}%` }} />
            <div className="bg-secondary h-full" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} />
          </div>
          <div className="flex gap-6 mt-3 text-sm">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" />Principal</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" />Interest</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
