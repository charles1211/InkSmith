'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (requireAdmin && user.role !== 'admin') {
        navigate('/', { replace: true });
      }
    }
  }, [user, isLoading, requireAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ink-accent animate-spin" />
      </div>
    );
  }

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;