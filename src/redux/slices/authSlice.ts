import { IAuthUserInfo } from '@/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  fbUserId: string | null;
  authUserInfo: IAuthUserInfo | null;
  currentProvider: string | null;
}

const authInitialState: AuthState = {
  isAuthenticated: false,
  fbUserId: null,
  authUserInfo: null,
  currentProvider: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setIsAuthenticatedState: (state, action: PayloadAction<{ isAuthenticated: boolean; fbUserId: string | null }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.fbUserId = action.payload.fbUserId;
    },
    setCurrentProviderState: (state, action: PayloadAction<{ currentProvider: string | null }>) => {
      state.currentProvider = action.payload.currentProvider;
    },
    setAuthUserInfoState: (state, action: PayloadAction<{ authUserInfo: IAuthUserInfo | null }>) => {
      state.authUserInfo = action.payload.authUserInfo;
    },
    resetAuthState: (state) => {
      state.isAuthenticated = authInitialState.isAuthenticated;
      state.fbUserId = authInitialState.fbUserId;
      state.authUserInfo = authInitialState.authUserInfo;
      state.currentProvider = authInitialState.currentProvider;
    }
  }
});

export const { setIsAuthenticatedState, setCurrentProviderState, setAuthUserInfoState, resetAuthState } =
  authSlice.actions;
export default authSlice.reducer;
