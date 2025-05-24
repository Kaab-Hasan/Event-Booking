import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // For admin routes, check both authentication and admin status
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'You need admin privileges to access this page' }} replace />;
  }
  
  // For regular protected routes, just check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'You need to be logged in to access this page' }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 