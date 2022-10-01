import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  AbstractButton,
  Box,
  CustomInput,
  CustomModal,
  KeyboardAvoidingWrapper,
} from '../components';
import { assets, FONTS, SIZES, COLORS } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { RootState, useAppDispatch } from '../state';
import { openInbox } from 'react-native-email-link';
import { useSelector } from 'react-redux';
import {
  setCallingCode,
  setPhoneNumber,
  setPhoneToken,
  setPhoneVerified,
  setVerifiedPhone,
} from '../state/onboarding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sendOtp, verifyOtp } from '../service/OnboardingService';

const ResetLinkForPhone = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { phoneNumber, callingCode } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [counter, setCounter] = useState(59);
  const [phoneVerify, setPhoneverify] = useState(false);
  const PhoneNoWithCode: any = `(+${callingCode}) ${phoneNumber}`;
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, [dispatch]);

  useEffect(() => {
    const timer: any =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const resendOTP = async () => {
    setModalVisible(false);
    setCounter(60);
    setOtp('');
    setOtpError('');
    try {
      if (phoneNumber) {
        dispatch(setPhoneVerified(false));
        setPhoneverify(false);
        await sendOtp(('+' + callingCode + phoneNumber).toString(), 'phone');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onContinue = () => {
    if (otp.length === 4) {
      handleVerifyOtp(otp);
    }
  };

  const handleVerifyOtp = async (otpCode: any) => {
    if (phoneNumber) {
      console.log(('+' + callingCode + phoneNumber).toString(), { otpCode });
      try {
        const otpVerifyphone = await verifyOtp(
          ('+' + callingCode + phoneNumber).toString(),
          'phone',
          otpCode,
        );
        if (otpVerifyphone) {
          setIsButtonDisable(false);
          setToken(otpVerifyphone.token);
          setOtp('');

          dispatch(setPhoneToken(token));
          dispatch(setVerifiedPhone(phoneNumber));
          dispatch(setPhoneVerified(true));
          setOtpError('');
          setPhoneverify(true);
          navigation.navigate('ResetPassword');
        }
      } catch (err: any) {
        if ('phone' && err?.response?.status === 400) {
          setOtpError(err?.response?.data?.message);
          setLoader(false);
          dispatch(setPhoneVerified(false));
          setPhoneverify(false);
          setIsButtonDisable(true);
        } else {
          setLoader(false);
          setOtpError('The OTP you entered is invalid or expired');
          dispatch(setPhoneVerified(false));
          setPhoneverify(false);
          setIsButtonDisable(true);
        }
      }
    }
  };

  /* less than 10 add 0 to number */
  const minTwoDigitsFormat = (value: number) => {
    return (value < 10 ? '00:0' : '00:') + value;
  };

  const RenderCustomAlertView = () => (
    <Box style={styles.PopupContainer}>
      <Text style={styles.titleTxt}>Let's try again</Text>
      <Text style={styles.subTitleTxt}>
        Before resending the OTP, please check if you entered the right number:
      </Text>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
          navigation.replace('ForgotPassword');
        }}
        style={styles.editPhone}>
        <Text style={styles.PhoneTxt}>{PhoneNoWithCode}</Text>
        <Icon
          name="pencil"
          color={COLORS.green}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ fontSize: 21 }}
        />
      </TouchableOpacity>
      <Box style={styles.timerContainer}>
        <Icon
          name="clock-time-four-outline"
          color={COLORS.green}
          style={{ fontSize: 18 }}
        />
        <Text style={styles.timer}>{minTwoDigitsFormat(counter)}</Text>
      </Box>
      {/* Buttons */}
      <Box style={styles.resendButtonWrapper}>
        <AbstractButton
          disabled={counter > 0 ? true : false}
          buttonStyle={styles.resendBtn}
          textStyle={styles.nextBtn}
          onPress={() => {
            resendOTP();
          }}>
          Resend OTP
        </AbstractButton>
      </Box>
    </Box>
  );

  return (
    <KeyboardAvoidingWrapper>
      <>
        <Box style={styles.container}>
          <Box flex={3} justifyContent="center">
            <Image source={assets.Reset} style={styles.frame2} />
          </Box>
          <Box style={styles.contentContainer}>
            <Box style={styles.titleContainer}>
              <Text style={styles.titleText}>OTP sent</Text>
            </Box>
            <Box style={styles.messageContainer}>
              <Text style={styles.messageText}>
                We have sent an OTP to{' '}
                <Text
                  style={{
                    fontFamily: FONTS.RobotoMedium,
                    textAlign: 'center',
                    color: '#2B2928',
                    fontSize: 14,
                    lineHeight: 24,
                  }}>
                  {PhoneNoWithCode}
                </Text>
              </Text>
              <CustomInput
                inputOutContainer={{ paddingTop: 30 }}
                placeholder={'****'}
                autoCorrect={false}
                maxLength={4}
                label={'Enter OTP'}
                labelStyle={styles.label}
                style={styles.textInput}
                keyboardType="numeric"
                value={otp}
                onChangeText={(value: string) => {
                  setOtpError('');
                  if (value.length === 4) {
                    setIsButtonDisable(false);
                  }
                  setOtp(value);
                }}
                error={otpError}
              />
            </Box>
          </Box>
          <Box style={styles.bottomBtnContainer}>
            <Box
              alignItems="center"
              justifyContent="center"
              alignSelf="center"
              mb={10}
              width="100%">
              <AbstractButton
                buttonStyle={{
                  backgroundColor: COLORS.background.primary,
                }}
                onPress={() => {
                  setModalVisible(true);
                }}
                textStyle={styles.backBtn}>
                <Text
                  style={{
                    color: COLORS.green,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  I didn’t get an OTP{' '}
                </Text>
              </AbstractButton>
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              alignSelf="center"
              width="100%">
              <AbstractButton
                textStyle={styles.nextBtn}
                loader={loader}
                disabled={isButtonDisable}
                onPress={() => {
                  onContinue();
                }}>
                Continue
              </AbstractButton>
            </Box>
            <Box style={styles.btnContainer}>
              <AbstractButton
                buttonStyle={{
                  backgroundColor: COLORS.background.primary,
                }}
                onPress={() => {
                  navigation.navigate('SignIn');
                }}
                textStyle={styles.backBtn}>
                Back to home
              </AbstractButton>
            </Box>
          </Box>
        </Box>
        {/* Custom Modal */}
        <CustomModal
          backDropClickClose={true}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}>
          <RenderCustomAlertView />
        </CustomModal>
      </>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    width: SIZES.screen_width,
    height:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.9
        : SIZES.screen_height / 1.7,
  },
  bottomBtnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: SIZES.screen_width,
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.56
        : SIZES.screen_height / 1.51,
  },
  underline: { textDecorationLine: 'underline' },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    // paddingVertical: 10,
    paddingBottom: 10,
  },
  editPhone: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  PhoneTxt: {
    color: COLORS.green,
    fontFamily: FONTS.RobotoBold,
    fontSize: SIZES.h4,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0,
    height: 30,
    marginRight: 5,
  },
  titleTxt: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.h4,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0,
    height: 30,
    marginBottom: SIZES.padding,
  },
  subTitleTxt: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body5 * 1.1,
    lineHeight: 20,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontFamily: FONTS.RobotoMedium,
    fontSize: SIZES.body5 * 1.1,
    lineHeight: 20,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 1.5,
    paddingHorizontal: 5,
  },
  resendBtn: {
    backgroundColor: COLORS.green,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  resendButtonWrapper: {
    flexDirection: 'row',
    marginTop: SIZES.padding,
    justifyContent: 'center',
  },
  PopupContainer: {
    justifyContent: 'center',
    width: SIZES.screen_width / 1.3,
    height: SIZES.screen_height / 2.7,
    padding: SIZES.padding * 2,
  },
  counterTxt: {
    fontFamily: FONTS.RobotoMedium,
    color: COLORS.black,
    fontSize: 13,
    lineHeight: 21,
  },
  describeText2: {
    color: COLORS.green,
  },
  describeText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black,
  },
  resendBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'red',
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2EF',
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0,
    height: 30,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  messageContainer: {
    marginTop: 20,
  },
  messageText: {
    fontFamily: FONTS.RobotoMedium,
    textAlign: 'center',
    color: '#2B2928',
    fontSize: 14,
    lineHeight: 24,
  },
  spanText: {
    color: '#1a6a73',
  },
  frame2: {
    height: 200,
    marginBottom: 20,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  backBtn: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.black,
    fontSize: 13,
    lineHeight: 21,
    width: SIZES.screen_width,
    textAlign: 'center',
  },
});

export default ResetLinkForPhone;
