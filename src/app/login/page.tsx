'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      // Success: useEffect will handle redirect
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Success: useEffect will handle redirect
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError(err.message || 'Google authentication failed. Please try again or use email.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full mx-4 z-10"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-6"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold px-4 py-1 border border-accent/20 rounded-full">
                Maison Access
              </span>
            </motion.div>
            <h2 className="text-4xl font-bold text-white italic font-serif tracking-tighter">
              Welcome <span className="text-accent">Home</span>
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
              Access your 2026 collection sanctuary
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[8px] uppercase tracking-widest text-center font-bold mb-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <div className="relative group/field">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-accent transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative group/field">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-accent transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium"
                  placeholder="Security Key"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-accent transition-colors font-bold">
                Recovery?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-accent text-luxury py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-accent/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-luxury/20 border-t-luxury rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10">
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em]">
                <span className="px-4 bg-transparent text-gray-600 font-bold">Network Access</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white transition-all"
              >
                <Globe size={16} className="text-accent" />
                Sign in with Google
              </motion.button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              New to the heritage?{' '}
              <Link href="/signup" className="text-accent hover:text-white transition-colors">
                Apply for Access
              </Link>
            </p>
          </div>
        </div>

        {/* Brand Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-[8px] uppercase tracking-[0.5em] text-gray-600">
            &copy; 2026 Maison Resorts. The Art of Arrival.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
