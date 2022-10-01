import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../../components';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState, useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { useSelector } from 'react-redux';
import {
  getOnfidoSDKToken,
  startOnfidoSDK,
  updateScan,
} from '../../service/OnfidoService';
import PermissionService from '../../service/PermissionService';
import {
  createUserOnboarding,
  getCurrentOnboardingStatus,
  getDoitLater,
  getUserDataById,
} from '../../service/OnboardingService';
import { CommonActions } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PrepareYourId = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  console.log({ route });

  const { identityType, identityTypeList, onfidoSDKToken } = useSelector(
    (state: RootState) => state.onboardingStepTwo,
  );
  const { userId } = useSelector((state: RootState) => state.onboarding);
  const [isDisable, setIsDisable] = useState(false);
  const { PERMISSIONS_TYPE, requestMultiplePermission } = PermissionService;

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
    getOnfidoSDKToken();
  }, []);

  useBackHandler(
    useCallback(() => {
      navigation.navigate('SelectIdentityType');
      return true;
    }, [navigation]),
  );

  const onFidoProcess = async () => {
    const docType = identityTypeList.find(({ id }) => id === identityType);
    try {
      await startOnfidoSDK(onfidoSDKToken, docType?.value)
        .then((result: any) => {
          updateScan('identity', result);
          handleContinue();
        })
        .catch((error: any) => {
          console.log({ error });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = async () => {
    if (userId) {
      await createUserOnboarding(userId, 1);
      if (route?.params?.doItLaterFlag) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'ThingsToDoScreen' }],
          }),
        );
      } else {
        navigation.navigate('SecondStepComplete');
      }
    }
  };

  const onContinueClick = async () => {
    setIsDisable(true);
    await requestMultiplePermission([
      PERMISSIONS_TYPE.camera,
      //   PERMISSIONS_TYPE.storage,
    ])
      .then(result => {
        const camAccess = result[`${Platform.OS}.permission.CAMERA`];
        /*   const storageAccess =
          result[`${Platform.OS}.permission.WRITE_EXTERNAL_STORAGE`]; */

        if (camAccess === 'blocked') {
          navigation.navigate('CameraAccessDenied');
        } else if (camAccess === 'granted') {
          // navigation.navigate('PrepareYourId');
          onFidoProcess();
        } else {
          navigation.navigate('CameraAccessDenied');
        }
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box alignItems="center" width="100%" mt={30}>
          <Image source={assets.PrepareYourId} />
        </Box>
        <Text style={styles.titleText}>Prepare your ID for scan </Text>

        <Box mt={10}>
          <Text style={styles.text}>
            We need you to take a picture of the ID document that you had
            selected. Click on continue to begin.
          </Text>
          <Text style={styles.text1}>Show me example</Text>
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
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? SIZES.padding : SIZES.padding,
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

export default PrepareYourId;
