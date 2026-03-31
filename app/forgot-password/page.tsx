'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PenTool, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-24 pb-12 flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ink-accent/5 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block p-4 bg-ink-900/50 rounded-full border border-white/5 mb-4 group hover:border-ink-accent/50 transition-colors">
            <PenTool className="w-8 h-8 text-ink-accent group-hover:rotate-12 transition-transform" />
          </Link>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="bg-ink-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <p className="text-white font-bold text-lg">Check your inbox</p>
              <p className="text-gray-400 text-sm">
                A password reset link has been sent to <span className="text-white">{email}</span>. It may take a minute to arrive.
              </p>
              <Link href="/login" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-ink-accent hover:text-white transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-ink-accent text-ink-950 font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-ink-accent font-bold hover:text-white transition-colors ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
