'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Compute effective allowed roles
  const roles = allowedRoles ?? (requireAdmin ? ['admin'] : null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (roles && !roles.includes(user.role)) {
        router.replace('/');
      }
    }
  }, [user, isLoading, roles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ink-accent animate-spin" />
      </div>
    );
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
