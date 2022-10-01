import * as Keychain from 'react-native-keychain';

type SetSecureValue = (key: string, value: string) => Promise<any>;
type GetSecureValue = (key: string) => Promise<string | false>;
type RemoveSecureValue = (key: string) => Promise<void>;

type SetIsInstallValue = (key: string, value: string) => Promise<any>;
type GetIsInstallValue = (key: string) => Promise<string | false>;
type RemoveIsInstallValue = (key: string) => Promise<void>;

/** With internet credentials */

const setSecureValue: SetSecureValue = (key, value) =>
  Keychain.setInternetCredentials(key, key, value);

const getSecureValue: GetSecureValue = async key => {
  const result = await Keychain.getInternetCredentials(key);
  if (result) {
    return result.password;
  }
  return false;
};

const removeSecureValue: RemoveSecureValue = key =>
  Keychain.resetInternetCredentials(key);

export default { setSecureValue, getSecureValue, removeSecureValue };
