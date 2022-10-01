import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AbstractButton, Box } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../state';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import moment from 'moment';

import {
  Chart,
  RetirementSlider,
} from '../components/RetirementPlanComponents';
import { setActivateGoal, setLifeGoal } from '../state/onboarding';
import {
  createRetirementPlan,
  createUserOnboarding,
  getDoitLater,
  getRetirementPlanById,
  getUserDataById,
  updateRetirementPlanByUserId,
} from '../service/OnboardingService';
import { CommonActions } from '@react-navigation/native';
import { RootDrawerParamList } from '../navigation/DrawerNavigation/types';

const RetirementPlanGraph = ({
  route,
  navigation,
}: NativeStackScreenProps<RootDrawerParamList>) => {
  const { dob, retireAge, retireAmount, lifeTimeGoal } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const years = moment().diff(moment(dob), 'years', false);
  const dispatch = useAppDispatch();
  // State Declaration
  const [initail, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(10000);
  const [age, setAge] = useState(retireAge);
  const [userId, setUserId] = useState('');

  // Status bar color setting
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
    getUserId();
  }, []);

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const convertStingToNum = (value: number) => {
    const input = value.toString();
    const inputLen = input.toString().length;
    let output = '';
    let ctr = 0;
    for (let i = inputLen - 1; i >= 0; i--) {
      ctr++;
      output = input[i] + output;
      // Add a separator(, ) after
      // every third digit
      if (ctr % 3 == 0 && ctr < inputLen) {
        output = ',' + output;
      }
    }
    return output;
  };

  const ANIMATE = {
    duration: 2000,
    onLoad: { duration: 1000 },
  };

  const updateAge = useCallback((newValue: number) => {
    setAge(newValue);
  }, []);

  const updateInitial = useCallback((newValue: any) => {
    setInitial(newValue);
  }, []);

  const updateMonthly = useCallback((newValue: any) => {
    setMonthly(newValue);
  }, []);

  const storeData = async () => {
    const Age = moment().diff(moment(dob), 'years', false);
    const data: any = {
      currentAge: Age,
      retireAge: retireAge,
      retirementIncome: retireAmount,
    };
    await updateIntoDB(data);
    let goal: number = (80 - Age) * retireAmount;
    if (goal) {
      dispatch(setLifeGoal(goal.toString()));
    }
  };

  const updateIntoDB = async (data: any) => {
    const dataIsExist: any = await getRetirementPlanById();
    try {
      if (!dataIsExist?.data) {
        await createRetirementPlan(data);
      } else {
        await updateRetirementPlanByUserId(data);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <ScrollView>
        <Box style={styles.container}>
          <Box flex={2} alignItems={'center'}>
            <Box mt={30} width={250} paddingLeft={10}>
              <Text style={styles.titleText}>
                At
                <Text
                  style={[
                    { textDecorationLine: 'underline' },
                    styles.spanText,
                  ]}>
                  {' '}
                  {`age ${age}`}{' '}
                </Text>
                you will get{'\n'}
                <Text style={styles.spanText}>
                  {`€ ${convertStingToNum(retireAmount)}`}{' '}
                </Text>{' '}
                per year
              </Text>
            </Box>
            <Box style={styles.GraphContainer}>
              <Box style={{ right: 0, top: 50 }}>
                <Chart setAge={updateAge} retireAge={retireAge} />
              </Box>

              <Box width={'100%'} style={styles.sliderHeader}>
                <Text style={styles.GraphLabel}>{`AGE ${years}`}</Text>
                <Text style={styles.GraphLabel}>{'Age 80'}</Text>
              </Box>
            </Box>
            <Box style={styles.GraphLabelContainer}>
              <Box style={styles.graphLabelFlex}>
                <Box
                  style={[
                    { backgroundColor: '#78B894' },
                    styles.grphLabelIndicator,
                  ]}
                />
                <Text style={styles.sliderTitle}>Your Savings</Text>
                <Text style={styles.GraphValue}>{'€3,240'}</Text>
              </Box>
              <Box style={styles.graphLabelFlex}>
                <Box
                  style={[
                    { backgroundColor: '#E15B2D' },
                    styles.grphLabelIndicator,
                  ]}
                />
                <Text style={styles.sliderTitle}>Government</Text>
                <Text style={styles.GraphValue}>{'€1,101'}</Text>
              </Box>
              <Box style={styles.graphLabelFlex}>
                <Box
                  style={[
                    { backgroundColor: '#DEBD1B' },
                    styles.grphLabelIndicator,
                  ]}
                />
                <Text style={styles.sliderTitle}>Return</Text>
                <Text style={styles.GraphValue}>{'€1,890'}</Text>
              </Box>
            </Box>
            <Box mt={30} />
            <Box width={'100%'} m={10} paddingHorizontal={20}>
              <Box style={styles.sliderHeader}>
                <Text style={styles.sliderTitle}>Initial deposit</Text>
                <Text style={styles.sliderValue}>
                  € {convertStingToNum(initail)}
                </Text>
              </Box>
              <RetirementSlider value={initail} onValueChange={updateInitial} />
            </Box>
            <Box width={'100%'} m={10} paddingHorizontal={20}>
              <Box style={styles.sliderHeader}>
                <Text style={styles.sliderTitle}>Monthly deposit</Text>
                <Text style={styles.sliderValue}>
                  € {convertStingToNum(monthly)}
                </Text>
              </Box>
              <RetirementSlider value={monthly} onValueChange={updateMonthly} />
            </Box>
          </Box>
          <Box mt={30} />

          {/* ------------Buttons------ */}
          <Box
            mb={SIZES.screen_height / 20}
            alignItems="center"
            alignSelf="center"
            width="100%"
            style={[
              !lifeTimeGoal
                ? { justifyContent: 'space-between' }
                : { justifyContent: 'center' },
              styles.btnContainer,
            ]}>
            {!lifeTimeGoal ? (
              <Box style={styles.btnFlexContainer}>
                <AbstractButton
                  buttonStyle={{
                    width: 180,
                    marginVertical: 10,
                  }}
                  textStyle={styles.nextBtn}
                  onPress={() => {
                    //   navigation.navigate('IsYourIDPhotoClear');
                  }}>
                  Add money now
                </AbstractButton>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setActivateGoal(true));
                    storeData();
                    if (userId) {
                      createUserOnboarding(parseInt(userId), 5);
                    }
                    if (route?.params?.doItLaterFlag === 5) {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'ThingsToDoScreen' }],
                        }),
                      );
                    } else {
                      navigation.navigate('Dashboard');
                    }
                  }}>
                  <Text style={styles.skipBtn}>Do it later</Text>
                </TouchableOpacity>
              </Box>
            ) : (
              <AbstractButton
                onPress={() => {
                  storeData();
                  navigation.navigate('Dashboard');
                }}>
                Continue
              </AbstractButton>
            )}
          </Box>
        </Box>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // paddingLeft: 20,
    // paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  GraphContainer: {
    // backgroundColor: 'pink',
    height: 450,
    // marginVertical: 10,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  GraphLabel: {
    fontFamily: FONTS.MerriweatherBold,
    textTransform: 'uppercase',
    fontSize: 10,
    lineHeight: 18,
    color: '#16393D',
  },
  GraphValue: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  GraphLabelContainer: {
    width: '100%',
    backgroundColor: '#EDEAE7',
    marginTop: 35,
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  graphLabelFlex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  btnFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  grphLabelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 10,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0.02,
  },
  spanText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.green,
    textAlign: 'center',
    letterSpacing: 0.02,
  },
  sliderHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 10,
    // paddingTop:10,
  },
  sliderTitle: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black,
    paddingTop: 5,
  },
  sliderValue: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.green,
    // textDecorationLine: 'underline',
  },
  btnContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  skipBtn: {
    paddingTop: 10,
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    paddingBottom: 40,
  },
});

export default RetirementPlanGraph;
