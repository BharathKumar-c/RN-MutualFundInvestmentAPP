import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { assets, COLORS, FONT_WEIGHT, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../state';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { Box } from '../components';

const Splash = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();

  // Status bar color setting
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primaryDrakGreen));
    dispatch(setBarStyle('light-content'));
  }, []);

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(moveAnim, {
      toValue: 190,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('SignIn');
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[styles.logo, { transform: [{ translateY: moveAnim }] }]}>
          <Image source={assets.LogoLight} style={styles.logo} />
        </Animated.View>
        <View>
          <Image source={assets.MarshmallowLight} style={styles.logoTitle} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primaryDrakGreen,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    bottom: SIZES.screen_height / 2.55,
    width: 96,
    height: 128,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoTitle: {
    width: 300,
    height: 37.5,
  },
});

export default Splash;
