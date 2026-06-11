'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { login, signup, user, loginWithGoogle, loginWithApple, getRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(getRedirectPath());
    }
  }, [user, router, getRedirectPath]);

  if (user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const success = signup(form.name, form.email, form.password);
      if (!success) setError('Failed to sign up');
    } else {
      const success = login(form.email, form.password);
      if (!success) setError('Failed to log in');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-container-low -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px]" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-white/40 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-tertiary/10 mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">
                {isSignup ? 'person_add' : 'lock'}
              </span>
            </div>
            <h1 className="font-jakarta font-extrabold text-3xl mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-on-surface-variant">{isSignup ? 'Join Pink City Properties to unlock premium features' : 'Sign in to manage your properties and leads'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}
            
            {isSignup && (
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input required className="w-full h-14 pl-12 pr-4 rounded-xl border border-outline-variant bg-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input required type="email" className="w-full h-14 pl-12 pr-4 rounded-xl border border-outline-variant bg-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="hello@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                {!isSignup && <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                <input required type="password" className="w-full h-14 pl-12 pr-4 rounded-xl border border-outline-variant bg-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                  <input required type="password" className="w-full h-14 pl-12 pr-4 rounded-xl border border-outline-variant bg-white/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>
            )}
            
            <button type="submit" className="w-full accent-gradient text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-6">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button onClick={loginWithGoogle} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-white hover:bg-slate-50 font-bold text-slate-700 transition-all hover:shadow-md">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" /> Google
            </button>
            <button onClick={loginWithApple} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-white hover:bg-slate-50 font-bold text-slate-700 transition-all hover:shadow-md">
              <span className="material-symbols-outlined text-xl">apple</span> Apple
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-slate-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-primary font-bold ml-1 hover:underline">
              {isSignup ? 'Sign in instead' : 'Create one now'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
