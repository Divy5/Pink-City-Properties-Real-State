'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { banks } from '@/data';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function HomeLoansPage() {
  const { requireAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleAction = (e, bankId) => {
    e.preventDefault();
    if (requireAuth(pathname)) {
      router.push(`/bank/${bankId}`);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
        <h1 className="font-jakarta font-extrabold text-display-xl mb-4">Home <span className="text-gradient">Loans</span></h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">Compare the best home loan offers from India&apos;s top banks. Exclusive rates for Jaipur properties.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-16">
        {banks.map((bank, i) => (
          <motion.div key={bank.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="block bg-white rounded-[24px] p-8 border border-outline-variant/30 hover:-translate-y-2 hover:shadow-xl transition-all group h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-xl" style={{ background: bank.color }}>{bank.shortName[0]}</div>
                <h3 className="font-bold text-xl mb-1">{bank.shortName}</h3>
                <p className="text-sm text-slate-500 mb-4">{bank.name}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Interest From</span><span className="font-bold text-primary">{bank.interestRate}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Processing</span><span className="font-bold text-sm">{bank.processingFee}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-slate-400">Max Tenure</span><span className="font-bold text-sm">{bank.maxTenure}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={(e) => handleAction(e, bank.id)} className="flex-1 py-3 accent-gradient text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">Apply Now</button>
                <button onClick={(e) => handleAction(e, bank.id)} className="flex-1 py-3 border-2 border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary/5 active:scale-95 transition-all">Check Limit</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMI Calculator Link */}
      <div className="text-center">
        <Link href="/emi-calculator" prefetch={true} className="inline-flex items-center gap-3 px-10 py-5 accent-gradient text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all">
          <span className="material-symbols-outlined">calculate</span> Try EMI Calculator
        </Link>
      </div>
    </div>
  );
}
