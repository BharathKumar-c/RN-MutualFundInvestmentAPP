import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import { AbstractButton, Box, OTPInputFields } from '../../components';
import { RootState } from '../../state/rootReducer';
import { useSelector } from 'react-redux';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { updateCurrentUserData } from '../../service/OnboardingService';
import {
  verifyOtp,
  sendOtp,
  updateUserDetails,
} from '../../service/OnboardingService';
import { configureStore } from '@reduxjs/toolkit';
import { MaterialIndicator } from 'react-native-indicators';
import { useAppDispatch } from '../../state';
import {
  setCallingCode,
  setCountryCode,
  setEmail,
  setEmailToken,
  setEmailVerified,
  setPhoneNumber,
  setPhoneToken,
  setPhoneVerified,
  setVerifiedEmail,
  setVerifiedPhone,
} from '../../state/onboarding';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';

const window = Dimensions.get('window');
const VerifyOtp = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>) => {
  // Declaration
  const MAX_CODE_LENGTH = 4;
  const [emailCode, setEmailCode] = useState('');
  const [emailPinReady, setEmailPinReady] = useState(false);
  const [mobileCode, setMobileCode] = useState('');
  const [mobilePinReady, setMobilePinReady] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const { callCode, cca2Code, userEmail, userPhone }: any = route?.params;

  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);
  let resendOtpTimerInterval: any;
  const [clear, setClear] = useState('');
  const [emailVerify, setEmailverify] = useState(false);
  const [phoneVerify, setPhoneverify] = useState(false);

  const _IsOtpSentTo = route?.params?.isOtpSentTo
    ? route?.params?.isOtpSentTo
    : null;

  // Statusbar
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
    }, []),
  );

  const setPinempty = () => {
    setEmailCode('');
    setMobileCode('');
  };

  useEffect(() => {
    if (emailCode && mobileCode) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  }, [emailCode, mobileCode, navigation]);

  const verify = async () => {
    if (userEmail) {
      setLoader(true);
      setClear('');
      await verifyOtp(userEmail, 'email', emailCode)
        .then(otpEmailVerify => {
          setLoader(false);
          setErrorEmail('');
          dispatch(setEmailToken(otpEmailVerify.token));
          dispatch(setEmailVerified(true));
          dispatch(setVerifiedEmail(userEmail));
          setEmailverify(true);
          userEmail && dispatch(setEmail(userEmail));
        })
        .catch((err: any) => {
          if (err?.response?.status === 400) {
            setErrorEmail(err?.response?.data?.message);
            setLoader(false);
            dispatch(setEmailVerified(false));
            setEmailverify(false);
          } else {
            setLoader(false);
            setErrorEmail('UnKnown Error');
            dispatch(setEmailVerified(false));
            setEmailverify(false);
          }
        });
    }
    if (userPhone) {
      setLoader(true);
      try {
        const otpVerifyphone = await verifyOtp(
          ('+' + callCode + userPhone).toString(),
          'phone',
          mobileCode,
        );
        setErrorPhone('');
        setLoader(false);
        dispatch(setPhoneToken(otpVerifyphone.token));
        dispatch(setPhoneVerified(true));
        dispatch(setVerifiedPhone(userPhone));
        setPhoneverify(true);
        userPhone && dispatch(setPhoneNumber(userPhone));
        callCode && dispatch(setCallingCode(callCode));
        cca2Code && dispatch(setCountryCode(cca2Code));
      } catch (err: any) {
        if ('phone' && err?.response?.status === 400) {
          setErrorPhone(err?.response?.data?.message);
          setLoader(false);
          dispatch(setPhoneVerified(false));
          setPhoneverify(false);
        } else {
          setLoader(false);
          setErrorPhone('UnKnown Error');
          dispatch(setPhoneVerified(false));
          setPhoneverify(false);
        }
      }
    }

    // await updateUserDetails({
    //   email: userEmail,
    //   callingCode: callCode,
    //   countryCode: cca2Code,
    //   phone: userPhone,
    // });
    // navigation.navigate('UpdateConfirmDetails');
  };

  useEffect(() => {
    if (errorPhone === '' && errorEmail === '' && phoneVerify && emailVerify) {
      updateUserContacts();
    }
  }, [errorPhone, errorEmail, phoneVerify, emailVerify]);

  const updateUserContacts = async () => {
    await updateUserDetails({
      email: userEmail,
      callingCode: callCode,
      countryCode: cca2Code,
      phone: userPhone,
    }).then(() => {
      navigation.navigate('UpdateConfirmDetails');
    });
  };

  const [counter, setCounter] = useState(59);
  useEffect(() => {
    const timer: any =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const resendOTP = async () => {
    try {
      if (!_IsOtpSentTo) {
        if (userEmail) {
          await sendOtp(userEmail, 'email');
        }
        if (userPhone) {
          await sendOtp(('+' + callCode + userPhone).toString(), 'phone');
        }
      } else {
        if (userEmail) {
          _IsOtpSentTo === 'email' && (await sendOtp(userEmail, 'email'));
        }
        if (userPhone) {
          _IsOtpSentTo === 'phone' &&
            (await sendOtp(('+' + callCode + userPhone).toString(), 'phone'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box style={styles.container}>
      <ScrollView>
        <Box flex={1} mt={50}>
          <Box>
            <Image source={assets.MailIcon} />
          </Box>

          {(_IsOtpSentTo === 'phone' || !_IsOtpSentTo) && (
            // {/* Mobile OTP INPUT SECTION */}
            <Box>
              <Text style={styles.titleText}>Enter mobile OTP</Text>
              <OTPInputFields
                editable={counter === 0 ? false : true}
                setPinReady={setMobilePinReady}
                code={mobileCode}
                setCode={setMobileCode}
                maxLength={MAX_CODE_LENGTH}
              />
              {errorPhone ? (
                <Text style={{ color: 'red', margin: 5 }}>{errorPhone} </Text>
              ) : null}
            </Box>
          )}
          {(_IsOtpSentTo === 'email' || !_IsOtpSentTo) && (
            // {/* EMAIL OTP INPUT SECTION */}
            <Box>
              <Text style={styles.titleText}>Enter email OTP</Text>
              <OTPInputFields
                editable={counter === 0 ? false : true}
                setPinReady={setEmailPinReady}
                code={emailCode}
                setCode={setEmailCode}
                maxLength={MAX_CODE_LENGTH}
              />
              {errorEmail ? (
                <Text style={{ color: 'red', margin: 5 }}>{errorEmail} </Text>
              ) : null}
            </Box>
          )}

          <Box mt={30}>
            {(_IsOtpSentTo === 'email' || !_IsOtpSentTo) && (
              <Box style={styles.resendBox}>
                <Box flexDirection="row" flexWrap="wrap">
                  <Text style={[styles.describeText, { paddingRight: 10 }]}>
                    We sent code to
                    {userEmail.length > 20 ? '\n' + userEmail : ' ' + userEmail}
                  </Text>
                  <TouchableOpacity
                    style={{ alignSelf: 'flex-end' }}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.describeText2}>Change</Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            )}
            {(_IsOtpSentTo === 'phone' || !_IsOtpSentTo) && (
              <Box style={styles.resendBox}>
                <Box flexDirection="row">
                  <Text style={styles.describeText}>
                    We sent code to{' '}
                    <Text style={{ fontFamily: FONTS.RobotoRegular }}>
                      (+ {callCode}) {userPhone}
                    </Text>
                  </Text>
                  <Box>
                    <TouchableOpacity
                      // disabled={counter !== 0}
                      onPress={() => navigation.goBack()}>
                      <Text style={[styles.describeText2, { paddingLeft: 10 }]}>
                        Change
                      </Text>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            )}
            <Box style={styles.resendBox}>
              <Box flexDirection="row">
                <Text style={styles.describeText}>Didn’t receive?</Text>
                <Box opacity={counter === 0 ? 1 : 0.5}>
                  <TouchableOpacity
                    disabled={counter !== 0}
                    onPress={() => {
                      setCounter(60);
                      setClear('');
                      setPinempty();
                      setErrorEmail('');
                      setErrorPhone('');
                      resendOTP();
                    }}>
                    <Text style={[styles.describeText2, { paddingLeft: 10 }]}>
                      Resend code
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box>
                {counter !== 0 && (
                  <Text style={styles.describeText2}>{counter}</Text>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Box style={styles.verifyBtn}>
        <AbstractButton
          loader={loader}
          disabled={isButtonDisable}
          textStyle={styles.nextBtn}
          onPress={() => verify()}>
          Verify OTP
        </AbstractButton>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  resendBox: {
    maxWidth: window.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    height: 30,
    top: 35,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 26,
    lineHeight: 30,
    color: COLORS.black,
    marginLeft: 0,
  },
  textInputView: {
    borderBottomWidth: 1,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInpt: {
    fontFamily: FONTS.PlayfairDisplayBold,
    color: COLORS.black,
    fontSize: 26,
    lineHeight: 24,
    textAlign: 'left',
    letterSpacing: 0,
  },
  describeText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 25,
    color: COLORS.black,
  },
  describeText2: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 25,
    color: COLORS.green,
  },
  numberContainer: {
    marginTop: 30,
    width: 348,
    height: 253,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  number: {
    width: 110,
    height: 58,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#EDEDE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    marginHorizontal: 2,
  },
  numberText: {
    height: 18,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    color: COLORS.black,
  },
  verifyBtn: {
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
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.white,
  },
});

export default VerifyOtp;
