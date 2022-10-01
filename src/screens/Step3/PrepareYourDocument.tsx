import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../state';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import {
  getOnfidoSDKToken,
  startOnfidoSDK,
  updateScan,
} from '../../service/OnfidoService';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import {
  createUserOnboarding,
  getUserDataById,
} from '../../service/OnboardingService';
import PermissionService from '../../service/PermissionService';
import { useBackHandler } from '@react-native-community/hooks';

interface permissionType {
  camera: any;
  storage: any;
}

const { PERMISSIONS_TYPE, requestMultiplePermission } = PermissionService;

interface Props {
  navigation: any;
  route: any;
}
const PrepareYourDocument = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList> & Props) => {
  const PermissionsType: permissionType = PERMISSIONS_TYPE;
  const dispatch = useAppDispatch();
  const ONBOARDINGCHECKLISTID = 1;
  const [isDisable, setIsDisable] = useState(false);
  const doItLaterFlag: any = route?.params?.doItLaterFlag;

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
      getOnfidoSDKToken();
    }, []),
  );

  useBackHandler(
    useCallback(() => {
      navigation.navigate('SelectDocumentScreen');
      return true;
    }, [navigation]),
  );

  const { documentType, documentTypeList } = useSelector(
    (state: RootState) => state.onboardingStepThree,
  );
  const { onfidoSDKToken } = useSelector(
    (state: RootState) => state.onboardingStepTwo,
  );

  const onContinueClick = async () => {
    setIsDisable(true);
    await requestMultiplePermission([PermissionsType.camera])
      .then(result => {
        const camAccess = result[`${Platform.OS}.permission.CAMERA`];
        if (camAccess === 'blocked') {
          navigation.navigate('CameraAccessDenied');
        } else if (camAccess === 'granted') {
          if (doItLaterFlag) {
            navigation.navigate('DocumentScanner', { doItLaterFlag });
          } else {
            navigation.navigate('DocumentScanner');
          }
        } else {
          navigation.navigate('CameraAccessDenied');
        }
      })
      .catch(err => {
        console.log(err);
        return false;
      });

    setIsDisable(false);
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box width={'100%'}>
          <Box alignItems="center" mt={60} width="100%">
            <Image source={assets.PrepareYourDocument} />
          </Box>
          <Text style={styles.titleText}>Prepare your document for scan</Text>
          <Box mt={10}>
            <Text style={styles.text}>
              We need you to take a picture of the ID document that you had
              selected. Click on continue to begin.
            </Text>
            <Text style={styles.text1}>Show me example</Text>
          </Box>
        </Box>
        <Box style={styles.continueBtn}>
          <AbstractButton
            textStyle={styles.nextBtn}
            disabled={isDisable}
            onPress={() => onContinueClick()}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.28
        : SIZES.screen_height / 1.24,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: '20%',
  },
  text: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    color: '#2B2928',
    textAlign: 'center',
    paddingHorizontal: '10%',
    lineHeight: 24,
  },
  text1: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    color: '#1A6A73',
    textAlign: 'center',
    paddingTop: '5%',
    lineHeight: 21,
  },
  circleCount: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.black,
    transform: [{ scaleX: 1 }],
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  circleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
    color: COLORS.black,
  },
  strikeLine: {
    height: '15%',
    width: 0,
    borderWidth: 0.7,
    borderColor: '#00000',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
});

export default PrepareYourDocument;
