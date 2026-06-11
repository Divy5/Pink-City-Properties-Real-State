import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PropertyProvider } from '@/context/PropertyContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pink City Properties | Premium Real Estate in Jaipur',
  description: 'Discover hand-picked luxury residences...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-jakarta text-on-background">
        <AuthProvider>
          <PropertyProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
