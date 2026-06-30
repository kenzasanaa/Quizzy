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
  if (allowedRole && role !== allowedRole) {
    // Redirect to a safe page instead of using alert()
    return <Navigate to="/" replace />;
  }

  // 4. If they pass all checks, render the page
  return children;
}