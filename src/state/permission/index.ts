import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PermissionState = {
  cameraPermissionStatus: string;
};

const initialState: PermissionState = {
  cameraPermissionStatus: '',
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState: initialState,
  reducers: {
    setCameraPermissionStatus: (state, { payload }: PayloadAction<string>) => {
      state.cameraPermissionStatus = payload;
    },
  },
});

export const { setCameraPermissionStatus } = permissionSlice.actions;

export default permissionSlice.reducer;
