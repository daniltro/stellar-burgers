import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  clearConstructor,
  selectBun,
  selectIngredients
} from '../../services/constructor-slice/constructor-slice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  fetchOrderRequest,
  resetOrderModal
} from '../../services/order-slice/order-slice';
import { selectUser } from '../../services/user-slice/user-slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const bun = useSelector(selectBun); // Получаем булочку из хранилища
  const ingredients = useSelector(selectIngredients); // Получаем ингредиенты из хранилища
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const orderRequest = useSelector((state) => state.orderSlice.isLoading); // Выберите состояние загрузки из хранилища
  const orderModalData = useSelector((state) => state.orderSlice.order); // Получите данные заказа из хранилища
  const dispatch = useDispatch();

  const getIngredientsIds = () => {
    const bunId = constructorItems.bun ? constructorItems.bun._id : '';
    const ingredientsIds = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    return [bunId, ...ingredientsIds];
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ingredientIds = getIngredientsIds();
    dispatch(fetchOrderRequest(ingredientIds));
    dispatch(clearConstructor());
  };
  const closeOrderModal = () => {
    dispatch(resetOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
