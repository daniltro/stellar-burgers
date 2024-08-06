// import { updateUserApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi,
  TLoginData,
  TRegisterData
} from '../utils/burger-api';
import { deleteCookie, setCookie } from '../utils/cookie';
import { RootState } from './store';
interface IUserState {
  success: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  success: false,
  refreshToken: '',
  accessToken: '',
  user: null,
  isLoading: false,
  error: null
};

export const postLoginData = createAsyncThunk(
  'login/postUser',
  async (loginData: TLoginData, thunkAPI) => {
    try {
      const response = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      return response;
    } catch (error) {
      console.log('Ошибка входа', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const response = await getUserApi();
    console.log('Запрос  пользователя выполнен' + response);
    setCookie('user', JSON.stringify(response.user));
    return response;
  } catch (error) {
    console.log('Ошибка получения данных пользователя: ', error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: TRegisterData, thunkAPI) => {
    try {
      const response = await updateUserApi(user);
      setCookie('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.log('Ошибка получения данных пользователя: ', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    const response = await logoutApi();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    console.log('Выход из системы выполнен');
    return response;
  } catch (error) {
    console.log('Ошибка выхода из системы: ', error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLoginData.pending, (state, action) => {
        state.success = false;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postLoginData.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.user = action.payload.user;
        // localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(postLoginData.rejected, (state, action) => {
        state.success = false;
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getUser.pending, (state) => {
        state.success = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload as string;
        console.log('Не загружено');
      })
      .addCase(updateUser.pending, (state) => {
        state.success = false;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.user = action.payload.user;
        console.log('данные успешно изменены');
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload as string;
        console.log('данные не изменены');
      })
      .addCase(logout.fulfilled, (state) => {
        state.success = false;
        state.user = null;
      });
  }
});

export default userSlice.reducer;

export const selectRefreshToken = (state: RootState) =>
  state.userSlice.refreshToken;
export const selectAccessToken = (state: RootState) =>
  state.userSlice.accessToken;
export const selectUser = (state: RootState) => state.userSlice.user;
export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name
);
