import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { AbstractButton, Box, KeyboardAvoidingWrapper } from '../../components';
import CustomInput from '../../components/CustomInput';
import { COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { updateUserDetails } from '../../service/OnboardingService';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { useAppDispatch } from '../../state/index';
import { handleFirstName, handleLastName } from '../../state/onboarding';
import { RootState } from '../../state/rootReducer';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const UpdateUserName = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();

  const { firstName, lastName, firstNameError, lastNameError } = useSelector(
    (state: RootState) => state.onboarding,
  );

  const [fName, setFName] = useState(firstName);
  const [lName, setLName] = useState(lastName);
  const [firstNameErr, setFirstNameErr] = useState<any>('');
  const [lastNameErr, setLastNameErr] = useState<any>('');
  const [isDisable, setisDisable] = useState(true);

  useEffect(() => {
    handleDisableBtn();
  }, [fName, lName]);

  const handleDisableBtn = () => {
    console.log({ fName, firstName, lName, lastName });

    if (
      (fName !== firstName || lName !== lastName) &&
      !firstNameErr &&
      !lastNameErr
    ) {
      setisDisable(false);
    } else {
      setisDisable(true);
    }
  };

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

  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
    }, []),
  );

  const handleOnPress = async () => {
    try {
      const result = await updateUserDetails({
        firstName: fName,
        lastName: lName,
      });
      if (result) {
        dispatch(handleFirstName(fName));
        dispatch(handleLastName(lName));
        navigation.navigate('UpdateConfirmDetails');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box flex={1} width={'100%'}>
          <Box pt={40}>
            <Text style={styles.titleText}>Update username</Text>

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
            disabled={isDisable}
            onPress={handleOnPress}>
            Save
          </AbstractButton>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
  );
};

export default UpdateUserName;

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
