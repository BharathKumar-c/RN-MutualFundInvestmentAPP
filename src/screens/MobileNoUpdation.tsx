import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { useDispatch } from 'react-redux';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { useAppDispatch } from '../state/index';

const MobileNoUpdation = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IE');
  const [callingCode, setCallingCode] = useState('353');
  const [phoneValidError, setPhoneValidError] = useState('');
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const dispatch = useAppDispatch();

  const handleValidMobile = (val: string) => {
    let reg = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;

    if (val.length === 0) {
      setPhoneValidError('Mobile number must be enter');
    } else if (reg.test(val) === false) {
      setPhoneValidError('Enter valid mobile number');
    } else if (reg.test(val) === true) {
      setPhoneValidError('');
    }
  };

  useEffect(() => {
    if (phoneNumber && countryCode && !phoneValidError) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  }, [phoneNumber, countryCode, phoneValidError]);

  useEffect(() => {
    dispatch(setStatusbarColor('#F2F2EF'));
    dispatch(setBarStyle('dark-content'));
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        {/* <StatusBar backgroundColor="#F2F2EF" barStyle="dark-content" /> */}
        <Box flex={1} mt={60} mb={60} style={{ paddingBottom: 100 }}>
          <Box>
            <Text style={styles.titleText}>What’s your mobile number?</Text>
          </Box>
          <Box mt={30}>
            <Box>
              <CustomInput
                inputOutContainer={{ paddingVertical: 10 }}
                placeholder={'Enter your phone number'}
                label={'MOBILE NUMBER'}
                labelStyle={styles.label}
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={(value: string) => setPhoneNumber(value)}
                onBlur={() => handleValidMobile(phoneNumber)}
                keyboardType="phone-pad"
                icon={
                  <CountryPicker
                    withFilter
                    countryCode={countryCode}
                    withCallingCodeButton
                    withFlag
                    withAlphaFilter={false}
                    withCurrencyButton={false}
                    containerButtonStyle={{
                      paddingRight: 10,
                      paddingBottom: 4,
                    }}
                    withCallingCode
                    onSelect={country => {
                      const { cca2, callingCode } = country;
                      setCountryCode(cca2);
                      setCallingCode(callingCode[0]);
                    }}
                  />
                }
                iconPosition="left"
                error={phoneValidError}
              />
            </Box>
          </Box>
          <Box style={{ width: 330 }}>
            <Text style={styles.contentText}>
              We will send you a text with verification code. Message and data
              rates may apply
            </Text>
          </Box>
        </Box>
        <Box
          mb={SIZES.screen_height / 20}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%">
          <View style={{ margin: 50 }} />
          <AbstractButton
            textStyle={styles.nextBtn}
            disabled={isButtonDisable}
            onPress={() => {
              if (!phoneValidError) {
                navigation.navigate('VerifyOtp', { phoneNumber, callingCode });
              }
            }}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    color: COLORS.black,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.MerriweatherRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 14,
    lineHeight: 24,
    color: '#000000',
  },
  error: {
    color: COLORS.danger,
    paddingTop: 4,
    fontSize: 10,
    fontFamily: FONTS.Merriweather,
    lineHeight: 16,
  },
  contentText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black,
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    color: '#747474',
    fontSize: 10,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
  mobileInputContainer: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 1,
    borderBottomWidth: 1,
  },
});

export default MobileNoUpdation;
