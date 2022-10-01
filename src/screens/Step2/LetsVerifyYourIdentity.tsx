import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AbstractButton, Box } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { useAppDispatch } from '../../state';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { getOnfidoSDKToken } from '../../service/OnfidoService';
import {
  addDoitLater,
  getDoitLater,
  getUserDataById,
} from '../../service/OnboardingService';
import { useBackHandler } from '@react-native-community/hooks';

const LetsVerifyYourIdentity = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#D1D8D1'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      return () => {
        dispatch(setTranslucent(false));
      };
    }, []),
  );

  useEffect(() => {
    getOnfidoSDKToken();
    getUserId();
  }, []);

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
  }, [dispatch]);

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const doItLater = async () => {
    addDoitLater(parseInt(userId), 1); // verify identity skip id : 1
    navigation.navigate('StepThreeInitialScreen');
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
      <Box
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Box alignItems="center" width={'100%'}>
          <Image source={assets.StepTwo} style={styles.StepTwo} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box style={styles.strikeLine} />
          <Box style={styles.circleCount}>
            <Text style={styles.circleText}>02</Text>
          </Box>
          <Box style={styles.strikeLine} />
        </Box>
        <Box
          mt={15}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={350}>
          <Text style={styles.textSubTitle}>
            STEP <Text style={{ fontFamily: FONTS.RobotoMedium }}>2/3</Text>
          </Text>
          <Text numberOfLines={1} style={styles.textTitle}>
            Let's verify your identity
          </Text>
        </Box>
      </Box>
      <Box
        mt={10}
        mb={30}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        width="70%">
        <AbstractButton
          buttonStyle={{ margin: 10 }}
          onPress={() => {
            navigation.navigate('SelectIdentityType');
          }}
          textStyle={styles.nextBtn}>
          Continue
        </AbstractButton>
        <TouchableOpacity onPress={doItLater}>
          <Text style={styles.skipBtn}>Do it later</Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    width: '50%',
    borderWidth: 0.7,
    borderColor: '#00000',
  },

  textSubTitle: {
    marginTop: 20,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0,
    textTransform: 'uppercase',
    color: '#145650',
  },

  textTitle: {
    marginTop: 20,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0,
    color: COLORS.black,
    minwidth: 280,
  },

  contentText: {
    marginTop: 20,
    fontFamily: FONTS.Merriweather,
    fontSize: 14,
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
  StepTwo: {
    width: 327,
    height: 240,
  },
  skipBtn: {
    paddingTop: '8%',
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
});

export default LetsVerifyYourIdentity;
