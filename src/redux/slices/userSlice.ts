import { IUserAuthInfo, IUserInfo, IUserSettings } from '@/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userAuthInfo: IUserAuthInfo | undefined;
  userInfo: IUserInfo | undefined;
  userSettings: IUserSettings;
}

const userInitialState: UserState = {
  userAuthInfo: undefined,
  userInfo: undefined,
  userSettings: {
    theme: 'dark'
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUserAuthInfo: (state, action: PayloadAction<{ data: IUserAuthInfo }>) => {
      const { data } = action.payload;
      state.userAuthInfo = {
        userId: data.userId,
        email: data.email,
        username: data.username,
        name: data.name,
        profilePictureMediaId: data.profilePictureMediaId
      };
    },
    setUserInfo: (state, action: PayloadAction<{ data: IUserInfo }>) => {
      const { data } = action.payload;
      state.userInfo = {
        userId: data.userId,
        username: data.username,
        name: data.name,
        profilePictureMediaId: data.profilePictureMediaId,
        bio: data.bio,
        location: data.location,
        website: data.website,
        dob: data.dob,
        createdAt: data.createdAt
      };
    },
    updateUserInfoState: (
      state,
      action: PayloadAction<{
        username?: string;
        name?: string;
        profilePictureMediaId?: string;
        bio?: string;
      }>
    ) => {
      const { username, name, profilePictureMediaId, bio } = action.payload;

      const _updateData: Partial<any> = {
        ...(username && username.length > 0 && { username }),
        ...(name && name.length > 0 && { name }),
        ...(profilePictureMediaId && profilePictureMediaId.length > 0 && { profilePictureMediaId }),
        ...(bio && bio.length > 0 && { bio })
      };

      if (state.userAuthInfo) {
        state.userAuthInfo = {
          ...state.userAuthInfo,
          ..._updateData
        };
      }

      if (state.userInfo) {
        state.userInfo = {
          ...state.userInfo,
          ..._updateData
        };
      }
    },
    updateUserSettingsState: (
      state,
      action: PayloadAction<{
        theme?: string;
      }>
    ) => {
      const { theme } = action.payload;

      const _updateData: Partial<any> = {
        ...(theme && theme.length > 0 && { theme })
      };

      if (state.userSettings) {
        state.userSettings = {
          ...state.userSettings,
          ..._updateData
        };
      }
      const isDarkTheme = state.userSettings.theme == 'dark';
      document.body.classList.toggle('dark-theme', isDarkTheme);
    },
    //
    resetUser: (state) => {
      state.userInfo = undefined;
      state.userAuthInfo = undefined;
      state.userSettings = userInitialState.userSettings;
    }
  }
});

export const { setUserAuthInfo, setUserInfo, updateUserInfoState, updateUserSettingsState, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
