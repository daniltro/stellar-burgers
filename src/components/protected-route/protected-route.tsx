import { RootState, useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { selectUser } from '../../services/user-slice';
type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const from = location.state?.from || '/';
  if (onlyUnAuth && user) {
    return <Navigate to={from} />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  return children;
};
