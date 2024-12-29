import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFBAuth {
  email: string;
  provider: string;
  isEmailVerified: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserAuth {
  email: string;
  provider: string;
  token?: string;
}

interface AuthState {
  fbAuth?: IFBAuth;
  userAuth?: IUserAuth;
}

const authInitialState: AuthState = {
  fbAuth: undefined,
  userAuth: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setFbAuth: (state, action: PayloadAction<{ data: IFBAuth }>) => {
      const { data } = action.payload;
      state.fbAuth = {
        email: data.email,
        isEmailVerified: data.isEmailVerified,
        provider: data.provider,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
    },
    setUserAuth: (state, action: PayloadAction<{ data: IUserAuth }>) => {
      const { data } = action.payload;
      state.userAuth = {
        email: data.email,
        provider: data.provider,
        token: data.token
      };
    },
    resetAuth: (state) => {
      state.fbAuth = undefined;
      state.userAuth = undefined;
    }
  }
});

export const { setFbAuth, setUserAuth, resetAuth } = authSlice.actions;
export default authSlice.reducer;
