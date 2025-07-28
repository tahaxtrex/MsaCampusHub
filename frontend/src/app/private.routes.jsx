import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function PrivateRoute({ children }) {
  const { firebaseUser } = useAuthStore();

  return firebaseUser ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
