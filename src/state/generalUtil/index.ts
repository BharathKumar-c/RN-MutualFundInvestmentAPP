import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLORS } from '../../constants';

type GeneralUtilState = {
  isBottomSheetOpened: boolean;
  isBiometricsAvailable: boolean;
  statusbarColor: string;
  translucent: boolean;
  barStyle: string;
  safeAreaViewEdges: Array<string>;
  isEnableHeader?: boolean;
  isEnableHeaderProgress?: boolean;
  isHeaderNavigation?: any;
  headerColor?: string;
};

const initialState: GeneralUtilState = {
  isBottomSheetOpened: false,
  isBiometricsAvailable: false,
  statusbarColor: '',
  translucent: false,
  barStyle: '',
  safeAreaViewEdges: ['right', 'left', 'top', 'bottom'],
  isEnableHeader: true,
  isEnableHeaderProgress: true,
  isHeaderNavigation: '',
  headerColor: COLORS.background.primary,
};

const generalUtilSlice = createSlice({
  name: 'generlUtil',
  initialState: initialState,
  reducers: {
    setHeaderColor: (state, { payload }: PayloadAction<string>) => {
      state.headerColor = payload;
    },
    setIsBottomSheet: (state, { payload }: PayloadAction<boolean>) => {
      state.isBottomSheetOpened = payload;
    },
    setIsBiometricsAvailablet: (state, { payload }: PayloadAction<boolean>) => {
      state.isBiometricsAvailable = payload;
    },
    setStatusbarColor: (state, { payload }: PayloadAction<string>) => {
      state.statusbarColor = payload;
    },
    setTranslucent: (state, { payload }: PayloadAction<boolean>) => {
      state.translucent = payload;
    },
    setBarStyle: (state, { payload }: PayloadAction<string>) => {
      state.barStyle = payload;
    },
    hideSafeAreaView: state => {
      state.safeAreaViewEdges = ['right', 'left'];
    },
    hideSafeAreaViewBottom: state => {
      state.safeAreaViewEdges = ['right', 'left', 'top'];
    },
    hideSafeAreaViewTop: state => {
      state.safeAreaViewEdges = ['right', 'left', 'bottom'];
    },
    showSafeAreaView: state => {
      state.safeAreaViewEdges = ['right', 'left', 'top', 'bottom'];
    },
    setIsEnableHeader: (state, { payload }: PayloadAction<boolean>) => {
      state.isEnableHeader = payload;
    },
    setIsEnableHeaderProgress: (state, { payload }: PayloadAction<boolean>) => {
      state.isEnableHeaderProgress = payload;
    },
    setIsHeaderNavigation: (state, { payload }: PayloadAction<string>) => {
      state.isHeaderNavigation = payload;
    },
  },
});

export const {
  setIsBottomSheet,
  setIsBiometricsAvailablet,
  setStatusbarColor,
  setTranslucent,
  setBarStyle,
  hideSafeAreaView,
  hideSafeAreaViewBottom,
  showSafeAreaView,
  setIsEnableHeader,
  setIsEnableHeaderProgress,
  setIsHeaderNavigation,
  setHeaderColor,
} = generalUtilSlice.actions;

export default generalUtilSlice.reducer;
