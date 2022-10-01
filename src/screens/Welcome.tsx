import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Box } from '../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../state/generalUtil';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../state';
import { useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';

interface Props {}

function Welcome({ navigation }: { navigation: any }) {
  const dispatch = useAppDispatch();
  let clearTimerRef = useRef();
  useEffect(() => {
    clearTimerRef.current = setTimeout(() => {
      navigation.navigate('ProfileIndexOne');
    }, 2000);

    return () => clearTimeout(clearTimerRef.current);
  }, []);

  const romoveTimeOut = () => {
    clearTimeout(clearTimerRef.current);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#D1D8D1'));
      dispatch(setTranslucent(true));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
    }, []),
  );

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
  }, [dispatch]);

  useBackHandler(
    useCallback(() => {
      navigation.navigate('SignUp');
      romoveTimeOut();
      return true;
    }, []),
  );

  return (
    <Box style={styles.container}>
      <ImageBackground
        source={assets.BackgroundPatternOne}
        style={styles.image}>
        <Box style={styles.insideContainer}>
          <Image source={assets.LogoMdSize} style={styles.logo} />
          <Text style={styles.titleText1}>
            Welcome. Let's get your{'\n'}account set up
          </Text>
        </Box>
      </ImageBackground>
    </Box>
  );
}

const styles = StyleSheet.create({
  insideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#D1D8D1',
    justifyContent: 'center',
    alignContent: 'center',
  },
  titleText1: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.32,
    textAlign: 'center',
    paddingLeft: '8%',
    paddingRight: '10%',
    paddingTop: '4%',
  },
  logo: {
    position: 'absolute',
    bottom: SIZES.screen_height / 1.83,
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Welcome;
