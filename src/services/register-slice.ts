import { TUser } from '@utils-types';
import {
  registerUserApi,
  TAuthResponse,
  TRegisterData
} from '../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface IRegisterState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IRegisterState = {
  user: null,
  isLoading: false,
  error: null
};

export const postUser = createAsyncThunk(
  'register/postUser',
  async (user: TRegisterData, thunkAPI) => {
    try {
      const response = await registerUserApi(user);
      return response;
    } catch (error) {
      console.log('Ошибка регистрации пользователя', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(postUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default registerSlice.reducer;

export const selectRegisterUser = (state: RootState) =>
  state.registerSlice.user;
