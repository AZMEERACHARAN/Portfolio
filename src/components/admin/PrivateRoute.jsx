import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAdmin = localStorage.getItem('admin-auth') === 'true';
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
