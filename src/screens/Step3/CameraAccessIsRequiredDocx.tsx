import React, { useEffect, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Box, AbstractButton } from '../../components';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { useAppDispatch } from '../../state';
import PermissionService from '../../service/PermissionService';
import { setCameraPermissionStatus } from '../../state/permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useBackHandler } from '@react-native-community/hooks';

const CameraAccessIsRequiredDocx = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { PERMISSIONS_TYPE, checkPermissions, requestPermisssions } =
    PermissionService;
  const { cameraPermissionStatus } = useSelector(
    (state: RootState) => state.permission,
  );
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
    dispatch(setTranslucent(false));
  }, []);

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, [navigation]),
  );

  const handleEnableCamera = async () => {
    if (!cameraPermissionStatus) {
      const pmtStatus = await requestPermisssions(PERMISSIONS_TYPE.camera);
      if (pmtStatus === 'granted') {
        dispatch(setCameraPermissionStatus(pmtStatus));
        navigation.navigate('PrepareYourDocument');
      } else {
        dispatch(setCameraPermissionStatus(pmtStatus));
        navigation.navigate('CameraAccessDeniedDocx');
      }
    } else if (cameraPermissionStatus === 'denied') {
      navigation.navigate('CameraAccessDeniedDocx');
    }
  };
  return (
    <Box style={styles.container}>
      <Box flex={1}>
        <Box mt={100} flexDirection={'column'} style={{ alignItems: 'center' }}>
          <Image source={assets.CameraAccess} style={styles.image} />
        </Box>
        <Box style={styles.textBox}>
          <Text style={styles.text}>Camera access is required</Text>
          <Text style={styles.text1}>
            When prompted, you must enable camera access to continue
          </Text>
        </Box>
      </Box>
      <Box
        mb={50}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        width="90%">
        <AbstractButton onPress={handleEnableCamera}>
          Enable camera
        </AbstractButton>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background.primary,
  },
  container1: {
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  image: {
    width: 327,
    height: 240,
    borderRadius: 12,
  },
  text: {
    paddingHorizontal: '15%',
    color: COLORS.black,
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.PlayfairDisplayBold,
    lineHeight: 30,
    alignItems: 'center',
    textAlign: 'center',
  },
  textBox: {
    alignItems: 'center',
  },
  text1: {
    fontSize: SIZES.font,
    fontFamily: FONTS.MerriweatherRegular,
    lineHeight: 24,
    color: '#2B2928',
    paddingHorizontal: '15%',
    paddingVertical: '4%',
    textAlign: 'center',
  },
});

export default CameraAccessIsRequiredDocx;
