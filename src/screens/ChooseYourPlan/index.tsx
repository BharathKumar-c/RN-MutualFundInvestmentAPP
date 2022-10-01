import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Box, AbstractButton } from '../../components';
import { COLORS, FONTS } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList } from 'react-native-gesture-handler';
import planData from '../../assets/sliders/planData';
import SliderItems from './SliderModule';
import Paginator from '../../components/Paginator';
import { useAppDispatch } from '../../state';
import { useBackHandler } from '@react-native-community/hooks';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  addDoitLater,
  deleteDoitLater,
  deleteUserOnboardingCheckList,
  getUserDataById,
} from '../../service/OnboardingService';
import { getRetirementPlanFund } from '../../service/PlanService';
import { removeAccessToken } from '../../service/AuthService';
import { setPayMethod } from '../../state/onboarding';

const ChooseYourPlan = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 30 }).current;
  const dispatch = useAppDispatch();
  const { width } = Dimensions.get('window');
  const [userId, setUserId] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setTranslucent(false));
      dispatch(setBarStyle('dark-content'));
      getUserId();
    }, []),
  );

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const doItLater = async () => {
    deleteUserOnboardingCheckList(parseInt(userId), 3);
    addDoitLater(parseInt(userId), 3); // choose your plan id : 3

    if (route?.params?.doItLaterFlag === 3) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.navigate('TaxDetails');
    }
  };

  useEffect(() => {
    getRetirementPlanFund();
  }, []);

  useBackHandler(
    useCallback(() => {
      if (route?.params?.doItLaterFlag === 3) {
        navigation.navigate('ThingsToDoScreen');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          }),
        );
      }
      return true;
    }, [route]),
  );

  return (
    <>
      <Box style={styles.container}>
        <Box flex={1} mt={30}>
          <Text style={styles.titleText}>Choose your plan</Text>
          <Box
            style={{
              flex: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FlatList
              data={planData}
              renderItem={({ item }) => (
                <SliderItems
                  item={item}
                  navigation={navigation}
                  route={route}
                />
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate={300}
              snapToInterval={width - 30}
              bounces={false}
              keyExtractor={item => item.id}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                },
              )}
              // onViewableItemsChanged={viewableItemsChanged}
              viewabilityConfig={viewConfig}
              scrollEventThrottle={32}
              ref={slidesRef}
            />
          </Box>
          <Box
            style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Paginator
              data={planData}
              scrollX={scrollX}
              dotColor={COLORS.black}
            />
          </Box>
          <Box
            style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <AbstractButton
              buttonStyle={{
                width: 120,
                backgroundColor: COLORS.gray,
              }}
              textStyle={{ color: COLORS.black }}
              onPress={doItLater}>
              Do it later
            </AbstractButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxStyle: {
    flex: 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    width: 300,
    top: 10,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
    marginLeft: 20,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 1,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 10,
    borderColor: '#e5e5e5',
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.MerriweatherRegular,
    width: '100%',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black,
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 10,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
  imageStyle: {
    position: 'absolute',
    left: '92%',
  },
});

export default ChooseYourPlan;
