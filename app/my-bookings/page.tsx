'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  PenTool,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  ArrowRight,
  RefreshCw,
  BookOpen,
  User,
  Mail,
  Phone,
  Palette,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '../../lib/supabase/client';

// ── Types ─────────────────────────────────────────────────────────────
interface Booking {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age_verification: string;
  services: string[];
  tattoo_style: string | null;
  tattoo_style_other: string | null;
  piercing_placement: string | null;
  piercing_placement_other: string | null;
  artist_id: string | null;
  description: string | null;
  preferred_date: string | null;
  reference_url: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  // joined from artists table
  artist_name?: string | null;
}

// ── Status config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    dot: 'bg-amber-400',
    badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    bar: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    dot: 'bg-blue-400',
    badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    bar: 'bg-blue-400',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-green-400',
    badge: 'bg-green-400/10 text-green-400 border-green-400/20',
    bar: 'bg-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-red-400',
    badge: 'bg-red-400/10 text-red-400 border-red-400/20',
    bar: 'bg-red-400',
  },
} as const;

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Tattoo: PenTool,
  Piercing: Zap,
  Consultation: MessageSquare,
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fmtFull(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Booking Card ────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;

  const style = booking.tattoo_style === 'Others' ? booking.tattoo_style_other : booking.tattoo_style;
  const placement = booking.piercing_placement === 'Others' ? booking.piercing_placement_other : booking.piercing_placement;

  return (
    <div className={`bg-ink-900/50 border rounded-2xl overflow-hidden transition-all duration-300 ${
      expanded ? 'border-white/10' : 'border-white/6 hover:border-white/10'
    }`}>
      {/* Status bar */}
      <div className={`h-0.5 w-full ${status.bar}`} />

      {/* Card header — always visible */}
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Service badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {booking.services.map(svc => {
                const Icon = SERVICE_ICONS[svc] ?? BookOpen;
                return (
                  <span key={svc} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ink-accent/10 border border-ink-accent/20 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] text-ink-accent">
                    <Icon className="w-3 h-3" /> {svc}
                  </span>
                );
              })}
            </div>

            {/* Date & time */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Submitted {fmt(booking.created_at)}
              </span>
              {booking.preferred_date && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Preferred: {fmtFull(booking.preferred_date)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${status.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${booking.status === 'pending' ? 'animate-pulse' : ''}`} />
              {status.label}
            </span>
            <div className="text-gray-500">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-white/5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">

            {/* Artist */}
            {booking.artist_name && (
              <Detail icon={PenTool} label="Artist" value={booking.artist_name} />
            )}

            {/* Tattoo style */}
            {style && (
              <Detail icon={Palette} label="Tattoo Style" value={style} />
            )}

            {/* Piercing placement */}
            {placement && (
              <Detail icon={MapPin} label="Piercing Placement" value={placement} />
            )}

            {/* Age verification */}
            <Detail
              icon={User}
              label="Age Verified"
              value={booking.age_verification === 'yes' ? '18+ Verified' : 'With Guardian'}
            />

            {/* Phone */}
            <Detail icon={Phone} label="Phone" value={booking.phone} />

            {/* Email */}
            <Detail icon={Mail} label="Email" value={booking.email} />
          </div>

          {/* Description */}
          {booking.description && (
            <div className="bg-ink-950/50 border border-white/5 rounded-xl p-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Concept</p>
              <p className="text-sm text-gray-300 leading-relaxed italic">&ldquo;{booking.description}&rdquo;</p>
            </div>
          )}

          {/* Reference image */}
          {booking.reference_url && (
            <a
              href={booking.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 bg-ink-accent/5 border border-ink-accent/15 rounded-xl hover:border-ink-accent/30 transition-colors group w-fit"
            >
              <ImageIcon className="w-4 h-4 text-ink-accent" />
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">View Reference Image</span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-accent group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* Status note */}
          {booking.status === 'pending' && (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-400/5 border border-amber-400/15 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0 mt-1.5" />
              <p className="text-xs text-amber-400/90">
                Your booking is under review. We&apos;ll contact you within 24–48 hours to confirm.
              </p>
            </div>
          )}
          {booking.status === 'confirmed' && (
            <div className="flex items-start gap-2.5 p-3.5 bg-blue-400/5 border border-blue-400/15 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <p className="text-xs text-blue-400/90">
                Your appointment is confirmed. Please arrive on time and follow the preparation guide.
              </p>
            </div>
          )}
          {booking.status === 'completed' && (
            <div className="flex items-start gap-2.5 p-3.5 bg-green-400/5 border border-green-400/15 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-1.5" />
              <p className="text-xs text-green-400/90">
                Session complete. Follow aftercare instructions and contact us if you need a touch-up.
              </p>
            </div>
          )}
          {booking.status === 'cancelled' && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-400/5 border border-red-400/15 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <p className="text-xs text-red-400/90">
                This booking was cancelled. Feel free to book a new session anytime.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 bg-ink-accent/8 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-ink-accent" />
      </div>
      <div>
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-sm text-white font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-ink-900/50 border border-white/6 rounded-2xl p-5 text-center">
      <p className="text-2xl font-serif font-black text-white">{value}</p>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────
export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('bookings')
        .select('*, artists(name)')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
        ...(row as Booking),
        artist_name: (row.artists as { name: string } | null)?.name ?? null,
      }));

      setBookings(mapped);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink-accent/30 border-t-ink-accent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const FILTERS: { value: 'all' | Booking['status']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-20 pb-24 relative selection:bg-ink-accent selection:text-black">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] bg-ink-accent/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-8%] left-[-4%] w-[400px] h-[400px] bg-blue-950/20 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-accent/10 border border-ink-accent/20 mb-5">
            <BookOpen className="w-3 h-3 text-ink-accent" />
            <span className="text-ink-accent text-[10px] font-black uppercase tracking-[0.25em]">My Bookings</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-white uppercase leading-tight">
                Your <span className="text-ink-accent">Sessions</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, <span className="text-white font-semibold">{user.name.split(' ')[0]}</span>.
                Here&apos;s your booking history.
              </p>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" value={counts.all} />
          <StatCard label="Pending" value={counts.pending} />
          <StatCard label="Confirmed" value={counts.confirmed} />
          <StatCard label="Completed" value={counts.completed} />
        </div>

        {/* ── Filter tabs ──────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                filter === f.value
                  ? 'bg-ink-accent text-black shadow-[0_4px_14px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {f.label}
              {counts[f.value] > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] ${
                  filter === f.value ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                }`}>
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Booking list ─────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-ink-900/40 border border-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-ink-accent/8 border border-ink-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CalendarDays className="w-7 h-7 text-ink-accent/60" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'all'
                ? "You haven't made any booking requests yet."
                : `You have no ${filter} bookings at this time.`}
            </p>
            {filter === 'all' && (
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ink-accent hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] group"
              >
                Book a Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {!loading && bookings.length > 0 && (
          <div className="mt-10 p-6 bg-ink-900/50 border border-white/6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Ready for another session?</p>
              <p className="text-xs text-gray-500 mt-0.5">Book your next appointment with us.</p>
            </div>
            <Link
              href="/book"
              className="flex items-center gap-2 px-6 py-3 bg-ink-accent hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_4px_16px_rgba(212,175,55,0.2)] group shrink-0"
            >
              New Booking
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
