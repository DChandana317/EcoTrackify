import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);
  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <Outlet />;
};
