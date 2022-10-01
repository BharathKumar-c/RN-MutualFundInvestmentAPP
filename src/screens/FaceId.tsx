import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Box, AbstractButton } from '../components';
import { COLORS, assets, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeBiometrics from 'react-native-biometrics';
import { showToast } from '../service/ToastService';
import KeyChainService from '../service/KeyChainService';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { setIsEnableBiometrics } from '../state/onboarding';
import { useAppDispatch } from '../state';
import {
  addDoitLater,
  createUserOnboarding,
  getDoitLater,
  getUserDataById,
} from '../service/OnboardingService';
import { CommonActions } from '@react-navigation/native';

const FaceId = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
    getUserId();
  }, []);

  const handleDoItLater = async () => {
    KeyChainService.setSecureValue(
      'isUserEnabledBiometric',
      JSON.stringify({ isEnabled: false }),
    );
    addDoitLater(parseInt(userId), 9); // biometrics photo skip id : 9
    if (route?.params?.doItLaterFlag) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.navigate('ProfilePhoto');
    }
  };

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const enableFaceIdPress = async () => {
    ReactNativeBiometrics.isSensorAvailable()
      .then(resultObject => {
        const { available, biometryType } = resultObject;
        console.log({ available, biometryType });
        KeyChainService.getSecureValue('isUserEnabledBiometric')
          .then(isBinded => {
            if (isBinded === false) {
              if (available) {
                ReactNativeBiometrics.simplePrompt({
                  promptMessage: 'Authenticate',
                })
                  .then(result => {
                    const { success } = result;
                    if (success) {
                      createUserOnboarding(parseInt(userId), 9);
                      KeyChainService.setSecureValue(
                        'isUserEnabledBiometric',
                        JSON.stringify({ isEnabled: true }),
                      );

                      if (route?.params?.doItLaterFlag === 9) {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'ThingsToDoScreen' }],
                          }),
                        );
                      } else {
                        dispatch(setIsEnableBiometrics(true));
                        navigation.navigate('ProfilePhoto');
                      }
                    } else {
                      console.log('user cancelled biometric prompt');
                    }
                  })
                  .catch(e => {
                    if (e?.message) {
                      showToast(e?.message);
                    } else {
                      showToast('biometrics failed');
                      console.log('biometrics failed', e);
                    }
                  });
              } else {
                console.log('sesnor is not available');
                showToast('Sesnor is not available');
              }
            } else {
              if (userId) {
                createUserOnboarding(parseInt(userId), 9);
                KeyChainService.setSecureValue(
                  'isUserEnabledBiometric',
                  JSON.stringify({ isEnabled: true }),
                );
              }
              if (route?.params?.doItLaterFlag === 9) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'ThingsToDoScreen' }],
                  }),
                );
              } else {
                navigation.navigate('ProfilePhoto');
                dispatch(setIsEnableBiometrics(true));
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

    // if (userId) {
    //   createUserOnboarding(parseInt(userId), 9);
    //   KeyChainService.setSecureValue(
    //     'isUserEnabledBiometric',
    //     JSON.stringify({ isEnabled: true }),
    //   );
    // }
  };

  return (
    <Box style={styles.container}>
      <Box>
        <Box pt={190} flexDirection={'column'} style={{ alignItems: 'center' }}>
          <Image source={assets.FaceIdImage} style={styles.FaceIdImage} />
          <Text style={styles.text}>Use Biometrics to login?</Text>
          <Text style={styles.text1}>
            You can use face id / touch id to access your account, so you can
            login faster
          </Text>
        </Box>
      </Box>
      <Box style={styles.continueBtn}>
        <AbstractButton buttonStyle={{}} onPress={enableFaceIdPress}>
          Enable Biometrics
        </AbstractButton>
        <TouchableOpacity
          onPress={() => {
            handleDoItLater();
          }}>
          <Text style={styles.text2}>Do it later</Text>
        </TouchableOpacity>
      </Box>
    </Box>
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
        ? SIZES.screen_height / 1.4
        : SIZES.screen_height / 1.35,
  },
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
  FaceIdImage: {
    width: 80,
    height: 80,
  },
  text: {
    paddingTop: '15%',
    color: COLORS.black,
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.PlayfairDisplayBold,
    lineHeight: 30,
    alignItems: 'center',
  },
  text1: {
    fontSize: SIZES.font,
    fontFamily: FONTS.Merriweather,
    lineHeight: 24,
    color: '#2B2928',
    paddingHorizontal: '20%',
    paddingVertical: '4%',
    textAlign: 'center',
  },
  text2: {
    paddingTop: '8%',
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
});

export default FaceId;
