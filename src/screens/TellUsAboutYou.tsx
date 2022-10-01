import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { useAppDispatch } from '../state/index';
import { handleFirstName, handleLastName } from '../state/onboarding';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../state/generalUtil';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TellUsAboutYou = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();

  // const fName = useSelector((state: RootState) => state.onboarding.firstName);
  // const lName = useSelector((state: RootState) => state.onboarding.lastName);
  // const firstNameError = useSelector(
  //   (state: RootState) => state.onboarding.firstNameError,
  // );
  // const lastNameError = useSelector(
  //   (state: RootState) => state.onboarding.lastNameError,
  // );

  const { firstName, lastName } = useSelector(
    (state: RootState) => state.onboarding,
  );

  const [fName, setFName] = useState<any>(firstName);
  const [lName, setLName] = useState<any>(lastName);
  const [firstNameErr, setFirstNameErr] = useState<any>('');
  const [lastNameErr, setLastNameErr] = useState<any>('');

  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
    }, []),
  );

  useBackHandler(
    useCallback(() => {
      if (route?.params?.flag) {
        navigation.navigate('ConfirmDetails');
      } else {
        navigation.goBack();
      }

      return true;
    }, [route]),
  );

  const handleOnChangeFname = (value: string) => {
    setFName(value);
    const regExpOnlyForAlphabets = /^[a-zA-ZÀ-ÿ ‘’']*$/;
    const regTest = regExpOnlyForAlphabets.test(value);

    if (value === '') {
      setFirstNameErr('First name is required');
    } else if (!regTest) {
      setFirstNameErr('Numbers and special characters are not allowed');
    } else {
      setFirstNameErr('');
    }
  };

  const handleOnChangeLname = (value: string) => {
    setLName(value);
    const regExpOnlyForAlphabets = /^[a-zA-ZÀ-ÿ ‘’']*$/;
    const regTest = regExpOnlyForAlphabets.test(value);

    if (value === '') {
      setLastNameErr('Last name is required');
    } else if (!regTest) {
      setLastNameErr('Numbers and special characters are not allowed');
    } else {
      setLastNameErr('');
    }
  };

  const handleOnPress = () => {
    dispatch(handleFirstName(fName));
    dispatch(handleLastName(lName));
    route?.params?.flag === true
      ? navigation.navigate('ConfirmDetails')
      : navigation.navigate('TellUsAboutYou2');
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box flex={1} width={'100%'}>
          <Box pt={70}>
            <Text style={styles.titleText}>Tell us about you</Text>

            <Box mt={40} mb={10} width="100%">
              <Box>
                <CustomInput
                  placeholder={'Enter first name'}
                  label={'FIRST NAME'}
                  style={styles.textInput}
                  labelStyle={styles.labelStyle}
                  value={fName}
                  onChangeText={(value: string) => {
                    handleOnChangeFname(value);
                  }}
                  error={firstNameErr}
                />
              </Box>
              <Box>
                <CustomInput
                  placeholder={'Enter last name'}
                  label={'LAST NAME'}
                  style={styles.textInput}
                  labelStyle={styles.labelStyle}
                  value={lName}
                  onChangeText={(value: string) => {
                    handleOnChangeLname(value);
                  }}
                  error={lastNameErr}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box style={styles.continueBtn}>
          <AbstractButton
            textStyle={styles.nextBtn}
            disabled={
              !fName || !lName || firstNameErr !== '' || lastNameErr !== ''
            }
            onPress={handleOnPress}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
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
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'left',
    lineHeight: 30,
  },
  labelStyle: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default TellUsAboutYou;
