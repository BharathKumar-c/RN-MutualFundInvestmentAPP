import { Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Box, AbstractButton } from '../../components';
import { assets, COLORS, FONTS } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setIsBottomSheet } from '../../state/generalUtil';
import { useAppDispatch } from '../../state/index';

const ErrorBottomSheet = ({
  navigation,
  data,
  setIsOpen,
  userPhone,
  errorType,
}: {
  route: any;
  navigation: any;
  data: string;
  setIsOpen: Function;
  userPhone: string;
  errorType: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <Box style={styles.container}>
      <Image source={assets.ErrorAlert} style={styles.ErrorAlert} />
      <Box mt={43}>
        <Text style={styles.titleText}>
          {errorType === 'email' ? 'Email address' : 'Phone number'} is
          registered
        </Text>
      </Box>
      <Box mt={43} width={269}>
        {errorType === 'email' && (
          <Text style={styles.titleText2}>
            <Text style={styles.titleText3}>
              {data} is already being used. Do you want to login instead of
              creating a new account?
            </Text>
          </Text>
        )}
        {errorType === 'phone' && (
          <Text style={styles.titleText2}>
            <Text style={styles.titleText3}>
              {userPhone} is already being used. Do you want to login instead of
              creating a new account?
            </Text>
          </Text>
        )}
      </Box>
      <Box
        mt={43}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        width="100%">
        {errorType === 'phone' ? (
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => {
              navigation.navigate('SignIn');
              dispatch(setIsBottomSheet(true));
            }}>
            Login using this phone number
          </AbstractButton>
        ) : (
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => {
              navigation.navigate('SignIn');
              dispatch(setIsBottomSheet(true));
            }}>
            Login using this email address
          </AbstractButton>
        )}
        <TouchableOpacity
          onPress={() => {
            setIsOpen();
            dispatch(setIsBottomSheet(false));
          }}>
          {errorType === 'email' && (
            <Text style={styles.btnText}>Change email address</Text>
          )}

          {errorType === 'phone' && (
            <Text style={styles.btnText}>Change phone number</Text>
          )}
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 53,
    backgroundColor: COLORS.background.primary,
  },
  ErrorAlert: {
    width: 100,
    height: 76,
    marginTop: '20%',
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleText2: {
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleText3: {
    color: '#00000098',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.white,
  },
  btnText: {
    color: 'black',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    paddingTop: '7%',
  },
});
export default ErrorBottomSheet;
