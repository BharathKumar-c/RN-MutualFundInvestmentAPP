import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { useSelector } from 'react-redux';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../../components';
import { COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import {
  checkEmailAlreadyExists,
  checkPhoneAlreadyExists,
  sendOtp,
} from '../../service/OnboardingService';
import { useAppDispatch } from '../../state';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import {
  setCallingCode,
  setCountryCode,
  setEmail,
  setEmailError,
  setEmailVerified,
  setPhoneNumber,
  setPhoneNumError,
  setPhoneVerified,
  setTermsCheck,
} from '../../state/onboarding';
import { RootState } from '../../state/rootReducer';
import ErrorBottomSheet from './ErrorBottomSheet';

const SignUp = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const {
    email,
    emailError,
    phoneNumber,
    phoneNumError,
    countryCode,
    callingCode,
    termsCheck,
    termsCheckError,
    emailVerified,
    phoneVerified,
    verifiedEmail,
    verifiedPhone,
  } = useSelector((state: RootState) => state.onboarding);

  const { isHeaderNavigation } = useSelector(
    (state: RootState) => state.generalUtil,
  );

  const dispatch = useAppDispatch();
  const [userEmail, setUserEmail] = useState(email);
  const [userEmailError, setUserEmailError] = useState('');
  const [userPhone, setUserPhone] = useState(phoneNumber);
  const [userPhoneError, setUserPhoneError] = useState('');
  const [isEmailEdited, setIsEmailEdited] = useState(false);
  const [isPhoneNoEdited, setIsPhoneNoEdited] = useState(false);
  const [loader, setLoader] = useState(false);
  const flag = true;
  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState(false);

  // BottomSheet snap variables
  const snapPoints = ['67%', '95%'];

  useEffect(() => {
    if (sheetRef.current === null) {
      dispatch(setIsBottomSheet(false));
    }
    setUserEmail(email);
  }, [dispatch, sheetRef]);

  const handleUpdate = () => {
    setUserEmail(email);

    setUserEmailError('');
    setUserPhone(phoneNumber);

    dispatch(setPhoneNumError(''));
  };

  useFocusEffect(
    useCallback(() => {
      handleUpdate();
      if (isOpen) {
        dispatch(setStatusbarColor('#000000'));
        dispatch(setBarStyle('light-content'));
        dispatch(setIsBottomSheet(true));
        dispatch(setTranslucent(false));
        dispatch(setIsEnableHeader(false));
      } else {
        dispatch(setStatusbarColor('#F2F2EF'));
        dispatch(setBarStyle('dark-content'));
        dispatch(setIsBottomSheet(false));
        dispatch(setTranslucent(false));
        dispatch(setIsEnableHeader(true));
      }
    }, [isOpen, dispatch, email, phoneNumber]),
  );

  const [errorType, setErrorType] = useState('');

  const handlePhoneChange = (verifiedPhone: string, value: string) => {
    if (callingCode === '353' && value[0] === '0') {
      setUserPhone(value.replace(/^0+/, ''));
      debounceHandler(verifiedPhone, value.replace(/^0+/, ''), callingCode);
    } else {
      setUserPhone(value.trim());
      debounceHandler(verifiedPhone, value.trim(), callingCode);
    }
    dispatch(setPhoneNumError(''));
  };

  const onContinuePress = async () => {
    setLoader(true);
    try {
      const response = await Promise.all([
        checkEmailAlreadyExists(userEmail.trim()),
        checkPhoneAlreadyExists(userPhone.trim(), callingCode.trim()),
      ]);
      // console.log({ response });

      if (response[0] && response[0]?.exist) {
        setErrorType('email');
        setIsOpen(true);
        dispatch(setIsBottomSheet(true));
      } else if (response[1] && response[1]?.exist) {
        setErrorType('phone');
        setIsOpen(true);
        dispatch(setIsBottomSheet(true));
      } else {
        setErrorType('');
        // send both otp if both are not verified
        if (!emailVerified || !phoneVerified) {
          // Send otp to email and phone number
          await sendOtp(userEmail, 'email');
          if (userPhone) {
            await sendOtp(('+' + callingCode + userPhone).toString(), 'phone');
          }
          if (route?.params?.flag) {
            navigation.navigate('VerifyOtp', { flag });
          } else {
            navigation.navigate('VerifyOtp');
          }
          setIsEmailEdited(false);
          setIsPhoneNoEdited(false);
        } else {
          let isOtpSentTo: String;
          if (!emailVerified) {
            isOtpSentTo = 'email';
            // Send otp to email.
            if (isEmailEdited) {
              await sendOtp(userEmail, 'email');
            }

            navigation.navigate('VerifyOtp', { flag, isOtpSentTo });
          } else if (!phoneVerified) {
            isOtpSentTo = 'phone';
            // Send otp to phone number
            if (isPhoneNoEdited) {
              if (userPhone) {
                await sendOtp(
                  ('+' + callingCode + userPhone).toString(),
                  'phone',
                );
              }
            }

            navigation.navigate('VerifyOtp', { flag, isOtpSentTo });
          } else if (emailVerified && phoneVerified && route?.params?.flag) {
            navigation.navigate('ConfirmDetails');
          } else {
            await sendOtp(userEmail, 'email');
            await sendOtp(('+' + callingCode + userPhone).toString(), 'phone');
            navigation.navigate('VerifyOtp');
            console.log('otpcheck');
          }
        }
      }
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleEmailOnBlur = (verifiedEmail: string, userEmail: any) => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (userEmail.length === 0) {
      setUserEmailError('Email address must be entered');
    } else if (emailReg.test(userEmail) === false) {
      setUserEmailError('Enter valid email address');
    } else if (emailReg.test(userEmail) === true) {
      setUserEmailError('');
    }

    if (verifiedEmail) {
      if (verifiedEmail === userEmail) {
        setIsEmailEdited(false);
        dispatch(setEmailVerified(true));
      } else {
        setIsEmailEdited(true);
        dispatch(setEmailVerified(false));
      }
    }
  };

  const handleMobileOnBlur = (verifiedPhone: string, userPhone: any) => {
    if (verifiedPhone) {
      if (verifiedPhone === userPhone) {
        setIsPhoneNoEdited(false);
        dispatch(setPhoneVerified(true));
      } else {
        setIsPhoneNoEdited(true);
        dispatch(setPhoneVerified(false));
      }
    }
  };

  // Mobile number validation
  const handleMobileNoValidation = (
    verifiedPhone: string,
    value: any,
    callingCode: any,
  ) => {
    let mobilereg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if (value.length === 0) {
      dispatch(setPhoneNumError('Mobile number must be entered'));
    } else if (mobilereg.test(value) === false) {
      dispatch(setPhoneNumError('Enter valid mobile number'));
    } else if (mobilereg.test(value) === true) {
      if (Number(callingCode) === 353) {
        value.length > 9 || value.length < 9
          ? dispatch(setPhoneNumError('Enter valid mobile number'))
          : handleMobileOnBlur(verifiedPhone, value);
      } else if (
        Number(callingCode) === 1 ||
        Number(callingCode) === 61 ||
        Number(callingCode) === 91
      ) {
        value.length > 10 || value.length < 10
          ? dispatch(setPhoneNumError('Enter valid mobile number'))
          : handleMobileOnBlur(verifiedPhone, value);
      } else {
        value.length <= 16 || value.length >= 10
          ? dispatch(setPhoneNumError('Enter valid mobile number'))
          : handleMobileOnBlur(verifiedPhone, value);
      }
    }
  };

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false);
    dispatch(setStatusbarColor('#F2F2EF'));
    dispatch(setBarStyle('dark-content'));
    dispatch(setIsBottomSheet(false));
  }, [dispatch]);

  useBackHandler(
    useCallback(() => {
      if (isOpen) {
        handleClosePress();
      } else if (route?.params?.flag || isHeaderNavigation) {
        navigation.navigate('ConfirmDetails');
      } else {
        navigation.goBack();
      }
      return true;
    }, [isOpen]),
  );

  // Debounce effect for input errors mobile number
  const debounceEmailHandler = useCallback(
    debounce(handleEmailOnBlur, 600),
    [],
  );
  const debounceHandler = useCallback(
    debounce(handleMobileNoValidation, 600),
    [],
  );

  // Calling code and flag onchage callback function
  const updateContryCodeChange = (verifiedPhone: string, values: any) => {
    dispatch(setPhoneNumError(''));
    const { cca2, callingCode } = values;
    if (callingCode[0] === '353' && userPhone[0] === '0') {
      setUserPhone(userPhone.replace(/^0+/, ''));
      debounceHandler(
        verifiedPhone,
        userPhone.replace(/^0+/, ''),
        callingCode[0],
      );
    } else {
      debounceHandler(verifiedPhone, userPhone.trim(), callingCode[0]);
    }
    console.log({ cca2 });

    dispatch(setCountryCode(cca2));
    dispatch(setCallingCode(callingCode[0]));
  };

  return (
    <>
      <KeyboardAvoidingWrapper>
        {isOpen ? (
          <Box style={[{ backgroundColor: '#000000' }, styles.container]} />
        ) : (
          <>
            <Box style={styles.container}>
              <Box flex={1} mt={50}>
                <Box>
                  <Text style={styles.titleText}>
                    Let’s start with your{'\n'}email address and {'\n'}phone
                    number
                  </Text>
                </Box>
                <Box mt={20} width="100%">
                  <Box style={{ height: 100 }}>
                    <CustomInput
                      placeholder={'Enter your email address'}
                      label={'EMAIL'}
                      labelStyle={styles.label}
                      style={styles.emailInput}
                      value={userEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(value: string) => {
                        setUserEmail(value.trim());
                        setUserEmailError('');
                        debounceEmailHandler(verifiedEmail, value.trim());
                      }}
                      error={userEmailError}
                    />
                  </Box>
                  <Box>
                    <CustomInput
                      placeholder={'Enter your phone number'}
                      label={'Phone number'}
                      labelStyle={styles.label}
                      style={styles.phoneInput}
                      value={userPhone}
                      onChangeText={(value: string) =>
                        handlePhoneChange(verifiedPhone, value)
                      }
                      keyboardType="phone-pad"
                      icon={
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center">
                          <CountryPicker
                            theme={styles.countryPicker}
                            withFilter
                            countryCode={countryCode}
                            withFlag
                            withAlphaFilter={false}
                            withCurrencyButton={false}
                            containerButtonStyle={styles.flagContainer}
                            onSelect={values =>
                              updateContryCodeChange(verifiedPhone, values)
                            }
                          />
                          <Text
                            style={
                              styles.callingCode
                            }>{`+(${callingCode})`}</Text>
                        </Box>
                      }
                      iconPosition="left"
                      error={phoneNumError}
                    />
                  </Box>
                </Box>
                <Box flexDirection="row" mt={10} alignItems={'center'}>
                  <Box flexDirection="row" alignItems="center">
                    <CheckBox
                      style={{
                        transform: [{ scaleX: 1 }, { scaleY: 1 }],
                      }}
                      tintColors={{
                        true: '#145650',
                        false: COLORS.green,
                      }}
                      disabled={false}
                      value={termsCheck}
                      onValueChange={newValue => {
                        dispatch(setTermsCheck(newValue));
                      }}
                    />
                  </Box>
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    alignSelf="center">
                    <Text
                      style={
                        !termsCheckError
                          ? styles.termConText
                          : [styles.termConText, styles.error]
                      }>
                      By continuing, you agree to our
                      <Text
                        style={[styles.termConText, { color: COLORS.green }]}>
                        {' '}
                        Terms of Use
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box style={styles.continueBtn}>
                <AbstractButton
                  loader={loader}
                  disabled={
                    userEmail &&
                    userPhone &&
                    termsCheck &&
                    !userEmailError &&
                    !phoneNumError &&
                    !termsCheckError
                      ? false
                      : true
                  }
                  onPress={() => {
                    dispatch(setEmail(userEmail));
                    dispatch(setPhoneNumber(userPhone));
                    onContinuePress();
                  }}>
                  Continue
                </AbstractButton>
              </Box>
            </Box>
          </>
        )}
      </KeyboardAvoidingWrapper>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => handleClosePress()}
          backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
          <BottomSheetView>
            <ErrorBottomSheet
              route={route}
              navigation={navigation}
              data={userEmail}
              userPhone={userPhone}
              errorType={errorType}
              setIsOpen={setIsOpen}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  countryPicker: {
    fontFamily: FONTS.Merriweather,
    fontSize: 16,
  },
  flagContainer: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: '100%',
    paddingBottom: 4,
  },
  callingCode: {
    color: '#000000',
    fontFamily: FONTS.RobotoRegular,
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 18,
    textAlignVertical: 'center',
    paddingRight: 8,
  },
  phoneInput: {
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    color: '#000000',
    fontFamily: FONTS.RobotoRegular,
    fontSize: 16,
    top: 1,
    lineHeight: 18,
  },
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
    paddingHorizontal: 20,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0,
  },
  emailInput: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: 16,
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    color: '#000000',
  },
  logo: {
    height: 40,
    width: 40,
    padding: 10,
    margin: 10,
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: COLORS.lightGray,
  },
  termConText: {
    fontFamily: FONTS.MerriweatherRegular,
    width: 280,
    left: (50 % -280) / 50 + 10,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.black,
  },
  termConText2: {
    color: COLORS.green,
  },
  placeholderStyle: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: 0,
    color: COLORS.green,
    opacity: 0.4,
  },
  error: {
    color: COLORS.danger,
  },
});

export default SignUp;
