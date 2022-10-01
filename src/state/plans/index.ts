import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PlansState = {
  fundDeatils: any;
};

const initialState: PlansState = {
  fundDeatils: null,
};

const planSlice = createSlice({
  name: 'plans',
  initialState: initialState,
  reducers: {
    setFundDeatils: (state, value: PayloadAction<any>) => {
      state.fundDeatils = value.payload;
    },
  },
});

export const { setFundDeatils } = planSlice.actions;

export default planSlice.reducer;
