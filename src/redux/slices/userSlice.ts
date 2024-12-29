import { IBasicUserInfo } from '@/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  basicUserInfo: IBasicUserInfo | undefined;
}

const userInitialState: UserState = {
  basicUserInfo: undefined
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setBasicUserInfo: (state, action: PayloadAction<{ data: IBasicUserInfo }>) => {
      const { data } = action.payload;
      state.basicUserInfo = {
        userId: data.userId,
        email: data.email,
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        profilePictureMediaId: data.profilePictureMediaId
      };
    },
    //
    resetBasicUserInfo: (state) => {
      state.basicUserInfo = undefined;
    }
  }
});

export const { setBasicUserInfo, resetBasicUserInfo } = userSlice.actions;
export default userSlice.reducer;
