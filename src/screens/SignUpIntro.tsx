import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AbstractButton, Box } from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../state';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../state/generalUtil';

const SignUpIntro = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList>) => {
  const [showRealApp, setShowRealApp] = useState(false);
  const dispatch = useAppDispatch();
  let slider: AppIntroSlider | undefined;
  var i = 1;
  let timeout: any;

  const tick = () => {
    slider?.goToSlide(i); //this.slider is ref of <AppIntroSlider....
    i += 1;

    if (i > slides.length) {
      console.log('hey im calling fromhere');
      onDone();
    }
  };

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('transparent'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(true));
      timeChange();
      return () => {
        dispatch(setTranslucent(false));
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]),
  );

  useEffect(() => {
    return () => {
      clearInterval(timeout);
    };
  }, [timeout]);

  const onDone = () => {
    setShowRealApp(false);
    dispatch(showSafeAreaView());
    navigation.replace('SignUp');
    clearInterval(timeout);
  };

  const onSlideChange = () => {
    clearInterval(timeout);
    i = i == 0 ? 1 : 0;
    slider?.goToSlide(i);
    timeChange();
  };

  const timeChange: () => any = () => {
    timeout = setInterval(() => {
      tick();
    }, 3000);
  };

  const slides = [
    {
      key: 1,
      logo: assets.logo,
      title: 'Take control of your retirement today ',
      image: assets.Frame1,
      container: styles.container,
      frameStyle: styles.frame,
    },
    {
      key: 2,
      logo: assets.logo,
      title: 'Help everyone enjoy a happy retirement',
      image: assets.Frame2,
      frameStyle: styles.frame2,
      container: styles.container2,
    },
  ];

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Box flex={1} alignItems={'baseline'} justifyContent={'center'}>
        <Box style={item.container}>
          <Image source={item.logo} style={styles.logo} />
          <Box style={styles.titleBox}>
            <Text style={styles.title}>{item.title}</Text>
            <Image source={item.image} style={item.frameStyle} />
          </Box>
        </Box>
        <Box style={styles.signinBox}>
          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ color: 'blue' }}
              onPress={() => {
                clearInterval(timeout);
                dispatch(showSafeAreaView());
                navigation.navigate('SignIn');
                setShowRealApp(false);
              }}>
              Sign in
            </Text>
          </Text>
          <AbstractButton
            buttonStyle={styles.skipBtn}
            textStyle={styles.skipText}
            onPress={() => {
              dispatch(showSafeAreaView());
              navigation.replace('SignUp');
              clearInterval(timeout);
              setShowRealApp(false);
            }}>
            Skip
          </AbstractButton>
        </Box>
      </Box>
    );
  };

  return (
    <>
      {!showRealApp && (
        <View style={styles.slide}>
          <AppIntroSlider
            onDone={onDone}
            renderItem={renderItem}
            data={slides}
            showNextButton={false}
            showDoneButton={false}
            activeDotStyle={styles.activeButton}
            dotStyle={styles.inActiveButton}
            ref={ref => (slider = ref!)}
            onSlideChange={onSlideChange}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#E2DDC8',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: FONTS.PlayfairDisplayBold,
  },
  logo: {
    height: 66,
    width: 50,
    right: 10,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'center',
    lineHeight: 30,
    width: 269,
  },
  titleContainer: {
    top: '5%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dividerContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dividerIcon: {
    width: 42,
    height: 4,
    top: 90,
    right: 17,
  },
  frame: {
    width: 280,
    height: 270,
    marginTop: 85,
    transform: [{ scale: 1.3 }],
  },
  frame2: {
    width: 300,
    height: 278,
    marginTop: 100,
  },
  signinBox: {
    position: 'absolute',
    alignItems: 'center',
    width: SIZES.screen_width,
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.2
        : SIZES.screen_height / 1.22,
  },
  skipBtn: {
    // height: 35,
    // borderRadius: 20,
    // width: '20%',
    height: 54,
    borderRadius: 100,
    width: '85%',
    margin: 10,
  },
  skipText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    color: COLORS.white,
  },
  signinText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: 25,
    textAlign: 'center',
    color: COLORS.black,
    margin: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#E2DDC8',
    paddingTop: '20%',
  },
  container2: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#BAC7BA',
    paddingTop: '20%',
  },
  titleBox: {
    marginHorizontal: '15%',
    paddingTop: '5%',
  },
  activeButton: {
    backgroundColor: 'black',
    width: 24,
    height: 4,

    marginBottom: SIZES.screen_height / 0.84,
  },
  inActiveButton: {
    backgroundColor: 'black',
    width: 4,
    height: 4,

    marginBottom: SIZES.screen_height / 0.84,
  },
});

export default SignUpIntro;
