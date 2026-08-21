import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function ProtectedRoute({ element, requiredRole = null }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return element;
}
