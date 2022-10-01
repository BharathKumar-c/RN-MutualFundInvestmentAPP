import axios from 'axios';
import { Platform } from 'react-native';
import ApiUtil from '../util/ApiUtil';
import { storeAccessToken } from './AuthService';
import api from '../config';
import store from '../state';
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
} from '../state/onboarding';
import {
  setCompletionList,
  setCompletionValue,
  setNonCompletionList,
  setDoItLaterList,
} from '../state/onboarding/OnboardingProgress';

export const checkEmailAlreadyExists = (email: string) => {
  return ApiUtil.postWithoutToken('user/auth/emailAlreadyExists', { email });
};

export const checkPhoneAlreadyExists = (phone: string, callingCode: string) => {
  return ApiUtil.postWithoutToken('user/auth/phoneAlreadyExists', {
    phone,
    callingCode,
  });
};

export const sendOtp = (value: string, type: string) => {
  return ApiUtil.postWithoutToken('user/auth/sendOtp', { value, type });
};

export const verifyOtp = (value: string, type: string, otp: string) => {
  return ApiUtil.postWithoutToken('user/auth/verifyOtp', { value, type, otp });
};
interface RegisterBody {
  email?: string;
  callingCode?: string;
  countryCode?: string;
  phone?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  citizenship?: string;
  dob?: Date;
  emailToken?: string;
  phoneToken?: string;
  address?: string;
}

interface RetirementPlanType {
  currentAge?: number;
  retireAge?: number;
  retirementIncome?: number;
}

interface stepOneCompleteBody {
  employmentStatus: string;
  ppsnNumber: string;
}

export const register = (body: RegisterBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithoutToken(
        'user/auth/register',
        body,
      );
      await storeAccessToken(response?.token);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const stepOneComplete = (body: stepOneCompleteBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.putWithToken('user/stepOneComplete', body);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserDataById = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await ApiUtil.getWithToken('user/');
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadProfileImage = (image: any, userId: any) => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('profile_image', {
    uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
    name: '_profile',
    type: 'image/jpg', // it may be necessary in Android.
  });

  var requestOptions = {
    method: 'POST',
    body: formData,
    redirect: 'follow',
  };

  try {
    fetch(`${api}api/user/upload/profile`, requestOptions)
      .then(response => response.text())
      .catch(error => console.log('error', error));
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentOnboardingStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.getWithToken(
        'user/onboarding/completion-status',
      );
      await updatedOnboardingStatusToRedux(response);
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const createUserOnboarding = (
  userId: number,
  onboardingChecklistId: number,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithoutToken(
        `user/onboarding/complete-steps/create/${userId}/${onboardingChecklistId}`,
      );
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const deleteUserOnboardingCheckList = (
  userId: number,
  onboardingChecklistId: number,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithoutToken(

        `user/onboarding/complete-steps/delete/${userId}/${onboardingChecklistId}`,
      );
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updatedOnboardingStatusToRedux = (onboardingProgressData: any) => {
  store.dispatch(setCompletionValue(onboardingProgressData.completionValue));
  store.dispatch(setCompletionList(onboardingProgressData.completionList));
  store.dispatch(
    setNonCompletionList(onboardingProgressData.nonCompletionList),
  );
};

export const updateCurrentUserData = async () => {
  const userData: any = await getUserDataById();
  if (userData?.basicInfo?.userId) {
    updateUserData(userData);
  }
};

export const updateUserData = (userData: any) => {
  const { basicInfo, retirementInfo } = userData;
  store.dispatch(setUserId(basicInfo?.userId));
  store.dispatch(setEmail(basicInfo?.email));
  store.dispatch(handleFirstName(basicInfo?.firstName));
  store.dispatch(handleLastName(basicInfo?.lastName));
  store.dispatch(setCallingCode(basicInfo?.callingCode));
  store.dispatch(setCountryCode(basicInfo?.countryCode));
  store.dispatch(setPhoneNumber(basicInfo?.phone));
  store.dispatch(setCountry(basicInfo?.country));
  store.dispatch(setCitizenship(basicInfo?.citizenship));
  store.dispatch(setDOB(basicInfo?.dob));
  store.dispatch(setAddress(basicInfo?.address));
  if (basicInfo?.profileImage != null) {
    const profileImgUrl = `${api}api/user/profile/${basicInfo?.profileImage}`;
    store.dispatch(setProfilePhoto(profileImgUrl));
  }
  if (basicInfo?.employmentStatus) {
    store.dispatch(
      setEmploymentStatus({ id: null, name: basicInfo?.employmentStatus }),
    );
  }
  if (basicInfo?.ppsnNumber) {
    store.dispatch(setPpsnNo(basicInfo?.ppsnNumber));
  }

  if (retirementInfo?.RetirementPlanId) {
    store.dispatch(setRetireAge(retirementInfo?.retireAge));
    store.dispatch(setRetireAmount(retirementInfo?.retirementIncome));
    const goal: number =
      (80 - retirementInfo?.currentAge) * retirementInfo?.retirementIncome;
    if (goal) {
      store.dispatch(setLifeGoal(goal.toString()));
    }
  }
};

export const addDoitLater = (userId: number, onboardingChecklistId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithoutToken(
        `user/onboarding/skip-steps/create/${userId}/${onboardingChecklistId}`,
      );
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const deleteDoitLater = (
  userId: number,
  onboardingChecklistId: number,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithoutToken(
        `user/onboarding/skip-steps/delete/${userId}/${onboardingChecklistId}`,
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const getDoitLater = (userId: number, onboardingChecklistId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.getWithoutToken(
        `user/onboarding/skip-steps/${userId}/${onboardingChecklistId}`,
      );
      await updatedOnboardingStatusToRedux(response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateUserDetails = (body: RegisterBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.putWithToken(
        'user/update/user-details',
        body,
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const createRetirementPlan = (body: RetirementPlanType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithToken(
        'user/retirement/create',
        body,
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const getRetirementPlanById = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.getWithToken('user/retirement');
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateRetirementPlanByUserId = (body: RetirementPlanType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.putWithToken('user/retirement/edit', body);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
