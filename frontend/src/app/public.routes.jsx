import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function PublicRoute({ children }) {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
      </div>
    );
  }

  return authUser ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;

