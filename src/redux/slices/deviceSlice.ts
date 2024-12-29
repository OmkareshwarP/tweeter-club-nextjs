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
    setDeviceInfo: (state, action: PayloadAction<{ data: DeviceState }>) => {
      const { data } = action.payload;
      state.isLaptop = data.isLaptop;
    },
    //
    resetDeviceInfo: (state) => {
      state.isLaptop = false;
    }
  }
});

export const { setDeviceInfo, resetDeviceInfo } = deviceSlice.actions;
export default deviceSlice.reducer;
