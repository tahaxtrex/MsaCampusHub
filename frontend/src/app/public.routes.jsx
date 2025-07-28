import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function PublicRoute({ children }) {
  const { firebaseUser } = useAuthStore();

  return firebaseUser ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;

