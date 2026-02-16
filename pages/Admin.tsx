import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Search, 
  Check, 
  X, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Upload,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

// --- MOCK DATA ---
const initialBookings = [
  { id: 'BK-001', client: 'Sarah Connor', email: 'sarah@example.com', artist: 'Viper', date: '2023-11-15', time: '14:00', status: 'Pending', type: 'Tattoo' },
  { id: 'BK-002', client: 'John Wick', email: 'john@example.com', artist: 'Kenji', date: '2023-11-16', time: '10:00', status: 'Confirmed', type: 'Tattoo' },
  { id: 'BK-003', client: 'Ellen Ripley', email: 'ellen@example.com', artist: 'Sarah', date: '2023-11-18', time: '12:30', status: 'Completed', type: 'Piercing' },
  { id: 'BK-004', client: 'Tony Stark', email: 'tony@stark.com', artist: 'Romark', date: '2023-11-20', time: '15:00', status: 'Cancelled', type: 'Consultation' },
  { id: 'BK-005', client: 'Bruce Wayne', email: 'bruce@wayne.com', artist: 'Viper', date: '2023-11-22', time: '11:00', status: 'Pending', type: 'Tattoo' },
];

const initialArtists = [
  { id: 1, name: 'Romark', style: 'Realism', status: 'Active', img: 'https://picsum.photos/200/200?random=1' },
  { id: 2, name: 'Viper', style: 'Blackwork', status: 'Active', img: 'https://picsum.photos/200/200?random=2' },
  { id: 3, name: 'Kenji', style: 'Japanese', status: 'Active', img: 'https://picsum.photos/200/200?random=3' },
  { id: 4, name: 'Sarah', style: 'Watercolor', status: 'On Leave', img: 'https://picsum.photos/200/200?random=4' },
];

const initialGallery = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  src: `https://picsum.photos/400/400?random=${i + 100}`,
  title: `Project ${i + 1}`,
  category: i % 2 === 0 ? 'Tattoo' : 'Piercing'
}));

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ title: string; value: string; icon: any; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-ink-900 border border-white/5 p-6 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-ink-accent/10 rounded-lg">
        <Icon className="w-6 h-6 text-ink-accent" />
      </div>
      {trend && <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">{trend}</span>}
    </div>
    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-serif font-bold text-white">{value}</p>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: { [key: string]: string } = {
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState(initialBookings);
  const [artists, setArtists] = useState(initialArtists);
  const [gallery, setGallery] = useState(initialGallery);

  // Booking Actions
  const updateBookingStatus = (id: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const deleteArtist = (id: number) => {
    setArtists(prev => prev.filter(a => a.id !== id));
  };

  const deleteImage = (id: number) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value="$42,500" icon={DollarSign} trend="+12%" />
              <StatCard title="Active Bookings" value="24" icon={Calendar} trend="+5" />
              <StatCard title="Total Clients" value="1,205" icon={Users} />
              <StatCard title="Avg. Session" value="3.5 hrs" icon={Clock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-ink-900 border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif font-bold text-white">Recent Requests</h3>
                  <button className="text-xs text-ink-accent font-bold uppercase hover:text-white">View All</button>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 4).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white">
                          {booking.client.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{booking.client}</p>
                          <p className="text-xs text-gray-400">{booking.type} • {booking.date}</p>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-ink-900 border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-serif font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-ink-accent text-ink-950 font-bold rounded hover:bg-white transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" /> Add New Booking
                  </button>
                  <button className="w-full py-3 bg-white/5 text-white font-bold rounded hover:bg-white/10 transition-colors flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" /> Upload to Gallery
                  </button>
                  <button className="w-full py-3 bg-white/5 text-white font-bold rounded hover:bg-white/10 transition-colors flex items-center justify-center">
                    <Users className="w-4 h-4 mr-2" /> Manage Staff
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-ink-900 border border-white/5 rounded-xl overflow-hidden animate-fade-in">
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
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{booking.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{booking.client}</div>
                        <div className="text-xs">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4">{booking.type}</td>
                      <td className="px-6 py-4">{booking.artist}</td>
                      <td className="px-6 py-4">{booking.date} <br/> <span className="text-xs">{booking.time}</span></td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Cancel"
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

      case 'artists':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-white">Artist Profiles</h3>
              <button className="flex items-center px-4 py-2 bg-ink-accent text-ink-950 font-bold rounded hover:bg-white transition-colors text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Artist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <div key={artist.id} className="bg-ink-900 border border-white/5 rounded-xl overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={artist.img} alt={artist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${artist.status === 'Active' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
                        {artist.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-1">{artist.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">{artist.style} Specialist</p>
                    <div className="flex justify-between pt-4 border-t border-white/10">
                      <button className="text-sm font-bold text-gray-400 hover:text-white">Edit Profile</button>
                      <button 
                        onClick={() => deleteArtist(artist.id)}
                        className="text-sm font-bold text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-ink-900 border border-white/5 p-4 rounded-xl">
              <div className="flex items-center space-x-4">
                <ImageIcon className="w-6 h-6 text-ink-accent" />
                <div>
                   <h3 className="text-lg font-bold text-white">File Maintenance</h3>
                   <p className="text-xs text-gray-400">Manage portfolio images and categories</p>
                </div>
              </div>
              <button className="flex items-center px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded transition-colors text-sm">
                <Upload className="w-4 h-4 mr-2" /> Upload New
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="relative group bg-ink-900 rounded-lg overflow-hidden border border-white/5">
                  <img src={item.src} alt="Gallery" className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    <p className="text-white font-bold text-center mb-1">{item.title}</p>
                    <span className="text-xs text-ink-accent uppercase tracking-widest mb-4">{item.category}</span>
                    <button 
                      onClick={() => deleteImage(item.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Upload Placeholder */}
              <div className="border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-6 text-gray-500 hover:text-ink-accent hover:border-ink-accent/50 hover:bg-ink-accent/5 transition-all cursor-pointer aspect-square">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Upload</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink-950 border-r border-white/5 hidden lg:block fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'bookings', icon: Calendar, label: 'Bookings' },
              { id: 'artists', icon: Users, label: 'Artists' },
              { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-ink-accent text-ink-950' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-24 w-full px-6">
          <div className="bg-ink-900/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-gray-400 mb-1">System Status</p>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-white">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Tab Nav */}
          <div className="lg:hidden mb-6 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
               { id: 'overview', label: 'Overview' },
               { id: 'bookings', label: 'Bookings' },
               { id: 'artists', label: 'Artists' },
               { id: 'gallery', label: 'Gallery' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-ink-accent text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white uppercase">{activeTab}</h1>
            <p className="text-gray-400 text-sm">Welcome back, Admin. Here is what's happening today.</p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
