/* import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../components';
import { assets, COLORS, FONTS } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../state';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBrushContainer,
  VictoryArea,
  VictoryLine,
} from 'victory-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import moment from 'moment';
import StackAreaGraph from './RetirementPlanGraph/StackAreaGraph';
import { debounce } from 'lodash';

interface datavalues {
  [key: string]: number;
}

const TestScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { dob, retireAge, retireAmount } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const years = moment().diff(moment(dob), 'years', false);
  const [currentAge, setCUrrnetAge] = useState(years);
  const WIDTH = useWindowDimensions().width;
  const HEIGHT = useWindowDimensions().height;
  const dispatch = useAppDispatch();
  const [age, setAge] = useState(retireAge);
  const [initail, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(10000);
  // State Declaration

  // Status bar color setting
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

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

  const updateAge = useCallback(
    debounce((value: number) => {
      const data = Math.round(value).toString();
      setAge(data);
    }, 20),
    [],
  );

  const data1 = useMemo(
    () => [
      { x: 30, y: 4 },
      { x: 35, y: 15 },
      { x: 40, y: 27 },
      { x: 45, y: 44 },
      { x: 50, y: 64 },
      { x: 55, y: 90 },
      { x: 60, y: 120 },
      { x: 65, y: 155 },
      { x: 70, y: 192 },
      { x: 75, y: 232 },
      { x: 80, y: 269 },
    ],
    [],
  );

  const data2 = useMemo(
    () => [
      { x: 30, y: 4 },
      { x: 35, y: 10 },
      { x: 40, y: 18 },
      { x: 45, y: 28 },
      { x: 50, y: 41 },
      { x: 55, y: 59 },
      { x: 60, y: 80 },
      { x: 65, y: 107 },
      { x: 70, y: 136 },
      { x: 75, y: 166 },
      { x: 80, y: 202 },
    ],
    [],
  );

  const data3 = useMemo(
    () => [
      { x: 30, y: 4 },
      { x: 35, y: 8 },
      { x: 40, y: 11 },
      { x: 45, y: 15 },
      { x: 50, y: 22 },
      { x: 55, y: 30 },
      { x: 60, y: 42 },
      { x: 65, y: 57 },
      { x: 70, y: 76 },
      { x: 75, y: 102 },
      { x: 80, y: 130 },
    ],
    [],
  );

  return (
    <>
      <Text>{age}</Text>
      <Box
        style={{
          // backgroundColor: 'pink',
          height: 450,
          // marginVertical: 10,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <StackAreaGraph
          data1={data1}
          data2={data2}
          data3={data3}
          retireAge={age}
          years={21}
          updateAge={updateAge}
        />
      </Box>
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
    marginVertical: 10,
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
    marginTop: 20,
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
    justifyContent: 'space-between',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
});

export default TestScreen;
 */
