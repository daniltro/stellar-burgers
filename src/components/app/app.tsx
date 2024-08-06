import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AppHeader } from '@components';
import { Feed } from '../../pages/feed/feed';
// Компонент защищенного роута
import { ProtectedRoute } from '../protected-route/protected-route';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { Modal } from '../../components/modal/modal';
import { OrderInfo } from '../../components/order-info/order-info';
import { fetchFeeds } from '../../services/feeds-slice';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchAllIngredients } from '../../services/ingredient-slice';
import { getUser } from '../../services/user-slice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальное окно */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Order Info' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ingredient Details' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Info' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
