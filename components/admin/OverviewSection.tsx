import React from 'react';
import { DollarSign, Calendar, Users, Clock, Plus, Upload } from 'lucide-react';
import StatCard from './StatCard';
import StatusBadge from './StatusBadge';
import { Artist } from '../../types';

export type Booking = {
  id: string;
  client: string;
  email: string;
  artist: string;
  date: string;
  time: string;
  status: string;
  type: string;
};

interface OverviewSectionProps {
  bookings: Booking[];
  artists: Artist[];
  openAddArtist: () => void;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ bookings, artists, openAddArtist }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Revenue" value="$42,500" icon={DollarSign} trend="+12%" />
      <StatCard title="Active Bookings" value={String(bookings.length)} icon={Calendar} trend="+5" />
      <StatCard title="Artists on Roster" value={String(artists.length)} icon={Users} />
      <StatCard title="Avg. Session" value="3.5 hrs" icon={Clock} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-ink-900 border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-serif font-bold text-white">Recent Requests</h3>
          <button className="text-xs text-ink-accent font-bold uppercase hover:text-white">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {bookings.slice(0, 4).map(booking => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white">
                  {booking.client.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{booking.client}</p>
                  <p className="text-xs text-gray-400">
                    {booking.type} • {booking.date}
                  </p>
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-ink-900 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-serif font-bold text-white mb-6">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full py-3 bg-ink-accent text-ink-950 font-bold rounded hover:bg-white transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" /> Add New Booking
          </button>
          <button className="w-full py-3 bg-white/5 text-white font-bold rounded hover:bg-white/10 transition-colors flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" /> Upload to Gallery
          </button>
          <button
            onClick={openAddArtist}
            className="w-full py-3 bg-white/5 text-white font-bold rounded hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            <Users className="w-4 h-4 mr-2" /> Add New Artist
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OverviewSection;
