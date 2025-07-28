// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return isAdmin ? children : <Navigate to="/login" replace />;
}
