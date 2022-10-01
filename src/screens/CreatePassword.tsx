import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../state';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { setConfirmPassword, setCreatePassword } from '../state/onboarding';
import { RootState } from '../state/rootReducer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreatePassword = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { createPassword, confirmpassword, confirmpasswordError } = useSelector(
    (state: RootState) => state.onboarding,
  );

  const { isBiometricsAvailable } = useSelector(
    (state: RootState) => state.generalUtil,
  );

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

  const handleConfirmPsw = (value: string) => {
    dispatch(setConfirmPassword(value));
  };

  // Debounce effect for confirm passwor
  const debounceConfirmPsw = useCallback(debounce(handleConfirmPsw, 600), []);

  return (
    <Box style={styles.container}>
      <KeyboardAvoidingWrapper>
        <Box flexDirection={'column'} mt={30}>
          <Box mt={20}>
            <Text style={styles.titleText}>Create password</Text>

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
                debounceConfirmPsw(value.trim());
              }}
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
            if (isBiometricsAvailable) {
              navigation.navigate('FaceId');
            } else {
              navigation.navigate('ProfilePhoto');
            }
          }}>
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
    borderColor: '#e5e5e5',
    fontSize: 16,
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
