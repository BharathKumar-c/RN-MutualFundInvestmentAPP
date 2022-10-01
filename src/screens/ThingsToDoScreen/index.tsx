import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { Box } from '../../components';
import Gauge, {
  Arc,
  Indicator,
  Needle,
  Progress,
} from '../../components/HalfPieChart';
import { assets, COLORS, FONTS } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { getCurrentOnboardingStatus } from '../../service/OnboardingService';
import { RootState, useAppDispatch } from '../../state';
import {
  setBarStyle,
  setStatusbarColor,
  showSafeAreaView,
} from '../../state/generalUtil';

const ThingsToDoScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();

  const { completionValue, completionList, nonCompletionList } = useSelector(
    (state: RootState) => state.onboardingProgress,
  );
  const [completionPoints, setCompletionPoints] = useState(completionValue);
  const [completionLists, setCompletionLists] = useState(completionList);
  const [nonCompletionLists, setNonCompletionLists] =
    useState(nonCompletionList);

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
      /* GET ONBOARDING STATUS VALUE AND IT
      WILL STORE THE VALUE IN REDUX ALSO */
      getCurrentStatus();
    }, []),
  );

  const getCurrentStatus = async () => {
    const currentStatusData: any = await getCurrentOnboardingStatus();
    setCompletionPoints(currentStatusData.completionValue);
    setCompletionLists(currentStatusData.completionList);
    setNonCompletionLists(currentStatusData.nonCompletionList);
  };

  useBackHandler(
    useCallback(() => {
      navigation.navigate('Home');

      return true;
    }, [route]),
  );
  const RenderNonCompletedSetupList = ({ item, index, navigation }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('');

    const CheckIdIexist = (idToSearch: number) => {
      return nonCompletionLists.filter((item: any) => {
        return item.onboardingChecklistId === idToSearch;
      });
    };
    return (
      <Box>
        <TouchableOpacity
          onPress={() => {
            if (
              item.onboardingChecklistId === 6 ||
              item.onboardingChecklistId === 7 ||
              item.onboardingChecklistId === 8
            ) {
              if (CheckIdIexist(1).length > 0 && CheckIdIexist(2).length > 0) {
                setMessage('Please verify your address / identity.');
                setShowAlert(true);
              } else if (CheckIdIexist(1).length > 0) {
                setMessage('Please verify your identity.');
                setShowAlert(true);
              } else if (CheckIdIexist(2).length > 0) {
                setMessage('Please verify your address.');
                setShowAlert(true);
              } else if (
                CheckIdIexist(6).length > 0 ||
                CheckIdIexist(7).length > 0 ||
                CheckIdIexist(8).length > 0
              ) {
                setMessage(
                  'We are verifying your profile. This usually takes up to 34 to 48 hours.',
                );
                setShowAlert(true);
              }
            } else {
              navigation.navigate(item.routeName, {
                doItLaterFlag: item.onboardingChecklistId,
              });
            }
          }}>
          <Box style={styles.completeListRow}>
            <Box backgroundColor="#1A6A73" style={styles.nextBtn}>
              <Image source={assets.Streak} />
              <Text style={[styles.valueIcon, { color: COLORS.white }]}>
                {item.percentageValue}
              </Text>
            </Box>
            <Box
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={styles.label}>{item.name}</Text>
              {/* <Text style={styles.textInput}>Add money to start investment</Text> */}
            </Box>
            <Box>
              <Image
                style={{ width: 6.5, height: 11.5 }}
                source={assets.ArrowRight}
              />
            </Box>
          </Box>
        </TouchableOpacity>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          // title="AwesomeAlert"
          message={message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          showConfirmButton={true}
          // cancelText="No, cancel"
          confirmText="Ok"
          confirmButtonColor="#1A6A73"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setShowAlert(false);
          }}
        />
      </Box>
    );
  };

  const RenderCompletedSetupList = ({ item, index, navigation }) => {
    return (
      <Box style={styles.completeListRow}>
        <Box backgroundColor="#78B894" style={styles.nextBtn}>
          <Image source={assets.StreakDark} />
          <Text style={[styles.valueIcon, { color: COLORS.black }]}>
            {item.percentageValue}
          </Text>
        </Box>
        <Box
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text style={styles.label4Complete}>{item.name}</Text>
        </Box>
        {/* <Box>
        </Box> */}
      </Box>
    );
  };

  return (
    <>
      <Box style={styles.container}>
        <Box flex={3}>
          <Box mt={15}>
            <Text style={styles.titleText}>
              You almost completed{'\n'}your profile
            </Text>
          </Box>
          <Box alignItems="center" width="100%" style={{ padding: '8%' }}>
            <Gauge
              value={completionPoints}
              max={100}
              angle={160}
              fontFamily="squada-one"
              accentColor="#81ADB2">
              <Arc color="#1A6A73" arcWidth={40} opacity={1} />
              <Needle offset={-10} color="black" baseWidth={1} />
              <Progress arcWidth={40} />
              <Indicator>
                {value => <Text style={styles.indicator}>{value}</Text>}
              </Indicator>
            </Gauge>
          </Box>
        </Box>
        <Box flex={3}>
          <Text style={styles.listTitle}>
            Things to do (
            <Text style={{ fontFamily: FONTS.RobotoMedium }}>
              {nonCompletionLists?.length ? nonCompletionLists?.length : 0}
            </Text>
            )
          </Text>
          <FlatList
            data={nonCompletionLists}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <RenderNonCompletedSetupList
                item={item}
                index={index}
                navigation={navigation}
              />
            )}
            keyExtractor={item => `key-${item.onboardingChecklistId}`}
          />
        </Box>
        <Box flex={2.2}>
          {/* Completed List */}
          <Text style={styles.listTitle}>Completed</Text>
          <FlatList
            data={completionLists}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <RenderCompletedSetupList
                item={item}
                index={index}
                navigation={navigation}
              />
            )}
            keyExtractor={item => `key-${item.onboardingChecklistId}`}
          />
        </Box>
      </Box>
    </>
  );
};

export default ThingsToDoScreen;

const styles = StyleSheet.create({
  completeListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 20,
  },
  valueIcon: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'right',
    letterSpacing: -0.16,
    paddingHorizontal: 2,
  },
  nextBtn: {
    height: 33,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
    flexDirection: 'row',
    marginRight: 20,
  },
  listTitle: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.black,
    marginTop: 20,
  },
  label: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    letterSpacing: -0.16,
    paddingVertical: 5,
    textTransform: 'capitalize',
  },
  label4Complete: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    letterSpacing: -0.16,
    paddingVertical: 5,
    textDecorationLine: 'line-through',
  },
  textInput: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 14,
    color: '#000000',
    opacity: 0.7,
    paddingRight: '5%',
    paddingBottom: 5,
  },
  indicator: {
    alignSelf: 'center',
    marginTop: '35%',
    color: COLORS.black,
    fontFamily: FONTS.RobotoBlack,
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
    letterSpacing: -0.32,
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
    letterSpacing: -0.32,
  },
});
