import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import moment from 'moment';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { Image, Keyboard, Platform, StyleSheet, Text } from 'react-native';
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
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  showSafeAreaView,
} from '../state/generalUtil';
import { setRetireAge } from '../state/onboarding';
import { RootState } from '../state/rootReducer';

const WhatRetireAgeScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { retireAge } = useSelector((state: RootState) => state.onboarding);
  const inputRef = useRef();
  const { dob } = useSelector((state: RootState) => state.onboarding);
  var years = moment().diff(moment(dob), 'years', false);
  // State Declaration
  const [age, setAge] = useState(retireAge);
  const [ageError, setAgeError] = useState(false);
  // Status bar color setting
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

  useLayoutEffect(() => {
    dispatch(showSafeAreaView());
    return () => {
      dispatch(showSafeAreaView());
    };
  }, [dispatch]);

  const handleAgeChange = (value: string) => {
    if (value.length === 0) {
      setAge(0);
    }

    if (value.match(/^[0-9]+$/)) {
      setAge(parseInt(value));
    }
    if (value.length === 2) {
      return Keyboard.dismiss();
    }
  };

  const AgeCheck = (value: any) => {
    dispatch(setRetireAge(value));
    setAgeError(years === 0 ? parseInt(value) < 18 : parseInt(value) < years);
  };

  const handleOnpress = async () => {
    const id = route?.params?.doItLaterFlag;
    if (id) {
      navigation.navigate('WhatYourIncome', {
        doItLaterFlag: id,
      });
    } else {
      navigation.navigate('WhatYourIncome');
    }
  };

  const btnDisableStatus = () => {
    if (age === 0 || age < 18 || age > 79 || age < years) return true;
    return false;
  };

  // Debounce effect for retire age
  const debounceAgeHandler = useCallback(debounce(AgeCheck, 600), []);

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box alignItems="center" mt={60} width="100%">
          <Image source={assets.RaiseUpArrow} />
        </Box>
        <Box flex={2}>
          <Box mt={40}>
            <Text style={styles.titleText}>
              What age would you{'\n'} like to retire?
            </Text>
          </Box>
          <Box
            marginTop={10}
            width={'20%'}
            justifyContent={'center'}
            alignSelf={'center'}>
            <CustomInput
              inputOutContainer={{ paddingVertical: '30%' }}
              inputInsideContainer={{ height: 60 }}
              style={styles.text1}
              keyboardType="numeric"
              autoFocus={age === 0 ? true : false}
              showSoftInputOnFocus={true}
              value={age === 0 ? '' : String(age)}
              maxLength={2}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value: string) => {
                handleAgeChange(value);
                debounceAgeHandler(value.trim());
              }}
              error={ageError}
            />
          </Box>
          <Box mt={-10} mb={10} alignItems="center">
            {ageError && (
              <Text style={styles.errorText}>
                Age should not be less than your current age
              </Text>
            )}
          </Box>
          <Box mt={30}>
            <Text style={styles.text}>
              As of 2022, the average retirement age is 65
            </Text>
          </Box>
        </Box>
        <Box style={styles.continueBtn}>
          <AbstractButton
            disabled={btnDisableStatus()}
            textStyle={styles.nextBtn}
            onPress={handleOnpress}>
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
        ? SIZES.screen_height / 1.3
        : SIZES.screen_height / 1.22,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0.02,
  },
  text: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 16,
    color: '#2B2928',
    textAlign: 'center',
  },
  text1: {
    fontFamily: FONTS.RobotoBold,
    // fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 32,
    lineHeight: 36,
    color: '#1A6A73',
    textAlign: 'center',
    letterSpacing: 0,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  errorText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 11,
    color: '#F20000',
    padding: '1%',
  },
});

export default WhatRetireAgeScreen;
