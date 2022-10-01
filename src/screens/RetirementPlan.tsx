import { useBackHandler } from '@react-native-community/hooks';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AbstractButton, Box } from '../components';
import { assets, COLORS, FONTS } from '../constants';
import { RootDrawerParamList } from '../navigation/DrawerNavigation/types';
import { addDoitLater, getUserDataById } from '../service/OnboardingService';
import { useAppDispatch } from '../state';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
  hideSafeAreaView,
  hideSafeAreaViewBottom,
} from '../state/generalUtil';
import { RootState } from '../state/rootReducer';

const RetirementPlan = ({
  route,
  navigation,
}: NativeStackScreenProps<RootDrawerParamList>) => {
  const { dob } = useSelector((state: RootState) => state.onboarding);
  var years = moment().diff(moment(dob), 'years', false);
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');

  useLayoutEffect(() => {
    dispatch(hideSafeAreaViewBottom());

    return () => {
      dispatch(hideSafeAreaView());
    };
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      // dispatch(hideSafeAreaViewBottom());

      // return () => {
      //   dispatch(hideSafeAreaViewBottom());
      // };
    }, [dispatch]),
  );

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const doItLater = async () => {
    addDoitLater(parseInt(userId), 5); // set your goal skip id : 5
    if (route?.params?.doItLaterFlag === 5) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.navigate('Dashboard');
    }
  };

  useBackHandler(
    useCallback(() => {
      if (route?.params?.doItLaterFlag === 5) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'ThingsToDoScreen' }],
          }),
        );
      } else {
        navigation.goBack();
      }
      return true;
    }, [navigation]),
  );

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={assets.BackIcon} style={styles.image} />
        </TouchableOpacity>
      </Box>
      <ImageBackground
        source={assets.BoatOnSea}
        resizeMode="cover"
        style={styles.wrapper}>
        <Box mt={30}>
          <Text style={styles.topTitleText}>RETIREMENT PLAN</Text>
        </Box>
        <Box mt={10}>
          <Text style={styles.titleText}>
            Setting up a yearly goal{'\n'}helps your plan for{'\n'}retirement.
          </Text>
        </Box>
      </ImageBackground>
      <ImageBackground
        source={assets.BoatOnSea1}
        resizeMode="cover"
        style={styles.bottomCoverImg}>
        <Box
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%">
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => {
              const id = route?.params?.doItLaterFlag;
              if (id) {
                navigation.navigate('WhatRetireAgeScreen', {
                  doItLaterFlag: id,
                });
              } else {
                navigation.navigate('WhatRetireAgeScreen');
              }
            }}>
            Calculate goal
          </AbstractButton>
          <TouchableOpacity onPress={doItLater}>
            <Text style={styles.btnText}>Do it later</Text>
          </TouchableOpacity>
        </Box>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background.primary,
    paddingTop: 20,
  },
  wrapper: {
    flex: 1,
  },
  bottomCoverImg: {
    marginTop: '-9.8%',
    height: 200,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topTitleText: {
    color: COLORS.green,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: -0.32,
  },
  text: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 10,
    lineHeight: 16,
    color: '#2B2928',
    textAlign: 'center',
  },
  text1: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 32,
    lineHeight: 36,
    color: '#1A6A73',
    textAlign: 'center',
    letterSpacing: -2,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  btnText: {
    color: 'black',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0.3,
    paddingTop: '5%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    // marginTop: 20,
    paddingLeft: 20,
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default RetirementPlan;
