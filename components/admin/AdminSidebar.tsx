'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image as ImageIcon,
  Camera,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Overview',        exact: true  },
  { href: '/admin/bookings', icon: Calendar,        label: 'Bookings'                      },
  { href: '/admin/artists',  icon: Users,           label: 'Artists'                       },
  { href: '/admin/gallery',  icon: ImageIcon,       label: 'Gallery'                       },
  { href: '/admin/studio',   icon: Camera,          label: 'Studio Images'                 },
  { href: '/admin/piercing', icon: Zap,             label: 'Piercing Images'               },
] as const;

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 bg-ink-950 border-r border-white/5 hidden lg:block fixed h-full z-10 top-0 pt-20">
      <div className="p-6">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-6">
          Admin Panel
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href, 'exact' in item ? item.exact : false);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active
                    ? 'bg-ink-accent text-black shadow-[0_4px_12px_rgba(212,175,55,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-8 w-full px-6">
        <div className="bg-ink-900/50 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
