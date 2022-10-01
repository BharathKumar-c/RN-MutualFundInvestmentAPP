import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AbstractButton, Box } from '../../components';
import { FONTS, SIZES, COLORS } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import Success from './../../assets/lottieAnimations/Success.json';
import { useAppDispatch } from '../../state';
import KeyChainService from '../../service/KeyChainService';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useBackHandler } from '@react-native-community/hooks';

const ThirdStepComplete = ({
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

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
  }, [dispatch]);

  const handleNavigate = () => {
    KeyChainService.setSecureValue(
      'stepStatus',
      JSON.stringify({ statusValue: 3 }),
    );
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
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

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#D1D8D1'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(true));
    }, []),
  );
  return (
    <Box style={styles.container}>
      <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut={true} />
      <Box flexDirection="column" justifyContent="center" alignItems="center">
        <Box ml={20}>
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
            You have completed all registration
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
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
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

export default ThirdStepComplete;
