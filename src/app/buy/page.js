import BuyClient from './BuyClient';
import { Suspense } from 'react';

export async function generateMetadata({ searchParams }) {
  const location = searchParams?.location;
  if (location) {
    // Capitalize first letter for each word in location
    const locName = location.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      title: `Buy Properties in ${locName} Jaipur`,
      description: `Find the best properties for sale in ${locName}, Jaipur. Explore flats, villas, plots and commercial spaces in ${locName}.`,
    };
  }
  return {
    title: 'Buy Properties in Jaipur',
    description: 'Find your dream home in Jaipur\'s most premium locations.',
  };
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-xl animate-pulse font-bold text-slate-500">Loading Properties...</p></div>}>
      <BuyClient />
    </Suspense>
  );
}
