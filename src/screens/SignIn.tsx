import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  TouchableOpacity,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../components';
import { assets, COLORS, FONTS, FONT_WEIGHT } from '../constants';
import { RootStackParamList } from '../navigation/types';
import {
  clearUserData,
  login,
  removeAccessToken,
  storeAccessToken,
} from '../service/AuthService';
import KeyChainService from '../service/KeyChainService';
import { authenticateBiometric } from '../service/UtilService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal';
import { setCallingCode, setCountryCode } from '../state/onboarding';

import { RootState, useAppDispatch } from '../state';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../state/generalUtil';
import { debounce } from 'lodash';
import { getUserDataById, updateUserData } from '../service/OnboardingService';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useBackHandler } from '@react-native-community/hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SignIn = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [emailValidError, setUserValidError] = useState('');
  const [passwordError, setPasswordErr] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [loader, setLoader] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { countryCode, callingCode, verifiedPhone } = useSelector(
    (state: RootState) => state.onboarding,
  );

  useEffect(() => {
    if (email && passwordInput && !emailValidError && !passwordError) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  }, [emailValidError, passwordInput]);

  // Update Status bar color
  const setDefaultStatusbar = () => {
    dispatch(setStatusbarColor('#F2F2EF'));
    dispatch(setBarStyle('dark-content'));
    dispatch(setTranslucent(false));
  };

  useFocusEffect(
    useCallback(() => {
      removeAccessToken();
      setDefaultStatusbar();
      clearUserData();
    }, [dispatch]),
  );

  const handleValidUser = (val: string, callingCode: string) => {
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let regPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if (val.length === 0) {
      setUserValidError('Email or phone number must be entered');
      setIsButtonDisable(true);
    } else if (regEmail.test(val) === false && !checkEmailOrPhone(email)) {
      setUserValidError('Enter a valid email address');
      setIsButtonDisable(true);
    } else if (regEmail.test(val) === true) {
      setUserValidError('');
    } else if (regPhone.test(val) === false && checkEmailOrPhone(email)) {
      setUserValidError('Enter a valid phone number');
      setIsButtonDisable(true);
    } else if (regPhone.test(val) === true) {
      if (Number(callingCode) === 353) {
        val.length > 9 || val.length < 9
          ? setUserValidError('Enter a valid phone number')
          : setUserValidError('');
      } else if (
        Number(callingCode) === 1 ||
        Number(callingCode) === 61 ||
        Number(callingCode) === 91
      ) {
        val.length > 10 || val.length < 10
          ? setUserValidError('Enter a valid phone number')
          : setUserValidError('');
      } else {
        val.length > 16 || val.length < 10
          ? setUserValidError('Enter a valid phone number')
          : setUserValidError('');
      }
    }
  };

  const handleValidation = (evnt: string) => {
    const passwordInputValue = evnt.trim();
    //for password
    if (passwordInputValue) {
      setPasswordErr('');
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
      setPasswordErr('Password must be entered');
    }
  };

  const debounceHandlerMobile = useCallback(debounce(handleValidUser, 600), []); //NOW

  // Debounce effect for password input validation
  const debounceHandler = useCallback(debounce(handleValidation, 200), []);

  const reset = () => {
    setEmail('');
    setUserValidError('');
    setPasswordErr('');
    setPasswordInput('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      reset();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Promise.all([
      KeyChainService.getSecureValue('token'),
      KeyChainService.getSecureValue('isUserEnabledBiometric'),
      KeyChainService.getSecureValue('stepStatus'),
    ]).then(res => {
      if (res[0] && res[1]) {
        try {
          const token = JSON.parse(res[0]);
          if (token) {
            storeAccessToken(token);
          }
          const isUserEnabledBiometric = JSON.parse(res[1]);
          if (isUserEnabledBiometric?.isEnabled && token?.access_token) {
            authenticateBiometric({ cancelButtonText: 'Enter password' }).then(
              async () => {
                const isUserDataExist = await getUserDetails();
                if (isUserDataExist) {
                  navigation.replace('Home');
                } else {
                  setErrorMessage('Incorrect email/phone or password');
                }
              },
            );
          }
        } catch (error) {
          console.log({ error });
        }
      }
    });
  }, []);

  const getUserDetails = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      updateUserData(userData);
    }
    return userData?.basicInfo?.userId ? true : false;
  };

  useEffect(() => {
    /*-----------------------------------------
    get data from localstorage (that data for
    whether the app already installed or not)
    Update Title Name by wheather the app
    instllated or not
    ------------------------------------------*/
    getTitle();

    return () => {
      KeyChainService.getSecureValue('token').then((res: any) => {
        const token = JSON.parse(res);
        if (token?.userData) {
          updateUserData(token?.userData);
        }
      });
    };
  }, []);

  // const storeData = async (value: any) => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem('@storage_Key', jsonValue);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // Get correct title of this screen in localstorage
  const getTitle = async () => {
    await AsyncStorage.getItem('@storage_Key')
      .then(async (res: any) => {
        if (JSON.parse(res)) {
          setTitleText('Welcome back\nto Marshmallow');
        } else {
          setTitleText('Welcome to\nMarshmallow');
          await AsyncStorage.setItem('@storage_Key', 'true');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Verify is install app or not.
  const onSignInPress = async () => {
    if (!email) {
      setUserValidError('Email is required');
    }
    if (!passwordInput) {
      setPasswordErr('Password is required');
    } else if (email && passwordInput && !emailValidError && !passwordError) {
      setUserValidError('');
      setPasswordErr('');
      setLoader(true);

      setDefaultStatusbar();

      await login(email, passwordInput)
        .then(result => {
          if (result) {
            getUserDetails();
          }
          setLoader(false);
          navigation.replace('Home');
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
          checkEmailOrPhone(email)
            ? setErrorMessage('Incorrect phone number or password')
            : setErrorMessage('Incorrect email address or password');
        });
    }
  };

  const checkEmailOrPhone = (val: string) => {
    let reg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if (reg.test(val)) {
      return true;
    }
  };

  const updateContryCodeChange = (verifiedPhone: string, values: any) => {
    setUserValidError('');
    const { cca2, callingCode } = values;
    if (callingCode[0] === '353' && verifiedPhone[0] === '0') {
      setEmail(verifiedPhone.replace(/^0+/, ''));
      debounceHandlerMobile(verifiedPhone.replace(/^0+/, ''), callingCode[0]);
    } else {
      debounceHandlerMobile(verifiedPhone.trim(), callingCode[0]);
    }
    dispatch(setCountryCode(cca2));
    dispatch(setCallingCode(callingCode[0]));
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box pt={50}>
          <Text style={styles.titleText}>Welcome back to</Text>
          <Box></Box>
          <Box mt={20}>
            <Image source={assets.Marshmallow} style={styles.logo} />
            <Box pt={60} width="100%">
              {
                <Box>
                  <CustomInput
                    inputOutContainer={styles.inputOutContainer}
                    placeholder={'Enter your email or phone number'}
                    label={'Email or phone number'}
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    labelStyle={styles.labelStyle}
                    style={styles.textInput}
                    onChangeText={(value: string) => {
                      setErrorMessage('');
                      setEmail(value.trim());
                    }}
                    icon={
                      checkEmailOrPhone(email) ? (
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center">
                          <CountryPicker
                            theme={{
                              fontFamily: FONTS.RobotoRegular,
                              fontSize: 16,
                            }}
                            withFilter
                            countryCode={countryCode}
                            withFlag
                            withAlphaFilter={false}
                            withCurrencyButton={false}
                            containerButtonStyle={{
                              paddingBottom: 4,
                            }}
                            onSelect={values =>
                              updateContryCodeChange(verifiedPhone, values)
                            }
                          />
                          <Text
                            style={
                              styles.callingCode
                            }>{`+(${callingCode})`}</Text>
                        </Box>
                      ) : null
                    }
                    iconPosition="left"
                    onBlur={() => handleValidUser(email, callingCode)}
                    error={emailValidError}
                  />
                </Box>
              }
              <Box>
                <CustomInput
                  inputOutContainer={styles.inputOutContainer}
                  autoCorrect={false}
                  placeholder={'* * * * * * * *'}
                  value={passwordInput}
                  label={'ENTER PASSWORD'}
                  labelStyle={styles.labelStyle}
                  style={styles.textInput}
                  secureTextEntry
                  iconPosition="right"
                  onChangeText={(value: string) => {
                    setErrorMessage('');
                    debounceHandler(value);
                    setPasswordInput(value);
                  }}
                  // onBlur={() => handleValidation(passwordInput)}
                  error={passwordError}
                />
              </Box>
              <Box>
                {errorMessage ? (
                  <Text style={styles.errorMsg}>{errorMessage}</Text>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box>
            <TouchableOpacity>
              <Text
                style={styles.forgotPassword}
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
        <Box
          mt={Math.round(SCREEN_HEIGHT / 1.48)}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%">
          <View style={{ margin: 50 }} />
          <AbstractButton
            loader={loader}
            disabled={isButtonDisable}
            textStyle={styles.nextBtn}
            onPress={onSignInPress}>
            Login
          </AbstractButton>
          <TouchableOpacity
            onPress={() => {
              reset();
              navigation.navigate('SignUpIntro');
            }}>
            <Text style={styles.btnText}>Create new account</Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.OpenSansBold,
    fontSize: 20,
    lineHeight: 32,
    letterSpacing: 0,
  },
  logo: {
    height: 39.42,
    width: 300,
    // padding: 10,
    // margin: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    fontSize: 16,
    // lineHeight: 24,
    color: '#000000',
  },
  labelStyle: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  callingCode: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    height: '100%',
    textAlignVertical: 'center',
    paddingRight: 10,
    paddingBottom: 2,
  },
  forgotPassword: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.green,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.white,
  },
  nextBtn2: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.black,
  },
  btnText: {
    color: 'black',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    paddingTop: '5%',
  },
  errorMsg: {
    color: 'red',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 15,
  },
});

export default SignIn;
