import React, { useState } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';
import { Booking } from './OverviewSection';

interface BookingsSectionProps {
  bookings: Booking[];
  bookingsLoading: boolean;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
  confirmed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  completed: 'bg-green-400/10 text-green-400 border-green-400/20',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
};

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings, bookingsLoading, updateBookingStatus }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSavingId(id);
    await updateBookingStatus(id, newStatus);
    setSavingId(null);
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${b.first_name} ${b.last_name}`.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.services.join(' ').toLowerCase().includes(q) ||
      (b.artist_name ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-ink-900 border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Booking Management</h3>
          <p className="text-xs text-gray-500 mt-0.5">{bookings.length} total requests</p>
        </div>
        <div className="flex gap-3">
          {/* Status filter */}
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-ink-950 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-xs text-white focus:border-ink-accent outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search client, email, service..."
              className="bg-ink-950 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-ink-accent outline-none w-56"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {bookingsLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-ink-accent/30 border-t-ink-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your search.'}
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-white uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Preferred Date</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{booking.first_name} {booking.last_name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                    <div className="text-xs text-gray-600">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {booking.services.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-ink-accent/10 text-ink-accent text-[10px] font-bold rounded border border-ink-accent/20 uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                    {booking.tattoo_style && (
                      <div className="text-[10px] text-gray-500 mt-1">
                        Style: {booking.tattoo_style === 'Others' ? booking.tattoo_style_other : booking.tattoo_style}
                      </div>
                    )}
                    {booking.piercing_placement && (
                      <div className="text-[10px] text-gray-500 mt-1">
                        Placement: {booking.piercing_placement === 'Others' ? booking.piercing_placement_other : booking.piercing_placement}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {booking.artist_name ?? <span className="text-gray-600 italic">Any</span>}
                  </td>
                  <td className="px-6 py-4">{fmt(booking.preferred_date)}</td>
                  <td className="px-6 py-4 text-xs">{fmt(booking.created_at)}</td>
                  <td className="px-6 py-4">
                    {booking.reference_url ? (
                      <a
                        href={booking.reference_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-ink-accent hover:text-white text-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      {savingId === booking.id ? (
                        <div className={`pl-2.5 pr-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending}`}>
                          <span className="w-3 h-3 border-2 border-current opacity-40 border-t-current rounded-full animate-spin" />
                          Saving…
                        </div>
                      ) : (
                        <>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-current opacity-60" />
                          <select
                            value={booking.status}
                            onChange={e => handleStatusChange(booking.id, e.target.value)}
                            disabled={savingId !== null}
                            className={`pl-2.5 pr-7 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending}`}
                            style={{ background: 'transparent' }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s} className="bg-ink-950 text-white normal-case font-normal tracking-normal">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
