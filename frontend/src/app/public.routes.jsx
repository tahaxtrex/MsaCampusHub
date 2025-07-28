import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function PublicRoute({ children }) {
  const { authUser, loading } = useAuthStore();

  if (loading) return null; // optional: show loading screen

  return authUser ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;

