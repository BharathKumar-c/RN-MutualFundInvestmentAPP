import store from '../state';
import ReactNativeBiometrics from 'react-native-biometrics';
import { setIsBiometricsAvailablet } from '../state/generalUtil';
import { showToast } from './ToastService';

export const checkAndUpdateBiometricAvailability = () => {
  ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
    const { available } = resultObject;
    store.dispatch(setIsBiometricsAvailablet(!!available));
  });
};

export const authenticateBiometric = ({
  cancelButtonText,
}: {
  cancelButtonText: string;
}) => {
  return new Promise((resolve, reject) => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;

      console.log({ available, biometryType });

      if (available) {
        ReactNativeBiometrics.simplePrompt({
          promptMessage: 'Authenticate',
          cancelButtonText,
        })
          .then(result => {
            const { success } = result;

            if (success) {
              resolve(true);
            } else {
              reject(true);
            }
          })
          .catch(e => {
            reject(true);
            if (e?.message) {
              showToast(e?.message);
            } else {
              showToast('biometrics failed');
              console.log('biometrics failed', e);
            }
          });
      } else {
        reject(true);
        console.log('sesnor is not available');
      }
    });
  });
};
