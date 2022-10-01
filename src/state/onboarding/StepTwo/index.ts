import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { assets } from '../../../constants';

type OnboardingStepTwoState = {
  isLoading?: boolean;
  identityType: number;
  nationality: number;
  identityTypeList: identityTypeList[];
  allNationalityList: allNationalityList[];
  popularNationalityList: popularNationalityList[];
  idPhoto: {
    base64: string;
    url: string;
  };
  selfiePhoto: {
    base64: string;
    url: string;
  };
  onfidoSDKToken: string;
};

interface identityTypeList {
  id: number;
  title: string;
  image: any;
  checked?: any;
  value: string;
}

interface popularNationalityList {
  id: number;
  name: string;
}

interface allNationalityList {
  id: number;
  name: string;
}

const initialState: OnboardingStepTwoState = {
  isLoading: false,
  identityType: 1,
  nationality: 1,
  identityTypeList: [
    {
      id: 1,
      title: 'Passport',
      image: assets.Passport,
      checked: assets.Passport,
      value: 'PASSPORT',
    },
    {
      id: 2,
      title: 'Driver license',
      image: assets.DriverLicense,
      value: 'DRIVING_LICENCE',
    },
    {
      id: 3,
      title: 'National ID',
      image: assets.NationalID,
      value: 'NATIONAL_IDENTITY_CARD',
    },
  ],
  popularNationalityList: [
    {
      id: 1,
      name: 'Irish',
    },
    {
      id: 2,
      name: 'American',
    },
    {
      id: 3,
      name: 'British',
    },
  ],
  allNationalityList: [
    {
      id: 1,
      name: 'Irish',
    },
    {
      id: 2,
      name: 'American',
    },
    {
      id: 3,
      name: 'British',
    },
    {
      id: 4,
      name: 'Indian',
    },
    {
      id: 5,
      name: 'Spain',
    },
  ],
  idPhoto: {
    base64: '',
    url: '',
  },
  selfiePhoto: {
    base64: '',
    url: '',
  },
  onfidoSDKToken: '',
};

const onboardingStepTwoSlice = createSlice({
  name: 'onboardingStepTwo',
  initialState: initialState,
  reducers: {
    setIdentityType: (state, { payload }: PayloadAction<number>) => {
      state.identityType = payload;
    },
    setNationality: (state, { payload }: PayloadAction<number>) => {
      state.nationality = payload;
    },
    setIdPhoto: (state, { payload }: PayloadAction<any>) => {
      const { data, path } = payload;
      state.idPhoto.base64 = data;
      state.idPhoto.url = path;
    },
    setSelfiePhoto: (state, { payload }: PayloadAction<any>) => {
      const { data, path } = payload;
      state.selfiePhoto.base64 = data;
      state.selfiePhoto.url = path;
    },
    setOnfidoSDKToken: (state, { payload }: PayloadAction<string>) => {
      state.onfidoSDKToken = payload;
    },
  },
});

export const {
  setIdentityType,
  setNationality,
  setIdPhoto,
  setSelfiePhoto,
  setOnfidoSDKToken,
} = onboardingStepTwoSlice.actions;

export default onboardingStepTwoSlice.reducer;
