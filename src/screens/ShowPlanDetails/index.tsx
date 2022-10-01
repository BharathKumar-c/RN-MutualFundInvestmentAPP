import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Box, AbstractButton } from '../../components';
import { COLORS, assets, FONTS } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../state';
import { setConfirmPlan } from '../../state/onboarding';
import planData from '../../assets/sliders/planData';
import { RootState } from '../../state/rootReducer';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import {
  hideSafeAreaViewBottom,
  setBarStyle,
  setHeaderColor,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../../state/generalUtil';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  AcoordianCard,
  Barchart,
} from '../../components/ShowPlanDetailsComponents';
import moment from 'moment';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import PayMethod from './PayMethod';
import { useBackHandler } from '@react-native-community/hooks';
import {
  createUserOnboarding,
  getUserDataById,
} from '../../service/OnboardingService';
import { color } from 'react-native-reanimated';

const ShowPlanDetails = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { selectedPlan } = useSelector(
    (state: RootState) => state.onboarding.selectPlan,
  );

  const { url } = useSelector(
    (state: RootState) => state.onboarding.profilePhoto,
  );

  const { fundDeatils } = useSelector((state: RootState) => state.plans);
  // console.log("fundDeatils",fundDeatils)
  const { dob, payMethod } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const years = moment().diff(moment(dob), 'years', false);
  const [userId, setUserId] = useState('');

  const [subCategories, setSubCategories] = useState(() => [
    {
      riskLevel: 4,
      category: [],
      majorMarketSectors: [],
      topHoldings: [],
      pie: [],
      colors: ['#E15B2D', '#252344', '#479A93'],
    },
    {
      riskLevel: 3,
      category: [],
      colors: ['#E15B2D', '#252344', '#479A93'],
      majorMarketSectors: [],
      topHoldings: [],
      pie: [],
    },
    {
      riskLevel: 2,
      category: [],
      majorMarketSectors: [],
      pie: [],
      topHoldings: [],
      colors: ['#E15B2D', '#252344', '#479A93'],
    },
    {
      riskLevel: 1,
      category: [],
      majorMarketSectors: [],
      topHoldings: [],
      pie: [],
      colors: ['#E15B2D', '#252344', '#479A93'],
    },
  ]);
  const [barSlide, setBarSlide] = useState(90);
  const [riskLevel, setRiskLevel] = useState(4);
  const [isOpen, setIsOpen] = useState(false);
  const [splitUp, setSplitUp] = useState<any>([]);
  const item = planData.filter(x => x.planId === selectedPlan);
  const { width } = Dimensions.get('window');
  const WIDTH = width;

  const sheetRef = useRef<BottomSheet>(null);

  // BottomSheet snap variables
  const snapPoints = ['60%'];

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false);
    dispatch(setBarStyle('dark-content'));
    dispatch(setIsBottomSheet(false));
  }, []);

  // BottomSheet Callbacks
  const handleSnapPress = useCallback(index => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(index);
    dispatch(setBarStyle('light-content'));
  }, []);

  const barClick = useCallback(
    (props: any) => {
      console.log('test');

      const { datum, x, y } = props;
      setBarSlide(x);
      setRiskLevel(datum?.y);
      setSplitUp(
        subCategories.filter(
          (risk: { riskLevel: number }) => risk.riskLevel === datum.y,
        )[0],
      );
    },
    [riskLevel],
  );

  useFocusEffect(
    useCallback(() => {
      if (!isOpen) {
        if (item[0].color) {
          dispatch(setStatusbarColor(item[0].color));
          dispatch(setHeaderColor(item[0].color));
        }
        dispatch(setBarStyle('dark-content'));
        dispatch(setTranslucent(false));
        dispatch(hideSafeAreaViewBottom());
      } else {
        dispatch(setIsEnableHeader(false));
        dispatch(setStatusbarColor('#000000'));
        dispatch(setBarStyle('dark-content'));
        dispatch(setTranslucent(false));
        dispatch(hideSafeAreaViewBottom());
      }
      getUserId();

      return () => {
        dispatch(setIsEnableHeader(true));
        dispatch(showSafeAreaView());
        dispatch(setHeaderColor(COLORS.background.primary));
      };
    }, [isOpen, dispatch]),
  );

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const handlePayMethod = (value: any) => {
    if (userId && value) {
      createUserOnboarding(parseInt(userId), 3);
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
    } else {
      navigation.navigate('TaxDetails');
    }
  };

  const handleContinue = async () => {
    handleSnapPress(1);
    dispatch(setIsBottomSheet(true));
    dispatch(setConfirmPlan({ selectedPlan, riskLevel }));
  };

  useBackHandler(
    useCallback(() => {
      if (isOpen) {
        handleClosePress();
      } else {
        navigation.goBack();
      }
      return true;
    }, [isOpen]),
  );

  useEffect(() => {
    // console.log({ fundDeatils });
    if (fundDeatils?.assetAllocation) {
      const colors = ['#E15B2D', '#252344', '#479A93'];

      let pie: any = [];

      const category = fundDeatils?.assetAllocation.map(
        (val: any, i: number) => {
          pie.push({ x: val.name, y: val.value * 100 });
          return { ...val, value: val.value * 100, color: colors[i] };
        },
      );

      let formatData = subCategories.map(val => {
        return {
          ...val,
          category,
          pie,
          colors,
          topHoldings:
            fundDeatils?.topHoldings.map((v: any) => ({
              ...v,
              weight: v.weight * 100,
            })) || [],
          majorMarketSectors:
            fundDeatils?.majorMarketSectors.map((v: any) => ({
              ...v,
              name: v.sector,
              weight: v.weight * 100,
            })) || [],
        };
      });

      setSplitUp(
        formatData.filter(
          (risk: { riskLevel: number }) => risk.riskLevel === 4,
        )[0],
      );

      // console.log({ category });
      setSubCategories(formatData);
    }
  }, [fundDeatils, barSlide]);

  return (
    <>
      {isOpen && (
        <Box style={[{ backgroundColor: '#000000' }, styles.container]}>
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => handleClosePress()}
            backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
            <BottomSheetView>
              <PayMethod
                route={route}
                navigation={navigation}
                handleClosePress={handleClosePress}
                handlePayMethod={handlePayMethod}
              />
            </BottomSheetView>
          </BottomSheet>
        </Box>
      )}
      {!isOpen && (
        <ScrollView>
          <Box
            style={[{ backgroundColor: `${item[0].color}` }, styles.container]}>
            <Box flex={1} mt={30}>
              <Box
                style={[
                  {
                    backgroundColor: `${item[0].color}`,
                    flex: 0.2,
                  },
                  styles.cardContainer,
                ]}>
                <Box style={styles.cardContent}>
                  <Box style={styles.imageContainer}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                      <Text style={styles.id}>SELECTED PLAN</Text>
                      <Text style={styles.titleText}>{item[0].title}</Text>
                    </Box>
                    <Image
                      source={assets.ChooseYourPlan}
                      style={styles.image}
                    />
                  </Box>
                  <Text style={styles.cardText}>{item[0].description}</Text>
                  <Box style={styles.detailContainer}>
                    <Box>
                      <Text style={styles.heading}>Manage by</Text>
                      <Text style={styles.textChild}>{item[0].manage}</Text>
                    </Box>
                    <Box>
                      <Text style={styles.heading}>Annual by</Text>
                      <Text
                        style={[
                          styles.textChild,
                          { fontFamily: FONTS.RobotoMedium },
                        ]}>
                        {item[0].annual}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                style={[
                  {
                    backgroundColor: `${COLORS.white}`,
                    flex: 0.2,
                  },
                  styles.cardContainer,
                ]}>
                <Box>
                  <Text
                    style={[
                      { marginLeft: 20, marginVertical: 20 },
                      styles.graphTitle,
                    ]}>
                    Risk reward profile
                  </Text>
                  <Barchart barClick={barClick} age={years} />

                  <Box
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.black,
                      position: 'absolute',
                      top: 310,
                    }}
                  />
                  <Box
                    style={{
                      width: 1,
                      height: 250,
                      backgroundColor: COLORS.black,
                      position: 'absolute',
                      left: barSlide,
                      top: 60,
                    }}
                  />
                  <Box
                    style={{
                      width: 63,
                      height: 63,
                      position: 'absolute',
                      left: barSlide - 30,
                      top: 40,
                      // backgroundColor: 'pink',
                      borderRadius: 50,
                    }}>
                    <Image
                      style={{ width: 63, height: 63, borderRadius: 50 }}
                      source={url ? { uri: url } : assets.Smile}
                    />
                    <Box
                      style={{
                        width: 23,
                        height: 23,
                        position: 'relative',
                        top: -30,
                        right: -40,
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: COLORS.white,
                        backgroundColor: COLORS.green,
                      }}>
                      <Text style={[{ textAlign: 'center' }, styles.insideBar]}>
                        {riskLevel}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    style={{
                      backgroundColor: '#E2DDC8',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 40,
                      width: WIDTH - 60,
                      marginVertical: 10,
                      marginLeft: 20,
                    }}>
                    <Box
                      style={{
                        display: 'flex',
                        width: WIDTH - 70,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        alignItems: 'center',
                      }}>
                      <Text style={styles.arrowText}>HIGHER RISK</Text>
                      <Text style={styles.arrowText}>LOWER RISK</Text>
                    </Box>
                    <Image style={styles.planArrow} source={assets.PlanArrow} />
                  </Box>
                  <Text style={[{ marginLeft: 20 }, styles.graphText]}>
                    We have 4 types of profile. We’ll automatically switch risk
                    levels for you, based on your age.
                  </Text>
                </Box>
                <Text style={[{ marginLeft: 20 }, styles.cardTitle]}>
                  More details
                </Text>
                <AcoordianCard splitUp={splitUp} riskLevel={riskLevel} />

                <Box style={[styles.btnContainer]}>
                  <AbstractButton onPress={handleContinue}>
                    Continue
                  </AbstractButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  image: {
    bottom: 25,
    right: 20,
  },
  id: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.green,
    paddingTop: 55,
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    marginLeft: 20,
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
    paddingTop: 15,
  },
  cardText: {
    width: 300,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
    color: COLORS.black,
  },
  detailContainer: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 40,
    marginTop: 40,
    marginBottom: 20,
    paddingBottom: 5,
  },
  heading: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  textChild: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black,
  },
  graphTitle: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.black,
  },
  arrowText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.black,
  },
  planArrow: {
    marginLeft: 30,
    right: 23,
  },
  graphText: {
    marginVertical: 18,
    width: 360,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black,
  },
  cardTitle: {
    marginVertical: 10,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.black,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginTop: 50,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  insideBar: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 16,
    lineHeight: 18,
    color: COLORS.white,
    fill: COLORS.white,
  },
});

export default ShowPlanDetails;
