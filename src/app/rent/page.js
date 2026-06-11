import RentClient from './RentClient';
import { Suspense } from 'react';

export default function RentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <p className="text-xl animate-pulse font-bold text-slate-500">Loading Jaipur Properties...</p>
      </div>
    }>
      <RentClient />
    </Suspense>
  );
}
