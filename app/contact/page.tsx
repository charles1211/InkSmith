'use client';

import { useState } from 'react';
import { Phone, MapPin, Send, ExternalLink, Clock, Instagram, Facebook, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send message.');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = (name: string) =>
    `w-full bg-ink-800/50 px-5 py-4 text-white text-sm rounded-xl outline-none
     transition-all duration-300 placeholder:text-white/20 border
     ${focusedField === name
       ? 'border-ink-accent shadow-[0_0_0_3px_rgba(212,175,55,0.10)]'
       : 'border-white/8 hover:border-white/20'
     }`;

  return (
    <div className="min-h-screen bg-ink-950 text-white relative overflow-hidden">

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[800px] h-[800px] bg-ink-accent/[0.025] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -left-32 w-[700px] h-[700px] bg-blue-900/[0.035] rounded-full blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        {/* Noise grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* ── HERO HEADER ── */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">

        {/* Ghost watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span
            className="font-serif font-black text-white/[0.012] uppercase tracking-tighter leading-none"
            style={{ fontSize: 'clamp(10rem, 28vw, 28rem)' }}
          >
            CONTACT
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Studio identifier */}
          <div className="flex items-center justify-center gap-4 mb-10 anim-hero-badge">
            <div className="h-px w-10 bg-ink-accent/50" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-ink-accent uppercase">
              InkSmith Studios — Hamilton, Bermuda
            </span>
            <div className="h-px w-10 bg-ink-accent/50" />
          </div>

          <div className="text-center space-y-6">
            <h1
              className="font-serif font-black uppercase leading-[0.88] anim-hero-title"
              style={{ fontSize: 'clamp(3.75rem, 11vw, 9.5rem)', letterSpacing: '-0.025em' }}
            >
              <span className="block text-white">Get In</span>
              <span
                className="block text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 45%, #C9A028 100%)' }}
              >
                Touch
              </span>
            </h1>

            <div className="flex items-center justify-center gap-5 anim-hero-buttons">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-ink-accent/40" />
              <p className="text-gray-500 text-sm font-light tracking-wide max-w-sm text-center leading-relaxed">
                Whether you have a concept, questions about our process,
                or just want to say hello — we're here.
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-ink-accent/40" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

          {/* ════ LEFT: INFO PANEL ════ */}
          <div className="lg:col-span-4 anim-slide-left">

            {/* Numbered info strips */}
            <div>
              {/* 01 — Visit */}
              <div className="group py-8 border-t border-white/[0.08] hover:border-ink-accent/25 transition-colors duration-500">
                <div className="flex gap-5">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/50 mt-0.5 shrink-0 tabular-nums">01</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-ink-accent shrink-0" />
                      <h3 className="text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase">Visit Studio</h3>
                    </div>
                    <div className="pl-6">
                      <p className="text-white text-base font-light leading-relaxed">39 King St, 2nd Floor</p>
                      <p className="text-gray-500 text-sm leading-relaxed">Ratteray Bldg., Hamilton<br />Bermuda HM 19</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 02 — Contact */}
              <div className="group py-8 border-t border-white/[0.08] hover:border-ink-accent/25 transition-colors duration-500">
                <div className="flex gap-5">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/50 mt-0.5 shrink-0 tabular-nums">02</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Phone className="w-3.5 h-3.5 text-ink-accent shrink-0" />
                      <h3 className="text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase">Contact</h3>
                    </div>
                    <div className="pl-6 space-y-1.5">
                      <a
                        href="tel:+14412618532"
                        className="block text-white text-base font-light hover:text-ink-accent transition-colors duration-200"
                      >
                        +1 (441) 261-8532
                      </a>
                      <a
                        href="mailto:inksmithbda@gmail.com"
                        className="block text-gray-500 text-sm hover:text-ink-accent transition-colors duration-200 truncate"
                      >
                        inksmithbda@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 03 — Hours */}
              <div className="group py-8 border-t border-b border-white/[0.08] hover:border-ink-accent/25 transition-colors duration-500">
                <div className="flex gap-5">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/50 mt-0.5 shrink-0 tabular-nums">03</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Clock className="w-3.5 h-3.5 text-ink-accent shrink-0" />
                      <h3 className="text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase">Opening Hours</h3>
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Mon — Sat</span>
                        <span className="text-white text-sm font-medium tabular-nums">12pm – 8pm</span>
                      </div>
                      <div className="w-full h-px bg-white/[0.05]" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Sunday</span>
                        <span className="text-white text-sm font-medium tabular-nums">11am – 7pm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-8">
              <a
                href="https://instagram.com/inksmithtattoobda"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gray-600 hover:text-white transition-all duration-300"
              >
                <div className="w-9 h-9 border border-white/[0.08] rounded-full flex items-center justify-center group-hover:border-ink-accent group-hover:bg-ink-accent/10 transition-all duration-300">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                INSTAGRAM
              </a>
              <a
                href="#"
                className="group flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gray-600 hover:text-white transition-all duration-300"
              >
                <div className="w-9 h-9 border border-white/[0.08] rounded-full flex items-center justify-center group-hover:border-ink-accent group-hover:bg-ink-accent/10 transition-all duration-300">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                FACEBOOK
              </a>
            </div>

            {/* Map */}
            <div className="mt-10 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <div className="relative h-60">
                <iframe
                  src="https://maps.google.com/maps?q=39%20King%20St%2C%20Hamilton%20HM%2019%2C%20Bermuda&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(8%) contrast(85%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Studio Location"
                  className="absolute inset-0 w-full h-full opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent pointer-events-none" />
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=39+King+St,+Hamilton+HM+19,+Bermuda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 right-4 bg-white/8 hover:bg-ink-accent border border-white/15 hover:border-ink-accent text-white hover:text-black px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md z-10"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* ════ RIGHT: FORM ════ */}
          <div className="lg:col-span-8 anim-slide-right">

            {/* Form header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-ink-accent" />
                <span className="text-[9px] font-bold tracking-[0.35em] text-ink-accent uppercase">Send a Message</span>
              </div>
              <h2 className="font-serif font-black text-4xl md:text-5xl text-white leading-[0.92] tracking-tight">
                Start Your<br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 50%, #C9A028 100%)' }}
                >
                  Story Here.
                </span>
              </h2>
              <p className="mt-5 text-gray-500 text-sm leading-relaxed max-w-md">
                Tell us about your tattoo concept, ask a question, or simply reach out — we read every message personally.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-ink-accent/30 via-white/5 to-transparent mb-10" />

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-7 anim-fade-scale">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full border border-ink-accent/15 scale-[1.6]"
                    style={{ animation: 'ping 2.5s cubic-bezier(0,0,0.2,1) infinite' }}
                  />
                  <div className="relative w-24 h-24 rounded-full border border-ink-accent/30 bg-ink-accent/[0.06] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.12)]">
                    <CheckCircle2 className="w-10 h-10 text-ink-accent" />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-bold tracking-[0.35em] text-ink-accent uppercase">Confirmed</p>
                  <h3 className="font-serif font-black text-3xl text-white">Message Sent</h3>
                  <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                    Thank you for reaching out. We've received your message and will respond within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-600 hover:text-ink-accent transition-colors duration-300 border-b border-transparent hover:border-ink-accent/40 pb-0.5 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* ── FORM ── */
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.3em] uppercase text-gray-500">
                      Full Name <span className="text-ink-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="Your name"
                      className={fieldCls('name')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.3em] uppercase text-gray-500">
                      Email Address <span className="text-ink-accent">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="your@email.com"
                      className={fieldCls('email')}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.3em] uppercase text-gray-500">
                    Subject <span className="text-ink-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="What's this about?"
                    className={fieldCls('subject')}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.3em] uppercase text-gray-500">
                      Message <span className="text-ink-accent">*</span>
                    </label>
                    <span className={`text-[9px] tabular-nums transition-colors duration-300 ${formData.message.length > 0 ? 'text-ink-accent/60' : 'text-gray-700'}`}>
                      {formData.message.length} chars
                    </span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={6}
                    placeholder="Tell us about your tattoo idea, ask a question, or say hello…"
                    className={`${fieldCls('message')} resize-none`}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-[18px] bg-ink-accent disabled:opacity-50 disabled:cursor-not-allowed text-black font-black tracking-[0.2em] uppercase text-sm rounded-xl overflow-hidden group transition-all duration-300 shadow-[0_4px_30px_rgba(212,175,55,0.18)] hover:shadow-[0_6px_50px_rgba(212,175,55,0.32)] hover:bg-[#c9a530] flex items-center justify-center gap-3"
                  >
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                    <span className="relative">{loading ? 'Sending…' : 'Send Message'}</span>
                    {loading ? (
                      <div className="relative w-4 h-4 border-[2px] border-black/25 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </button>

                  {/* Reassurance note */}
                  <p className="text-center text-[9px] tracking-[0.25em] text-gray-700 mt-4 uppercase">
                    We respond within <span className="text-ink-accent/70">24 hours</span>
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
