'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { PenTool, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      router.push('/'); // Redirect to home on success
    } catch (err) {
      setError('Invalid email or password. Try "admin@inksmith.com" for admin access.');
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-24 pb-12 flex items-center justify-center px-4">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ink-accent/5 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block p-4 bg-ink-900/50 rounded-full border border-white/5 mb-4 group hover:border-ink-accent/50 transition-colors">
            <PenTool className="w-8 h-8 text-ink-accent group-hover:rotate-12 transition-transform" />
          </Link>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to access your appointments and history.</p>
        </div>

        {/* Form Card */}
        <div className="bg-ink-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-start gap-3 text-sm text-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-ink-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink-950/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-ink-accent outline-none transition-all placeholder-gray-600"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                <a href="#" className="text-xs text-ink-accent hover:text-white transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-ink-accent transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ink-950/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-ink-accent outline-none transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-ink-accent text-ink-950 font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-ink-accent font-bold hover:text-white transition-colors ml-1">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">
             For demo: User <span className="text-gray-500 font-mono">user@test.com</span> | Admin <span className="text-gray-500 font-mono">admin@inksmith.com</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;