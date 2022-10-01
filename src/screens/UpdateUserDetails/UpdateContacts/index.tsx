import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {
  setBarStyle,
  setIsBottomSheet,
  setStatusbarColor,
  setTranslucent,
} from '../../../state/generalUtil';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../../../components';
import { useAppDispatch } from '../../../state';
import { RootState } from '../../../state/rootReducer';
import {
  setCallingCode,
  setCountryCode,
  setEmail,
  setPhoneNumber,
  setEmailError,
  setPhoneNumError,
  setEmailVerified,
  setPhoneVerified,
} from '../../../state/onboarding';
import { useSelector } from 'react-redux';
import { COLORS, FONTS, SIZES } from '../../../constants';
import CheckBox from '@react-native-community/checkbox';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CountryPicker from 'react-native-country-picker-modal';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ErrorBottomSheet from './ErrorBottomSheet';
import {
  checkEmailAlreadyExists,
  checkPhoneAlreadyExists,
  updateCurrentUserData,
} from '../../../service/OnboardingService';
import { sendOtp } from '../../../service/OnboardingService';
import { debounce } from 'lodash';
import Header from '../../../components/Header/Header';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { die } from 'immer/dist/internal';

const Index = ({
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
  } = useSelector((state: RootState) => state.onboarding);

  const dispatch = useAppDispatch();
  const [userEmail, setUserEmail] = useState(email);
  const [userPhone, setUserPhone] = useState(phoneNumber);
  const [cca2Code, setCca2Code] = useState(countryCode);
  const [callCode, setCallCode] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [isDisableBtn, setIsDisableBtn] = useState(false);
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setIsBottomSheet(false));
      dispatch(setTranslucent(false));
    }, []),
  );

  const [errorType, setErrorType] = useState('');

  const handlePhoneChange = (value: string) => {
    if (callCode === '353' && value[0] === '0') {
      setUserPhone(value.replace(/^0+/, ''));
      debounceHandler(
        value.replace(/^0+/, ''),
        callCode ? callCode : callingCode,
      );
    } else {
      setUserPhone(value.trim());
      debounceHandler(value.trim(), callCode ? callCode : callingCode);
    }
    dispatch(setPhoneNumError(''));
  };

  const handleEmptyField = userEmail => {
    if (userEmail.length === 0) {
      setEmailErr('Email address must be entered');
    }
  };

  const handleEmailOnBlur = async (mail: any) => {
    if (mail && mail !== email) {
      const emailExist: any = await IsExistEmail(mail);
      if (emailExist && emailExist?.exist) {
        setEmailErr('Email address is already registered');
      } else {
        let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (emailReg.test(mail) === false) {
          setEmailErr('Enter valid email address');
        } else if (emailReg.test(mail) === true) {
          setUserEmail(mail);
          setEmailErr('');
        }
      }
    }
  };

  const handleMobileOnBlur = async (userPhone: any) => {
    if (userPhone != phoneNumber) {
      const phoneExist: any = await IsExistPhone(userPhone.trim());
      console.log({ phoneExist });

      if (phoneExist && phoneExist?.exist) {
        setPhoneErr('Phone number is already registered');
        dispatch(setPhoneNumError('Phone number is already registered'));
      } else {
        setUserPhone(userPhone);
        setPhoneErr('');
        dispatch(setPhoneNumError(''));
      }
    }
  };

  // Mobile number validation
  const handleMobileNoValidation = (value: any, callCode: any) => {
    let mobilereg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if (value.length === 0) {
      setPhoneErr('Phone number must be entered');
      dispatch(setPhoneNumError('Phone number must be entered'));
    } else if (mobilereg.test(value) === false) {
      setPhoneErr('Enter a valid phone number');
      dispatch(setPhoneNumError('Enter a valid phone number'));
    } else if (mobilereg.test(value) === true) {
      if (Number(callCode) === 353) {
        value.length > 9 || value.length < 9
          ? setPhoneErr('Enter a valid phone number')
          : handleMobileOnBlur(value);
      } else if (
        Number(callCode) === 1 ||
        Number(callCode) === 61 ||
        Number(callCode) === 91
      ) {
        value.length > 10 || value.length < 10
          ? setPhoneErr('Enter a valid phone number')
          : handleMobileOnBlur(value);
      } else {
        value.length > 16 || value.length < 10
          ? setPhoneErr('Enter a valid phone number')
          : handleMobileOnBlur(value);
      }
    }
  };

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
  const updateContryCodeChange = (values: any) => {
    dispatch(setPhoneNumError(''));
    const { cca2, callingCode } = values;
    if (callingCode[0] === '353' && userPhone[0] === '0') {
      setUserPhone(userPhone.replace(/^0+/, ''));
      debounceHandler(userPhone.replace(/^0+/, ''), callingCode[0]);
    } else {
      debounceHandler(userPhone.trim(), callingCode[0]);
    }
    setCca2Code(cca2);
    setCallCode(callingCode[0]);
  };

  const onContinuePress = async () => {
    setLoader(true);
    try {
      if (
        ((userEmail && userEmail != email) ||
          (userPhone && userPhone != phoneNumber) ||
          (cca2Code && cca2Code != countryCode) ||
          (callCode && callCode != callingCode)) &&
        !emailErr &&
        !phoneErr
      ) {
        handleSendOTP();
        setLoader(false);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleSendOTP = async () => {
    setErrorType('');
    await sendOtp(userEmail, 'email');
    await sendOtp(
      ('+' + (callCode ? callCode : callingCode) + userPhone).toString(),
      'phone',
    );
    const contacts: any = {
      userEmail: userEmail ? userEmail : email,
      userPhone: userPhone ? userPhone : phoneNumber,
      callCode: callCode ? callCode : callingCode,
      cca2Code: cca2Code ? cca2Code : countryCode,
    };
    navigation.navigate('UpdateVerifyOtp', contacts);
  };

  const IsExistEmail = async (userEmail: any) => {
    const result: any = await checkEmailAlreadyExists(userEmail.trim());
    return result;
  };

  useEffect(() => {
    continueBtnValidation();
  }, [userEmail, userPhone, emailErr, phoneErr]);

  const continueBtnValidation = () => {
    if (
      ((userEmail && userEmail !== email) ||
        (userPhone && userPhone !== phoneNumber)) &&
      !emailErr &&
      !phoneErr
    ) {
      setIsDisableBtn(false);
    } else {
      setIsDisableBtn(true);
    }
  };

  const IsExistPhone = async (phoneNo: any) => {
    console.log({ phoneNo, callCode });
    const result: any = await checkPhoneAlreadyExists(
      phoneNo.trim(),
      callCode ? callCode.trim() : callingCode.trim(),
    );
    if (result) {
      return result;
    } else {
      return 'Bad Request 400 status';
    }
  };

  return (
    <>
      <KeyboardAvoidingWrapper>
        <Box style={styles.container}>
          <Box flex={1} mt={50}>
            <Box>
              <Text style={styles.titleText}>
                Update email address{'\n'}and phone number
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
                    setEmailErr('');
                    setUserEmail(value.trim());
                    debounceEmailHandler(value.trim());
                    handleEmptyField(value);
                  }}
                  error={emailErr}
                />
              </Box>
              <Box>
                <CustomInput
                  placeholder={'Enter your phone number'}
                  label={'Phone number'}
                  labelStyle={styles.label}
                  style={styles.phoneInput}
                  value={userPhone}
                  onChangeText={(value: string) => {
                    handlePhoneChange(value);
                    setPhoneErr('');
                  }}
                  keyboardType="phone-pad"
                  icon={
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <CountryPicker
                        theme={{
                          fontFamily: FONTS.Merriweather,
                          fontSize: 16,
                        }}
                        withFilter
                        countryCode={cca2Code}
                        withFlag
                        withAlphaFilter={false}
                        withCurrencyButton={false}
                        containerButtonStyle={{
                          paddingBottom: 4,
                        }}
                        onSelect={values => updateContryCodeChange(values)}
                      />
                      <Text style={styles.callingCode}>{`+(${
                        callCode ? callCode : callingCode
                      })`}</Text>
                    </Box>
                  }
                  iconPosition="left"
                  error={phoneErr ? phoneErr : phoneNumError}
                />
              </Box>
            </Box>
          </Box>
          <Box style={styles.continueBtn}>
            <AbstractButton
              loader={loader}
              disabled={isDisableBtn}
              onPress={() => {
                onContinuePress();
              }}>
              Save
            </AbstractButton>
          </Box>
        </Box>
      </KeyboardAvoidingWrapper>
    </>
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
    // height: 40,
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
  callingCode: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: 16,
    lineHeight: 18,
    color: '#000000',
    paddingRight: 5,
    top: 0,
  },
});

export default Index;
