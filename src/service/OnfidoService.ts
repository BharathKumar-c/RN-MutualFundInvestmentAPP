import {
  Onfido,
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType,
} from '@onfido/react-native-sdk';
import { setOnfidoSDKToken } from '../state/onboarding/StepTwo';
import ApiUtil from '../util/ApiUtil';
import store from '../state';

export const getOnfidoSDKToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ApiUtil.getWithToken('user/onfido/sdkToken');
      store.dispatch(setOnfidoSDKToken(data.token));
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const startOnfidoSDK = (sdkToken: string, docType: string) => {
  console.log({ docType });
  const flowSteps: any = {
    welcome: false,
    captureDocument: {
      docType: docType, //OnfidoDocumentType.DRIVING_LICENCE,
      countryCode: OnfidoCountryCode.IRL,
    },
  };

  if (docType !== 'GENERIC') {
    flowSteps.welcome = true;

    flowSteps.captureFace = {
      type: OnfidoCaptureType.PHOTO,
    };
  }

  return Onfido.start({
    sdkToken,
    flowSteps: flowSteps,
  });
};

export const updateScan = (type: string, document: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ApiUtil.postWithToken('user/onfido/updateScan', { type, document });
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
