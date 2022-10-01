import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import {
  createRetirementPlan,
  getRetirementPlanById,
  updateRetirementPlanByUserId,
} from '../service/OnboardingService';
import { useAppDispatch } from '../state';
import {
  hideSafeAreaView,
  hideSafeAreaViewBottom,
  setBarStyle,
  setStatusbarColor,
  showSafeAreaView,
} from '../state/generalUtil';
import { setRetireAmount } from '../state/onboarding';
import { RootState } from '../state/rootReducer';

const SYMBOL = '\u20AC';
const WhatYourIncome = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { retireAmount, retireAge, dob } = useSelector(
    (state: RootState) => state.onboarding,
  );

  const currencyFormat = (num: any) => {
    // num = num.split('\u20AC').join('');
    if (num.length > 0) {
      num = num.replace(/\,/g, '');
      return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
      return '';
    }
  };
  // State Declaration
  const [income, setIncome] = useState(retireAmount);

  // Status bar color setting
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

  // useLayoutEffect(() => {
  //   dispatch(hideSafeAreaViewBottom());

  //   return () => {
  //     dispatch(showSafeAreaView());
  //   };
  // }, [dispatch]);

  const handleContinue = async () => {
    // const Age = moment().diff(moment(dob), 'years', false);
    // const data: any = {
    //   currentAge: Age,
    //   retireAge: retireAge,
    //   retirementIncome: retireAmount,
    // };
    // await updateIntoDB(data);
    const id = route?.params?.doItLaterFlag;
    if (id) {
      navigation.navigate('RetirementPlanGraph', {
        doItLaterFlag: id,
      });
    } else {
      navigation.navigate('RetirementPlanGraph');
    }
  };

  // const updateIntoDB = async (data: any) => {
  //   const dataIsExist: any = await getRetirementPlanById();
  //   try {
  //     if (!dataIsExist?.data) {
  //       await createRetirementPlan(data);
  //     } else {
  //       await updateRetirementPlanByUserId(data);
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  // Debounce effect for retire income
  const debounceIncomeHandler = useCallback(
    debounce(value => {
      dispatch(setRetireAmount(value.replace(/\,/g, '')));
    }, 600),
    [],
  );

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box alignItems="center" mt={60} width="100%">
          <Image source={assets.IncomeIcon} />
        </Box>
        <Box flex={2}>
          <Box mt={50}>
            <Text style={styles.titleText}>
              What income {'\n'}would you require {'\n'}during retirement?
            </Text>
          </Box>
          <Box
            marginTop={30}
            width={'60%'}
            justifyContent={'center'}
            alignSelf={'center'}
            display={'flex'}
            flexDirection={'row'}>
            {income.toString().length > 0 && (
              <Box>
                <CustomInput
                  inputOutContainer={{ paddingVertical: '0%' }}
                  inputInsideContainer={{ height: 60 }}
                  style={styles.text1}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  autoCorrect={false}
                  icon={<Text style={styles.text1}>{'\u20AC'}</Text>}
                  iconPosition="left"
                />
              </Box>
            )}
            <Box minWidth={'20%'}>
              <CustomInput
                inputOutContainer={{ paddingVertical: '0%' }}
                inputInsideContainer={{ height: 60 }}
                style={styles.text1}
                value={income === 0 ? '' : String(income)}
                autoCapitalize="none"
                keyboardType="numeric"
                autoCorrect={false}
                autoFocus={income === 0 ? true : false}
                // icon={<Text style={styles.text1}>{'\u20AC'}</Text>}
                // iconPosition="left"
                onChangeText={(value: string) => {
                  if (value.length !== 0) {
                    if (
                      parseInt(value.replace(/\,/g, '')) < 9999999 &&
                      value.replace(/\,/g, '').match(/^[0-9]+$/)
                    ) {
                      setIncome(currencyFormat(value));
                    }
                  } else if (value.length === 0) {
                    setIncome(currencyFormat(value));
                  }
                  debounceIncomeHandler(value);
                }}
                // onBlur={(value: string) => {
                //   dispatch(setRetireAmount(income.replace(/\,/g, '')));
                // }}
              />
            </Box>
          </Box>
          <Box mt={50}>
            <Text style={styles.text}>
              Current Guidelines{'\n'}• €20,000 to cover essentials • €40,000
              for comfortable{'\n'}retirement • €60,000 for more luxury
            </Text>
          </Box>
        </Box>
        <Box style={styles.continueBtn}>
          <AbstractButton
            disabled={!income}
            textStyle={styles.nextBtn}
            onPress={handleContinue}>
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
    lineHeight: 18,
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
    letterSpacing: -1,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
});

export default WhatYourIncome;
