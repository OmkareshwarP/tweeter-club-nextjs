import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeviceState {
  isLaptop: boolean;
}

const userInitialState: DeviceState = {
  isLaptop: true
};

const deviceSlice = createSlice({
  name: 'device',
  initialState: userInitialState,
  reducers: {
    setDeviceSize: (state, action: PayloadAction<{ isLaptop: boolean }>) => {
      const { isLaptop } = action.payload;
      state.isLaptop = isLaptop;
    },
    //
    resetDeviceInfo: (state) => {
      state.isLaptop = false;
    }
  }
});

export const { setDeviceSize, resetDeviceInfo } = deviceSlice.actions;
export default deviceSlice.reducer;
