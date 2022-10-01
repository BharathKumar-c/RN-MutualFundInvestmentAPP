import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text } from 'react-native';
import { AbstractButton, Box } from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../state/generalUtil';
import { useAppDispatch } from '../state';
import { useBackHandler } from '@react-native-community/hooks';
import { CommonActions, useFocusEffect } from '@react-navigation/native';

const ProfileIndexOne = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();

  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#D1D8D1'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      dispatch(hideSafeAreaView());

      return () => {
        dispatch(showSafeAreaView());
      };
    }, []),
  );

  useBackHandler(
    useCallback(() => {
      navigation.navigate('SignUp');
      return true;
    }, []),
  );

  return (
    <Box style={styles.container}>
      <Box flex={4} alignItems="center" justifyContent="center">
        <Box alignItems="center" width={'100%'}>
          <Image source={assets.StepOne} />
        </Box>
      </Box>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box style={styles.strikeLine} />
          <Box style={styles.circleCount}>
            <Text style={styles.circleText}>01</Text>
          </Box>
          <Box style={styles.strikeLine} />
        </Box>
      </Box>
      <Box flex={4} alignItems="center" justifyContent="flex-start">
        <Box
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={300}>
          <Text style={styles.textSubTitle}>
            STEP <Text style={{ fontFamily: FONTS.RobotoMedium }}>1/3</Text>
          </Text>
          <Text style={styles.textTitle}>First tell us about you</Text>
          <Text style={styles.textTitle1}>
            To get your Pension Started we need{'\n'}some personal Information
          </Text>
        </Box>
      </Box>
      <Box
        position={'absolute'}
        paddingHorizontal={20}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        width="70%"
        style={{ bottom: SIZES.screen_height / 11 }}>
        <AbstractButton
          textStyle={styles.nextBtn}
          onPress={() => {
            navigation.navigate('TellUsAboutYou');
          }}>
          Continue
        </AbstractButton>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1D8D1',
    paddingVertical: 20,
  },

  circleCount: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.black,
    transform: [{ scaleX: 1 }],
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  circleText: {
    fontFamily: FONTS.RobotoMedium,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 0,
    color: COLORS.black,
  },

  strikeLine: {
    width: '45%',
    borderWidth: 0.7,
    borderColor: '#00000',
  },

  textSubTitle: {
    marginTop: 30,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0,
    textTransform: 'uppercase',
    color: '#145650',
  },

  textTitle: {
    paddingTop: 20,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0,
    color: COLORS.black,
  },

  textTitle1: {
    paddingTop: 20,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0,
    color: COLORS.black,
  },

  contentText: {
    marginTop: 20,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0,
    color: '#2B2928',
  },

  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default ProfileIndexOne;
