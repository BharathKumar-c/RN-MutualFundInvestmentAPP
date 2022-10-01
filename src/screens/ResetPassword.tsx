import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Box,
  AbstractButton,
  KeyboardAvoidingWrapper,
  CustomInput,
  CustomModal,
} from '../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../state';
import { RootState } from '../state/rootReducer';
import { setCreatePassword, setConfirmPassword } from '../state/onboarding';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { useBackHandler } from '@react-native-community/hooks';
import { updateUserDetails } from '../service/OnboardingService';
import { resetPassword, updateResetPasswordWithEmail } from '../service/AuthService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreatePassword = ({
  navigation,
  route
}: NativeStackScreenProps<RootStackParamList>) => {
  const {
    createPassword,
    confirmpassword,
    confirmpasswordError,
    phoneNumber,
    callingCode,
    countryCode,
  } = useSelector((state: RootState) => state.onboarding);

  const {
    lowerCase,
    upperCase,
    characterCase,
    numberCase,
    password,
    passwordError,
  } = createPassword;
  const dispatch = useAppDispatch();
  const [checkPass, setCheckPass] = useState(confirmpassword);
  const [modalVisible, setModalVisible] = useState(false);
  

  const id =route?.params?.id
  const token=route?.params?.token


  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, [dispatch]);

  useBackHandler(
    useCallback(() => {
      navigation.replace('SignIn');
      return true;
    }, [navigation]),
  );

  const backHandlerMethod = () => {
    navigation.replace('SignIn');
  };

  const onContinue = async () => {

if (id && token){
  setModalVisible(true);
  const updateResult = await updateResetPasswordWithEmail(id,token,{ password,confirmPassword:confirmpassword})
   
}else{
  const result = await resetPassword({
    phone: phoneNumber,
    callingCode,
    countryCode,
    password,
  }); if (result) {
    setModalVisible(true);
  }
}
    
  
    
  };

  const RenderCustomAlertView = () => (
    <Box style={styles.PopupContainer}>
      <Text style={styles.titleTxt}>Password changed !</Text>
      <Text style={styles.subTitleTxt}>Please login with the new password</Text>
      {/* Buttons */}
      <Box style={styles.resendButtonWrapper}>
        <AbstractButton
          buttonStyle={styles.resendBtn}
          textStyle={styles.nextBtn}
          onPress={() => {
            setModalVisible(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              }),
            );
          }}>
          Login
        </AbstractButton>
      </Box>
    </Box>
  );

  return (
    <Box style={styles.container}>
      <KeyboardAvoidingWrapper>
        <Box flexDirection={'column'} mt={30}>
          <Box mt={20}>
            <Text style={styles.titleText}>Reset password</Text>

            {password.length > 0 && (
              <Box mt={30} style={styles.container2}>
                <Box style={styles.rowBox}>
                  {!lowerCase ? (
                    <Text style={[styles.text, !lowerCase && { color: 'red' }]}>
                      a
                    </Text>
                  ) : (
                    <Image source={assets.Tick} style={styles.tick} />
                  )}
                  <Text style={styles.lowerText}>Lowercase</Text>
                </Box>
                <Box style={styles.rowBox}>
                  {!upperCase ? (
                    <Text style={[styles.text, !upperCase && { color: 'red' }]}>
                      A
                    </Text>
                  ) : (
                    <Image source={assets.Tick} style={styles.tick} />
                  )}
                  <Text style={styles.lowerText}>Uppercase</Text>
                </Box>
                <Box style={styles.rowBox}>
                  {!numberCase ? (
                    <Text
                      style={[styles.text, !numberCase && { color: 'red' }]}>
                      123
                    </Text>
                  ) : (
                    <Image source={assets.Tick} style={styles.tick} />
                  )}
                  <Text style={styles.lowerText}>Numbers</Text>
                </Box>
                <Box style={styles.rowBox}>
                  {!characterCase ? (
                    <Text
                      style={[styles.text, !characterCase && { color: 'red' }]}>
                      9+
                    </Text>
                  ) : (
                    <Image source={assets.Tick} style={styles.tick} />
                  )}
                  <Text style={styles.lowerText}>Characters</Text>
                </Box>
              </Box>
            )}
            <CustomInput
              inputOutContainer={{ paddingTop: 30 }}
              autoCorrect={false}
              placeholder={'* * * * * * * *'}
              label={'ENTER PASSWORD'}
              labelStyle={styles.label}
              style={styles.textInput}
              value={password}
              secureTextEntry
              iconPosition="right"
              onChangeText={(value: string) => {
                dispatch(setCreatePassword(value));
                dispatch(setConfirmPassword(confirmpassword));
              }}
              // onBlur={(value: string) => dispatch(setCreatePassword(value))}
              error={passwordError}
            />
            <CustomInput
              inputOutContainer={0}
              autoCorrect={false}
              placeholder={'* * * * * * * *'}
              label={'CONFIRM PASSWORD'}
              editable={password.length > 0 ? true : false}
              style={styles.textInput}
              labelStyle={styles.label}
              value={checkPass}
              secureTextEntry
              iconPosition="right"
              onChangeText={(value: string) => {
                setCheckPass(value);
                dispatch(setConfirmPassword(value));
              }}
              onBlur={(value: string) =>
                dispatch(setConfirmPassword(checkPass))
              }
              error={confirmpasswordError}
            />
          </Box>
        </Box>
      </KeyboardAvoidingWrapper>
      <Box style={styles.continueBtn}>
        <AbstractButton
          disabled={
            lowerCase &&
            upperCase &&
            characterCase &&
            numberCase &&
            password &&
            confirmpassword &&
            !passwordError &&
            !confirmpasswordError
              ? false
              : true
          }
          onPress={() => {
            onContinue();
          }}>
          Continue
        </AbstractButton>
      </Box>
      {/* Custom Modal */}
      <CustomModal
        modalVisible={modalVisible}
        navigation={navigation}
        backDropClickClose={false}
        backHandlerMethod={backHandlerMethod}
        setModalVisible={setModalVisible}>
        <RenderCustomAlertView />
      </CustomModal>
    </Box>
  );
};

const styles = StyleSheet.create({
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  resendBtn: {
    backgroundColor: COLORS.green,
    width: 130,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  resendButtonWrapper: {
    flexDirection: 'row',
    marginTop: SIZES.padding * 2.5,
    justifyContent: 'center',
  },
  subTitleTxt: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body5 * 1.1,
    lineHeight: 20,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding,
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
  PopupContainer: {
    justifyContent: 'center',
    width: SIZES.screen_width / 1.3,
    height: SIZES.screen_height / 3.8,
    padding: SIZES.padding * 2,
    justifyContent: 'center',
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
    height: SCREEN_HEIGHT,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  container1: {
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'left',
    lineHeight: 30,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    borderRadius: 1,
    // borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    //lineHeight: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  text: {
    color: COLORS.green,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.semiLarge,
    lineHeight: 28,
  },
  lowerText: {
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 10,
    lineHeight: 16,
  },
  rowBox: {
    paddingRight: '10%',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordTextInput: {
    color: COLORS.black,
    height: 40,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 2,
    borderColor: '#00000010',
  },
  passwordLabel: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  tick: {
    marginBottom: '18%',
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 1,
  },
  section: {
    flexDirection: 'row',
  },
  eyeIcon: {
    width: 16,
    height: 16,
    top: '30%',
    right: '150%',
  },
});

export default CreatePassword;
