import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function PrivateRoute({ children }) {
  const { authUser, loading } = useAuthStore();

  if (loading) return null; // optional: show a loader

  return authUser ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;

