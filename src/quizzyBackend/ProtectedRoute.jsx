// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  // 1. Retrieve the saved token and role
  const token = localStorage.getItem('quizzyToken');
  const role = localStorage.getItem('userRole');

  // 2. If there is no token, the user is not logged in. Send them to Sign In.
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // 3. If a specific role is required, check if the user matches it.
  // For example, if a Student tries to view a Teacher page, redirect them.
  if (allowedRole && role !== allowedRole) {
    alert('Access Denied: You do not have permission to view this page.');
    return <Navigate to="/" replace />; // Send them back to home or safe page
  }

  // 4. If they pass all checks, render the page
  return children;
}