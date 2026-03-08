'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { Booking } from '../../components/admin/OverviewSection';
import { Artist } from '../../types';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { Calendar, Users, Clock, ArrowRight, Plus, ImageIcon } from 'lucide-react';

export default function AdminOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase
        .from('bookings')
        .select('id, created_at, first_name, last_name, email, phone, services, tattoo_style, tattoo_style_other, piercing_placement, piercing_placement_other, artist_id, artist_name:artists(name), description, preferred_date, reference_url, status')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase.from('artists').select('*').order('created_at', { ascending: true }),
    ]).then(([bookRes, artRes]) => {
      if (!bookRes.error && bookRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBookings(bookRes.data.map((r: any) => ({
          ...r,
          services: r.services ?? [],
          artist_name: r.artist_name?.name ?? null,
        })));
      }
      if (!artRes.error && artRes.data) {
        setArtists(artRes.data.map(r => ({
          id: r.id, name: r.name,
          specialties: r.specialties ?? [],
          bio: r.bio ?? '',
          imageUrl: r.image_url ?? '',
          instagramHandle: r.instagram_handle ?? '',
          highlights: r.highlights ?? [],
        })));
      }
      setLoading(false);
    });
  }, []);

  const pending   = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white uppercase">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Bookings"   value={String(bookings.length)} icon={Calendar} trend={`${pending} pending`} />
        <StatCard title="Confirmed"        value={String(confirmed)}       icon={Clock}    />
        <StatCard title="Artists on Roster" value={String(artists.length)} icon={Users}    />
        <StatCard title="Avg. Session"     value="3.5 hrs"                 icon={Clock}    />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent requests */}
        <div className="lg:col-span-2 bg-ink-900 border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-serif font-bold text-white">Recent Requests</h3>
            <Link href="/admin/bookings" className="text-xs text-ink-accent font-bold uppercase hover:text-white flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />)}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-accent/10 border border-ink-accent/20 flex items-center justify-center text-sm font-bold text-ink-accent">
                      {b.first_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{b.first_name} {b.last_name}</p>
                      <p className="text-xs text-gray-400">
                        {b.services.join(', ')} · {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Flexible'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-ink-900 border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-serif font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/artists"
              className="w-full py-3 px-4 bg-ink-accent hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add New Artist
            </Link>
            <Link
              href="/admin/bookings"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" /> Manage Bookings
            </Link>
            <Link
              href="/admin/gallery"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ImageIcon className="w-4 h-4" /> Upload to Gallery
            </Link>
          </div>

          {/* Artists preview */}
          {artists.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Roster</p>
                <Link href="/admin/artists" className="text-[10px] text-ink-accent hover:text-white transition-colors font-bold">
                  Manage →
                </Link>
              </div>
              <div className="space-y-2">
                {artists.slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-center gap-3">
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt={a.name} className="w-7 h-7 rounded-full object-cover object-top" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-ink-accent/10 flex items-center justify-center text-xs font-bold text-ink-accent">
                        {a.name.charAt(0)}
                      </div>
                    )}
                    <p className="text-sm text-white font-medium">{a.name}</p>
                  </div>
                ))}
                {artists.length > 4 && (
                  <p className="text-xs text-gray-600">+{artists.length - 4} more</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
