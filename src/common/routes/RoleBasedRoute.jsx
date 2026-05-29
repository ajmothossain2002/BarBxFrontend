import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/useAuthStore';

/**
 * Route guard that checks both authentication AND role membership.
 * Redirects unauthenticated users to /login and unauthorized users to /dashboard.
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine user's roles (support both legacy `role` string and new `roles` array)
  const userRoles = user?.roles || (user?.role ? [user.role] : []);
  const hasAccess = allowedRoles.length === 0 || allowedRoles.some(r => userRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
