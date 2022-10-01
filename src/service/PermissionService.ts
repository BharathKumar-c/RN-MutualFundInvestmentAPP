import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_STORAGE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.STOREKIT,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const REQUEST_PERMISSION_TYPE = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  storage: PLATFORM_STORAGE_PERMISSIONS,
};

const PERMISSIONS_TYPE = {
  camera: 'camera',
  storage: 'storage',
};

interface permissionType {
  camera: string;
  storage: string;
}

const checkPermissions = async (type: string): Promise<string> => {
  const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
  if (!permissions) {
    return 'invalid permission';
  }
  try {
    const result = await check(permissions);
    return result;
  } catch (error) {
    return 'cehck';
  }
};

const checkMultiplePermission = async (
  arry: permissionType[],
): Promise<any> => {
  const permissionArr = arry.map(i => {
    return REQUEST_PERMISSION_TYPE[i][Platform.OS];
  });
  try {
    const result = await checkMultiple(permissionArr);
    return result;
  } catch (error) {
    return RESULTS.DENIED;
  }
};

const requestMultiplePermission = async (
  arry: permissionType[],
): Promise<any> => {
  const permissionArr = arry.map(i => {
    return REQUEST_PERMISSION_TYPE[i][Platform.OS];
  });
  try {
    const result = await requestMultiple(permissionArr);
    return result;
  } catch (error) {
    return RESULTS.DENIED;
  }
};

const requestPermisssions = async (type: string): Promise<string> => {
  const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
  try {
    const permissionStatus = await check(permissions);
    if (permissionStatus === RESULTS.BLOCKED) {
      return RESULTS.BLOCKED;
    } else if (permissionStatus === RESULTS.UNAVAILABLE) {
      return RESULTS.UNAVAILABLE;
    } else {
      const result = await request(permissions);
      if (result === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (result === RESULTS.BLOCKED) {
        return RESULTS.BLOCKED;
      } else {
        return RESULTS.DENIED;
      }
    }
  } catch (error) {
    return RESULTS.DENIED;
  }
};

export default {
  PERMISSIONS_TYPE,
  checkPermissions,
  requestPermisssions,
  requestMultiplePermission,
  checkMultiplePermission,
};
