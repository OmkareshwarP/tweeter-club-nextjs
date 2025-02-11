import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
}

const authInitialState: AuthState = {
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<{ isAuthenticated: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    resetAuthState: (state) => {
      state.isAuthenticated = authInitialState.isAuthenticated;
    }
  }
});

export const { setAuthState, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
