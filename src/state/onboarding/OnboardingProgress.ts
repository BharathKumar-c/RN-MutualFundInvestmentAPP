import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

type OnboardingProgressState = {
  completionValue?: number;
  completionList?: any;
  nonCompletionList?: any;
  doItLaterList?: any;
};

const initialState: OnboardingProgressState = {
  completionValue: 0,
  completionList: [],
  nonCompletionList: [],
  doItLaterList: [],
};

const onboardingProgressSlice = createSlice({
  name: 'onboardingProgress',
  initialState: initialState,
  reducers: {
    setCompletionValue: (state, { payload }: PayloadAction<number>) => {
      state.completionValue = payload;
    },
    setCompletionList: (state, { payload }: PayloadAction<any>) => {
      state.completionList = payload;
    },
    setNonCompletionList: (state, { payload }: PayloadAction<any>) => {
      state.nonCompletionList = payload;
    },
    setDoItLaterList: (state, { payload }: PayloadAction<any>) => {
      state.doItLaterList = payload;
    },
  },
});

export const {
  setCompletionValue,
  setCompletionList,
  setNonCompletionList,
  setDoItLaterList,
} = onboardingProgressSlice.actions;

export default onboardingProgressSlice.reducer;
