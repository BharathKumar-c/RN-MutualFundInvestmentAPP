import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'onboarding',
  initialState: initialState,
  reducers: {
    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    setRefreshToken: (state, { payload }: PayloadAction<string>) => {
      state.refreshToken = payload;
    },
  },
});

export const { setAccessToken, setRefreshToken } = authSlice.actions;

export default authSlice.reducer;
