import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoadingSpinner text="Checking authentication..." />;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If user is logged in but trying to access auth pages (login/signup)
  if (!requireAuth && user) {
    // Redirect to the intended page or home
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}