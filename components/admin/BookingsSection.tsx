import React from 'react';
import { Search, Check, X, MoreVertical } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Booking } from './OverviewSection';

interface BookingsSectionProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: string) => void;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings, updateBookingStatus }) => (
  <div className="bg-ink-900 border border-white/5 rounded-xl overflow-hidden">
    <div className="p-6 border-b border-white/5 flex justify-between items-center">
      <h3 className="text-lg font-serif font-bold text-white">Booking Management</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search bookings..."
          className="bg-ink-950 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-ink-accent outline-none"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-white/5 text-white uppercase text-xs font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Artist</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {bookings.map(booking => (
            <tr key={booking.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-mono text-xs">{booking.id}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-white">{booking.client}</div>
                <div className="text-xs">{booking.email}</div>
              </td>
              <td className="px-6 py-4">{booking.type}</td>
              <td className="px-6 py-4">{booking.artist}</td>
              <td className="px-6 py-4">
                {booking.date}
                <br />
                <span className="text-xs">{booking.time}</span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                    className="p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                    title="Confirm"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BookingsSection;
