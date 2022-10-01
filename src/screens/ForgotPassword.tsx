import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import CountryPicker from 'react-native-country-picker-modal';
import { useAppDispatch } from '../state';
import {
  setCallingCode,
  setPhoneNumber,
  setPhoneVerified,
  setCountryCode,
} from '../state/onboarding';
import {
  checkEmailAlreadyExists,
  checkPhoneAlreadyExists,
  sendOtp,
} from '../service/OnboardingService';
import { resetPasswordWithEmail } from '../service/AuthService';
import { debounce } from 'lodash';

const ForgotPassword = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const [userInput, setUserInput] = useState<string>(
    route?.params ? route.params : '',
  );
  const [isPhone, setIsPhone] = useState<boolean>(false);
  const [countryCod, setCountryCod] = useState<string>('IE');
  const [phoneCode, setPhoneCode] = useState<string>('353');
  const [validPhoneNumber, setValidPhoneNumber] = useState<any>('');
  const [emailValidError, setEmailValidError] = useState<string>('');
  const [phoneValidError, setPhoneValidError] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isDisableBtn, setIsDisableBtn] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStatusbarColor('#F2F2EF'));
    dispatch(setBarStyle('dark-content'));
  }, []);

  const handleBtnDisable = () => {
    if (userInput) {
      if (isPhone) {
        setIsDisableBtn(phoneValidError ? true : false);
      } else {
        setIsDisableBtn(emailValidError ? true : false);
      }
    }
  };

  useEffect(() => {
    handleBtnDisable();
  }, [userInput, phoneCode, phoneValidError, emailValidError]);

  useEffect(() => {
    const isValidInputLen = userInput.length > 0;
    if (isValidInputLen) {
      validatePhone(userInput, phoneCode);
    }
  }, [phoneCode]);

  const validateEmail = async (value: string) => {
    const emailTestFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const isValidEmail = emailTestFormat.test(value);
    if (value.length === 0) {
      setEmailValidError('Email or phone number must be entered');
    } else if (!isValidEmail) {
      setEmailValidError(' Enter a valid email address');
    } else {
      await checkEmailAlreadyExists(value.trim())
        .then(IsEmailExist => {
          console.log({ IsEmailExist });
          !IsEmailExist.exist
            ? setEmailValidError('Email address is not registered')
            : setEmailValidError('');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // Mobile number validation
  const validatePhone = async (value: string, callingCode: string) => {
    const phoneTestFormat =
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    const isValidPhone = phoneTestFormat.test(value);
    if (value.length === 0) {
      setPhoneValidError('Email or phone number must be entered');
    } else if (!isValidPhone) {
      setPhoneValidError('Enter a valid phone number');
    } else if (isValidPhone) {
      const IsPhoneExist = await checkPhoneAlreadyExists(
        value.trim(),
        phoneCode.trim(),
      );
      setValidPhoneNumber(IsPhoneExist);
      const isIrelandCode = Number(callingCode) === 353;
      if (isIrelandCode) {
        value.length > 9 || value.length < 9
          ? setPhoneValidError('Enter a valid phone number')
          : !IsPhoneExist.exist
          ? setPhoneValidError('Phone number is not registered')
          : setPhoneValidError('');
      } else if (
        Number(callingCode) === 1 ||
        Number(callingCode) === 61 ||
        Number(callingCode) === 91
      ) {
        value.length > 10 || value.length < 10
          ? setPhoneValidError('Enter a valid phone number')
          : !IsPhoneExist.exist
          ? setPhoneValidError('Phone number is not registered')
          : setPhoneValidError('');
      } else {
        value.length <= 16 || value.length >= 10
          ? setPhoneValidError('Enter a valid phone number')
          : !IsPhoneExist.exist
          ? setPhoneValidError('Phone number is not registered')
          : setPhoneValidError('');
      }
    }
  };

  const updateUserInput = (value: string, callingCode: string) => {
    const isIrelandWithZero = callingCode === '353' && value[0] === '0';
    let updatedUserInput = isIrelandWithZero
      ? value.replace(/^0+/, '')
      : value.trim();
    setUserInput(updatedUserInput);
  };

  const handleInputChange = (value: string) => {
    setEmailValidError('');
    setPhoneValidError('');
    const testFormat = /^[0-9]*$/;
    const isValidLen = value.length > 0;
    if (isValidLen) {
      setIsPhone(testFormat.test(value));
    }
    if (isPhone) {
      updateUserInput(value, phoneCode);
    } else {
      setUserInput(value.toLowerCase());
    }
  };

  const handleCountryCodeChange = (values: any) => {
    setLoader(true);
    setPhoneValidError('');
    const { cca2, callingCode } = values;
    updateUserInput(userInput, callingCode[0]);
    setCountryCod(cca2);
    setPhoneCode(callingCode[0]);
    setLoader(false);
  };

  const onContinue = async () => {
    if (!isPhone) {
      const IsEmailExist = await checkEmailAlreadyExists(userInput.trim());
      if (IsEmailExist.exist) {
        try {
          const result = await resetPasswordWithEmail({
            email: userInput,
          });

          if (result) navigation.navigate('ResetLink', { userInput });
        } catch (error) {
          setEmailValidError('Email address is not registered');
          console.log(error);
        }
      }
    } else {
      const IsPhoneExist = await checkPhoneAlreadyExists(
        userInput.trim(),
        phoneCode.trim(),
      );
      if (IsPhoneExist.exist) {
        try {
          if (validPhoneNumber?.exist === true && userInput) {
            dispatch(setPhoneVerified(false));
            await sendOtp(('+' + phoneCode + userInput).toString(), 'phone');
            userInput && dispatch(setPhoneNumber(userInput));
            phoneCode && dispatch(setCallingCode(phoneCode));
            countryCod && dispatch(setCountryCode(countryCod));

            navigation.navigate('ResetLinkForPhone');
          } else {
            setPhoneValidError('Phone number is not registered');
          }
        } catch (error) {
          setPhoneValidError('Phone number is not registered');
          console.log(error);
        }
      }
    }
  };

  // Debounce effect for input errors mobile number
  const debouncePhoneHandler = useCallback(debounce(validatePhone, 600), []);
  const debounceEmailHandler = useCallback(debounce(validateEmail, 600), []);

  return (
    <>
      <Box style={styles.container}>
        <KeyboardAvoidingWrapper>
          <Box flex={1} mt={40}>
            <Box>
              <Text style={styles.titleText}>Forgot password</Text>
            </Box>
            <Box mt={50} width="100%">
              <Box>
                <CustomInput
                  placeholder={'Enter your email or phone number'}
                  label={'Email or phone number'}
                  labelStyle={styles.labelStyle}
                  style={styles.textInput}
                  value={userInput}
                  onChangeText={(value: string, callingCode: string) => {
                    setLoader(true);
                    handleInputChange(value);
                    if (isPhone) {
                      debouncePhoneHandler(value, phoneCode);
                    } else {
                      debounceEmailHandler(value);
                    }
                    setLoader(false);
                  }}
                  onBlur={() =>
                    isPhone
                      ? validatePhone(userInput, phoneCode)
                      : validateEmail(userInput)
                  }
                  icon={
                    isPhone ? (
                      <Box style={styles.countryPickerContainer}>
                        <CountryPicker
                          theme={{
                            fontFamily: FONTS.RobotoRegular,
                            fontSize: SIZES.body3,
                          }}
                          withFilter
                          countryCode={countryCod}
                          withFlag
                          withAlphaFilter={false}
                          withCurrencyButton={false}
                          containerButtonStyle={{
                            paddingBottom: 4,
                          }}
                          onSelect={values => handleCountryCodeChange(values)}
                        />
                        <Text
                          style={styles.callingCode}>{`+(${phoneCode})`}</Text>
                      </Box>
                    ) : (
                      <></>
                    )
                  }
                  iconPosition="left"
                  error={isPhone ? phoneValidError : emailValidError}
                />
              </Box>
            </Box>
          </Box>
        </KeyboardAvoidingWrapper>
        <Box style={styles.continueBtn}>
          <AbstractButton
            disabled={isDisableBtn}
            loader={loader}
            onPress={() => {
              onContinue();
            }}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
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
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    width: 300,
    top: 16,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
  },
  labelStyle: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: SIZES.body5,
    lineHeight: 18,
  },
  textInput: {
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    color: COLORS.black,
    fontFamily: FONTS.RobotoRegular,
    fontSize: SIZES.body3,
    top: 1,
    lineHeight: 18,
  },
  label: {
    fontFamily: FONTS.MerriweatherRegular,
    color: COLORS.lightGray,
    fontSize: SIZES.small,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: SIZES.font,
    lineHeight: 20,
  },
  callingCode: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: SIZES.medium,
    lineHeight: 18,
    color: COLORS.black,
    paddingRight: 5,
    top: 0,
  },
  countryPickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ForgotPassword;
