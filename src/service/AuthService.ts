import store from '../state';
import { setAccessToken, setRefreshToken } from '../state/auth';
import ApiUtil from '../util/ApiUtil';
import KeyChainService from './KeyChainService';
import {
  setUserId,
  setEmail,
  setPhoneNumber,
  setCallingCode,
  handleFirstName,
  handleLastName,
  setCountry,
  setCitizenship,
  setProfilePhoto,
  setDOB,
  setEmploymentStatus,
  setPpsnNo,
  setSelectedPlan,
  setConfirmPlan,
  setCreatePassword,
  setConfirmPassword,
  setEmailToken,
  setPhoneToken,
  setAddress,
  setRetireAge,
  setRetireAmount,
  setLifeGoal,
  setActivateGoal,
  setEmailVerified,
  setPhoneVerified,
  setVerifiedEmail,
  setVerifiedPhone,
  setPayMethod,
  setIsEnableBiometrics,
  setCountryCode,
  resetState,
} from '../state/onboarding';


interface ResetPswType {
  phone?: string;
  callingCode?: string;
  countryCode?: string;
  password?: string;
}

interface ResetPasswordWithEmail {
  email: string;
}

export const storeAccessToken = (token: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await KeyChainService.setSecureValue('token', JSON.stringify(token));
      await store.dispatch(setAccessToken(token?.access_token));
      await store.dispatch(setRefreshToken(token?.refresh_token));
      setTimeout(() => {
        resolve(true);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

export const removeAccessToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await KeyChainService.removeSecureValue('token');
      store.dispatch(setAccessToken(''));
      store.dispatch(setRefreshToken(''));
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const login = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await ApiUtil.postWithoutToken('user/auth/login', {
        email,
        password,
      });
      await storeAccessToken(token);
      setTimeout(() => {
        resolve(true);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

export const clearUserData = () => {
  console.log('clearing data from redux');
  store.dispatch(resetState());
};

export const resetPassword = (body: ResetPswType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await ApiUtil.postWithoutToken(
        'user/auth/resetPassword',
        body,
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};


export const updateResetPasswordWithEmail = ( id: number,
  token: any,body:any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await ApiUtil.postWithoutToken(
        `user/auth/ResetPassword/${id}/${token}`,body );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export const resetPasswordWithEmail = (body: ResetPasswordWithEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await ApiUtil.postWithoutToken(
        'user/auth/forgotPassword',
        body,
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
