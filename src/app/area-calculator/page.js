'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AreaCalculatorPage() {
  const [length, setLength] = useState(40);
  const [width, setWidth] = useState(30);
  const [unit, setUnit] = useState('ft');
  const area = length * width;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <h1 className="font-jakarta font-extrabold text-display-xl mb-4">Area <span className="text-gradient">Calculator</span></h1>
        <p className="text-body-lg text-on-surface-variant">Calculate property area by length × width</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-8 md:p-12 border border-outline-variant shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold mb-2">Length</label>
            <input type="number" className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold" value={length} onChange={e => setLength(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Width</label>
            <input type="number" className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold" value={width} onChange={e => setWidth(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Unit</label>
            <select className="w-full h-14 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold" value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="ft">Feet</option><option value="m">Meters</option><option value="yd">Yards</option>
            </select>
          </div>
        </div>
        <div className="mt-10 accent-gradient rounded-2xl p-8 text-white text-center">
          <p className="text-sm opacity-80 mb-2">Total Area</p>
          <p className="text-4xl font-extrabold">{area.toLocaleString()} sq {unit}</p>
          <p className="text-sm mt-2 opacity-70">{length} × {width} = {area.toLocaleString()} sq {unit}</p>
        </div>
        {/* Visual representation */}
        <div className="mt-10 flex justify-center">
          <div className="border-2 border-dashed border-primary/40 rounded-2xl p-8 relative" style={{ width: Math.min(300, length * 3), height: Math.min(200, width * 3) }}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">{length} {unit}</div>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-sm font-bold text-primary rotate-90">{width} {unit}</div>
            <div className="w-full h-full bg-primary/5 rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-lg">{area} sq {unit}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
