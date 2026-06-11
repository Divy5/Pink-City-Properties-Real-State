'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const conversions = {
  'sq ft': { 'sq ft': 1, 'sq yard': 0.1111, 'sq meter': 0.0929 },
  'sq yard': { 'sq ft': 9, 'sq yard': 1, 'sq meter': 0.8361 },
  'sq meter': { 'sq ft': 10.7639, 'sq yard': 1.19599, 'sq meter': 1 },
};

export default function ConversionCalculatorPage() {
  const [value, setValue] = useState(1000);
  const [from, setFrom] = useState('sq ft');
  const [to, setTo] = useState('sq yard');

  const result = value * (conversions[from]?.[to] || 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <h1 className="font-jakarta font-extrabold text-display-xl mb-4">Conversion <span className="text-gradient">Calculator</span></h1>
        <p className="text-body-lg text-on-surface-variant">Convert between sq ft, sq yard, and sq meter</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-8 md:p-12 border border-outline-variant shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold mb-2">Value</label>
            <input type="number" className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold" value={value} onChange={e => setValue(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">From</label>
            <select className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold" value={from} onChange={e => setFrom(e.target.value)}>
              <option value="sq ft">Square Feet</option>
              <option value="sq yard">Square Yard</option>
              <option value="sq meter">Square Meter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">To</label>
            <select className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold" value={to} onChange={e => setTo(e.target.value)}>
              <option value="sq ft">Square Feet</option>
              <option value="sq yard">Square Yard</option>
              <option value="sq meter">Square Meter</option>
            </select>
          </div>
        </div>

        <div className="mt-10 accent-gradient rounded-2xl p-8 text-white text-center">
          <p className="text-sm opacity-80 mb-2">Result</p>
          <p className="text-4xl font-extrabold">{result.toFixed(2)} {to}</p>
          <p className="text-sm mt-2 opacity-70">{value} {from} = {result.toFixed(2)} {to}</p>
        </div>

        {/* Quick reference table */}
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4">Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-outline-variant"><th className="text-left py-3 px-4">Unit</th><th className="text-right py-3 px-4">Sq Ft</th><th className="text-right py-3 px-4">Sq Yard</th><th className="text-right py-3 px-4">Sq Meter</th></tr></thead>
              <tbody>
                <tr className="border-b border-outline-variant/30"><td className="py-3 px-4 font-bold">1 Sq Ft</td><td className="text-right py-3 px-4">1</td><td className="text-right py-3 px-4">0.1111</td><td className="text-right py-3 px-4">0.0929</td></tr>
                <tr className="border-b border-outline-variant/30"><td className="py-3 px-4 font-bold">1 Sq Yard</td><td className="text-right py-3 px-4">9</td><td className="text-right py-3 px-4">1</td><td className="text-right py-3 px-4">0.8361</td></tr>
                <tr><td className="py-3 px-4 font-bold">1 Sq Meter</td><td className="text-right py-3 px-4">10.76</td><td className="text-right py-3 px-4">1.196</td><td className="text-right py-3 px-4">1</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
