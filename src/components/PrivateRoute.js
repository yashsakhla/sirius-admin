// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return token && isAdmin ? children : <Navigate to="/login" replace />;
}
