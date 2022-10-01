import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AbstractButton, Box } from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';

import { useSelector } from 'react-redux';
import KeyChainService from '../service/KeyChainService';
import {
  addDoitLater,
  createUserOnboarding,
  register,
  uploadProfileImage,
} from '../service/OnboardingService';
import { RootState } from '../state/rootReducer';

import { useBackHandler } from '@react-native-community/hooks';
import moment from 'moment';
import ReactNativeBiometrics from 'react-native-biometrics';
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '../service/ToastService';
import { useAppDispatch } from '../state';
import {
  setBarStyle,
  setStatusbarColor,
  setIsHeaderNavigation,
} from '../state/generalUtil';
import { setIsEnableBiometrics, setUserId } from '../state/onboarding';

const ConfirmDetails = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const {
    userId,
    firstName,
    lastName,
    country,
    citizenship,
    phoneNumber,
    email,
    dob,
    callingCode,
    countryCode,
    createPassword,
    emailToken,
    phoneToken,
    address,
    profilePhoto,
    isEnableBiometrics,
  } = useSelector((state: RootState) => state.onboarding);

  const [loader, setLoader] = useState(false);
  const dispatch = useAppDispatch();
  const flag = true;
  console.log({ citizenship, country });

  const onContinuePress = async () => {
    dispatch(setIsHeaderNavigation( ''));
    setLoader(true);
    try {
      const data: any = await register({
        email,
        firstName,
        lastName,
        password: createPassword?.password,
        country,
        citizenship,
        countryCode,
        callingCode,
        phone: phoneNumber,
        dob,
        emailToken,
        phoneToken,
        address,
      });

      if (data?.user?.userId && profilePhoto.url != '') {
        await uploadProfileImage(profilePhoto.url, data?.user?.userId);
        createUserOnboarding(parseInt(data?.user?.userId), 10);
      } else if (profilePhoto.url == '') {
        addDoitLater(data?.user?.userId, 10); // profile skip id is : 10
      }

      if (data?.user?.userId && isEnableBiometrics) {
        KeyChainService.setSecureValue(
          'isUserEnabledBiometric',
          JSON.stringify({ isEnabled: true }),
        );
        createUserOnboarding(parseInt(data?.user?.userId), 9);
      } else {
        addDoitLater(data?.user?.userId, 9); // profile skip id : 9
      }

      setLoader(false);
      KeyChainService.setSecureValue(
        'stepStatus',
        JSON.stringify({ statusValue: 0.75 }),
      );

      if (data?.user?.userId) {
        dispatch(setUserId(data?.user?.userId));
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChooseYourPlan' }],
        }),
      );
    } catch (error) {
      console.log(error);
      setLoader(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChooseYourPlan' }],
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, [navigation]),
  );

  return (
    <Box style={styles.container}>
      <Box flex={1} mt={30}>
        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            <Text style={styles.titleText}>
              Confirm your {'\n'}personal details
            </Text>
          </Box>
          <Box>
            <Image style={styles.titleImage} source={assets.ConfirmDetail} />
          </Box>
        </Box>
        <Box
          mt={20}
          style={{
            maxHeight: SIZES.screen_height,
            height: SIZES.screen_height / 1.65,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TellUsAboutYou', { flag });
                  dispatch(setIsHeaderNavigation( 'ConfirmDetails'));
                }}>
                <Text style={styles.label}>LEGAL NAME</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text style={styles.textInput}>
                    {`${firstName} ${lastName}`}
                  </Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TellUsAboutYou2', { flag });
                  dispatch(setIsHeaderNavigation('ConfirmDetails'));
                }}>
                <Text style={styles.label}>COUNTRY OF BIRTH</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text style={styles.textInput}>{country}</Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <Text style={styles.label}>CITIZENSHIP</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center"
                  style={styles.fieldLine}>
                  <Text style={styles.citizenshipTextInput}>{citizenship}</Text>
                  {/* <Image style={styles.imageStyle} source={assets.ArrowRight} /> */}
                </Box>
              </Box>
            </Box>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TellUsAboutYou2', { flag });
                  dispatch(setIsHeaderNavigation('ConfirmDetails'));
                }}>
                <Text style={styles.label}>DATE OF BIRTH</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text
                    style={[
                      styles.textInput,
                      { fontFamily: FONTS.RobotoRegular },
                    ]}>
                    {moment(dob).format('DD/MM/YYYY')}
                  </Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUp', { flag });
                    dispatch(setIsHeaderNavigation('ConfirmDetails'));
                  }}>
                  <Text style={styles.label}>MOBILE NUMBER</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center">
                    <Text
                      style={[
                        styles.textInput,
                        { fontFamily: FONTS.RobotoRegular },
                      ]}>
                      {`+(${callingCode})   ${phoneNumber}`}
                    </Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUp', { flag });
                    dispatch(setIsHeaderNavigation('ConfirmDetails'));
                  }}>
                  <Text style={styles.label}>EMAIL</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center">
                    <Text style={styles.textInput}>{email}</Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FindYourAddress', { flag });
                    dispatch(setIsHeaderNavigation('ConfirmDetails'));
                  }}>
                  <Text style={styles.label}>ADDRESS</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Text style={styles.textInput}>{address}</Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
      <Box style={styles.continueBtn}>
        <AbstractButton
          loader={loader}
          onPress={
        
            onContinuePress
          }
          textStyle={styles.nextBtn}>
          Continue
        </AbstractButton>
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
        ? SIZES.screen_height / 1.28
        : SIZES.screen_height / 1.22,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    top: 20,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
  },
  titleImage: {
    width: 113,
    height: 94,
    marginRight: 20,
  },
  citizenshipTextInput: {
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    // lineHeight: 24,
    color: '#000000',
    paddingVertical: 10,
    paddingRight: '5%',
  },
  fieldLine: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 1,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 10,
    borderColor: '#e5e5e5',
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 10,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.white,
  },
  imageStyle: {
    position: 'absolute',
    left: '98%',
  },
});

export default ConfirmDetails;
