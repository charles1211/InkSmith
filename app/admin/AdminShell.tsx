'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Image as ImageIcon, Camera, Zap } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/admin/AdminSidebar';

const MOBILE_TABS = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/bookings', icon: Calendar,        label: 'Bookings'              },
  { href: '/admin/artists',  icon: Users,           label: 'Artists'               },
  { href: '/admin/gallery',  icon: ImageIcon,       label: 'Gallery'               },
  { href: '/admin/studio',   icon: Camera,          label: 'Studio'                },
  { href: '/admin/piercing', icon: Zap,             label: 'Piercing'              },
] as const;

function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {MOBILE_TABS.map(tab => {
        const active = isActive(tab.href, 'exact' in tab ? tab.exact : false);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              active ? 'bg-ink-accent text-black' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-ink-950 pt-20 flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <MobileNav />
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
