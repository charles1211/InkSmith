import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'bookings', icon: Calendar, label: 'Bookings' },
  { id: 'artists', icon: Users, label: 'Artists', showBadge: true },
  { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const;

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  artistCount: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, artistCount }) => (
  <aside className="w-64 bg-ink-950 border-r border-white/5 hidden lg:block fixed h-full z-10">
    <div className="p-6">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === item.id
                ? 'bg-ink-accent text-ink-950'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </span>
            {'showBadge' in item && item.showBadge && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeTab === item.id
                    ? 'bg-black/20 text-black'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {artistCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>

    <div className="absolute bottom-24 w-full px-6">
      <div className="bg-ink-900/50 p-4 rounded-xl border border-white/5">
        <p className="text-xs text-gray-400 mb-1">System Status</p>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-white">Online</span>
        </div>
      </div>
    </div>
  </aside>
);

export default AdminSidebar;
