import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { assets } from '../../../constants';

type OnboardingStepThreeState = {
  isLoading?: boolean;
  documentType: number;
  documentTypeList: documentTypeList[];
  documentPhoto: {
    base64: string;
    url: string;
  };
};

interface documentTypeList {
  id: number;
  title: string;
  image: any;
  checked?: any;
  value: string;
}

const initialState: OnboardingStepThreeState = {
  isLoading: false,
  documentType: 1,
  documentTypeList: [
    {
      id: 1,
      title: 'Electricity bill',
      image: assets.Electricity,
      checked: assets.Electricity,
      value: 'GENERIC',
    },
    {
      id: 2,
      title: 'Gas bill',
      image: assets.Gas,
      value: 'GENERIC',
    },
    {
      id: 3,
      title: 'Phone bill',
      image: assets.Phone,
      value: 'GENERIC',
    },
    {
      id: 4,
      title: 'Bank statement',
      image: assets.Gas,
      value: 'GENERIC',
    },
  ],
  documentPhoto: {
    base64: '',
    url: '',
  },
};

const onboardingStepThreeSlice = createSlice({
  name: 'onboardingStepThree',
  initialState: initialState,
  reducers: {
    setDocumentType: (state, { payload }: PayloadAction<number>) => {
      state.documentType = payload;
    },
    setDocumentPhoto: (state, { payload }: PayloadAction<any>) => {
      const { data, path } = payload;
      state.documentPhoto.base64 = data;
      state.documentPhoto.url = path;
    },
  },
});

export const { setDocumentType, setDocumentPhoto } =
  onboardingStepThreeSlice.actions;

export default onboardingStepThreeSlice.reducer;
