import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredient-slice';
import constructorReducer from './constructor-slice';
import feedsSlice from './feeds-slice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { Middleware } from '@reduxjs/toolkit';
import orderSlice from './order-slice';
import registerSlice from './user-slice';
import userSlice from './user-slice';

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('Next state:', store.getState());
  return next(action);
};

const rootReducer = combineReducers({
  ingredientsSlice: ingredientsReducer,
  constructorSlice: constructorReducer,
  feedsSlice: feedsSlice,
  orderSlice: orderSlice,
  userSlice: userSlice
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
