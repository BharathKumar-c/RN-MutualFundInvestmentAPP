import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { AbstractButton, Box, CustomModal } from '../components';
import { assets, FONTS, SIZES, COLORS } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  setBarStyle,
  setIsEnableHeader,
  setStatusbarColor,
} from '../state/generalUtil';
import { useAppDispatch } from '../state';
import { openInbox } from 'react-native-email-link';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { resetPasswordWithEmail } from '../service/AuthService';

const ResetLink = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const email = route?.params?.userInput;
  const dispatch = useAppDispatch();
  const [counter, setCounter] = useState<number>(59);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, [dispatch]);

  useEffect(() => {
    const timer: any =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const resendLink = async () => {
    setModalVisible(false);
    setCounter(60);
    try {
      await resetPasswordWithEmail({
        email: email,
      });
    } catch (error) {
      console.log(error);
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
        Before resending the link, please check if you entered the right email:
      </Text>

      <Box style={styles.emailContainer}>
        <Box>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text style={styles.PhoneTxt}>{email}</Text>
          </ScrollView>
        </Box>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
            navigation.replace('ForgotPassword', route?.params?.userInput);
          }}
          style={styles.editPhone}>
          <Icon
            name="pencil"
            color={COLORS.green}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ fontSize: 21 }}
          />
        </TouchableOpacity>
      </Box>
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
          buttonStyle={styles.resendBtn}
          textStyle={styles.nextBtn}
          disabled={counter > 0}
          onPress={() => {
            resendLink();
          }}>
          Resend link
        </AbstractButton>
      </Box>
    </Box>
  );

  return (
    <Box style={styles.container}>
      <Box flex={1} justifyContent={'center'}>
        <Box>
          <Image source={assets.Reset} style={styles.frame2} />
        </Box>
        <Box style={styles.titleContainer}>
          <Text style={styles.titleText}>Reset link sent</Text>
        </Box>
        <Box style={styles.messageContainer}>
          <Text style={styles.messageText}>
            We have sent a password reset link to
          </Text>
          <Text style={[styles.messageText, styles.spanText]}>
            {route?.params?.userInput}
          </Text>
          <Text style={styles.messageText}>
            Please follow the instructions given in the email.
          </Text>
        </Box>
        <Box style={{ alignItems: 'center' }}>
          <AbstractButton
            buttonStyle={{
              backgroundColor: COLORS.background.primary,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
            textStyle={styles.reSendBtn}>
            <Text style={{ textDecorationLine: 'underline' }}>
              I didn’t get an email
            </Text>
          </AbstractButton>
        </Box>
      </Box>

      <Box style={styles.btnContainer}>
        <AbstractButton
          textStyle={styles.nextBtn}
          onPress={() => {
            // navigation.navigate('Welcome');
            openInbox();
          }}>
          Open email
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

      {/* Custom Modal */}
      <CustomModal
       backDropClickClose={true}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}>
        <RenderCustomAlertView />
      </CustomModal>
    </Box>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: FONTS.MerriweatherBold,
    textAlign: 'center',
    color: '#2B2928',
    fontSize: SIZES.body4,
    lineHeight: SIZES.extraLarge,
  },
  spanText: {
    color: COLORS.green,
  },
  frame2: {
    height: 240,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  backBtn: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.black,
    fontSize: SIZES.body4,
    lineHeight: SIZES.h2,
  },
  btnContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  reSendBtn: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.green,
    fontSize: 13,
    lineHeight: SIZES.h2,
    textDecorationLine: 'underline',
  },
  PopupContainer: {
    justifyContent: 'center',
    width: SIZES.screen_width / 1.3,
    height: SIZES.screen_height / 2.7,
    padding: SIZES.padding * 2,
  },
  editPhone: {
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
  emailContainer: {
    display: 'flex',
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
});

export default ResetLink;
