import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Preloader } from '../../components/ui/preloader/preloader';
import { selectUser } from '../../services/user-slice';
type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // Если true, то доступен только неавторизованным пользователям
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);

  if (onlyUnAuth && user) {
    return <Navigate to='/' />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' />;
  }

  return children;
};
