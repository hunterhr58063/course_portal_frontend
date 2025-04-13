import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const PrivateRoute = ({ roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner if you want

  if (!user) return <Navigate to="/login" />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="#" />;

  return <Outlet />;
};

export default PrivateRoute;
