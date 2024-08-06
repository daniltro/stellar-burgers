import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { selectAllOrders } from '../../services/feeds-slice';
import { useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { fetchFeeds } from '../../services/feeds-slice';
import { useDispatch } from '../../services/store';
import { selectIsLoading } from '../../services/feeds-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(fetchFeeds()); // Загрузите данные при монтировании компонента
  }, [dispatch]);
  if (!orders.length) {
    return <Preloader />;
  }

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
