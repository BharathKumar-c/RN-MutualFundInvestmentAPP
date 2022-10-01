import React, { useCallback, useRef, useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text } from 'react-native';
import { AbstractButton, Box } from '../../components';
import { assets, FONTS, SIZES, COLORS } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import Success from './../../assets/lottieAnimations/Success.json';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { useAppDispatch } from '../../state';
import KeyChainService from '../../service/KeyChainService';
import { CommonActions } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { getDoitLater, getUserDataById } from '../../service/OnboardingService';
import { useBackHandler } from '@react-native-community/hooks';

const SecondStepComplete = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const animation = useRef(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    animation.current.play(0, 100);
    setTimeout(() => {
      animation.current.play(63.5, 63);
    }, 1600);
  }, []);
  useEffect(() => {
    dispatch(setStatusbarColor('#D1D8D1'));
    dispatch(setBarStyle('dark-content'));
    return () => {
      dispatch(setTranslucent(false));
    };
  }, []);

  const handleNavigate = async () => {
    KeyChainService.setSecureValue(
      'stepStatus',
      JSON.stringify({ statusValue: 2 }),
    );

    const userData: any = await getUserDataById();
    const skipData: any = await getDoitLater(
      parseInt(userData.basicInfo?.userId),
      1,
    );
    if (skipData?.userData?.userId) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'StepThreeInitialScreen' }],
        }),
      );
    }
  };

  useBackHandler(
    useCallback(() => {
      if (route?.params?.doItLaterFlag) {
        navigation.navigate('ThingsToDoScreen');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          }),
        );
      }
      return true;
    }, [route]),
  );

  return (
    <Box style={styles.container}>
      {/* <StatusBar backgroundColor="#D1D8D1" barStyle="dark-content" /> */}
      <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut={true} />

      <Box flexDirection="column" justifyContent="center" alignItems="center">
        <Box ml={20}>
          {/* <Image source={assets.SuccessIcon} /> */}
          <LottieView
            ref={animation}
            style={styles.successLottie}
            source={Success}
            autoPlay={false}
            loop={false}
          />
        </Box>
        <Box mt={40}>
          <Text style={styles.titleText}>
            Second step completed. Now let’s continue!
          </Text>
        </Box>
        <Box
          mt={50}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="70%">
          <AbstractButton
            textStyle={styles.continueBtn}
            onPress={handleNavigate}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#D1D8D1',
    paddingHorizontal: 38,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0,
    width: 269,
    height: 60,
  },
  successIcon: {
    width: 300,
    height: 300,
    left: 38,
    top: 181,
  },
  continueBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
  successLottie: {
    width: 300,
    height: 300,
    marginLeft: -5,
  },
});

export default SecondStepComplete;
