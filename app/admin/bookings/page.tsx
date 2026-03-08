'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Booking } from '../../../components/admin/OverviewSection';
import BookingsSection from '../../../components/admin/BookingsSection';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('bookings')
      .select('id, created_at, first_name, last_name, email, phone, services, tattoo_style, tattoo_style_other, piercing_placement, piercing_placement_other, artist_id, artist_name:artists(name), description, preferred_date, reference_url, status')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setBookings(data.map((r: any) => ({
            ...r,
            services: r.services ?? [],
            artist_name: r.artist_name?.name ?? null,
          })));
        }
        setLoading(false);
      });
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    const res = await fetch('/api/book/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: status as Booking['status'] } : b)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white uppercase">Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage and update all client booking requests.</p>
      </div>

      <BookingsSection
        bookings={bookings}
        bookingsLoading={loading}
        updateBookingStatus={updateBookingStatus}
      />
    </div>
  );
}
