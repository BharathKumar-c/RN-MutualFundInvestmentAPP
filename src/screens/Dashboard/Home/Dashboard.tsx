import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import CircularProgress from 'react-native-circular-progress-indicator';
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { Svg } from 'react-native-svg';
import UserAvatar from 'react-native-user-avatar';
import { useSelector } from 'react-redux';
import { VictoryPie } from 'victory-native';
import { AbstractButton, Box } from '../../../components';
import Paginator from '../../../components/Paginator';
import { assets, COLORS, FONTS, SIZES } from '../../../constants';
import { RootDrawerParamList } from '../../../navigation/DrawerNavigation/types';
import { getCurrentOnboardingStatus } from '../../../service/OnboardingService';
import { getAggregatePension } from '../../../service/PensionService';
import { useAppDispatch } from '../../../state';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  showSafeAreaView,
} from '../../../state/generalUtil';
import { RootState } from '../../../state/rootReducer';
import AnimatedDashboardLayer, {
  BottomSheetRefProps,
} from './AnimatedDashboardLayer';
import CustomDropDown from './CustomDropDown';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const PieChartData = [
  {
    key: 1,
    totalpot: 0,
    lifeTimeGoal: 0,
    chartData: [
      { x: 1, y: 70 },
      { x: 2, y: 150 },
    ],
    Upcoming: false,
  },
  {
    key: 2,
    totalpot: 0,
    lifeTimeGoal: 0,
    chartData: [
      { x: 1, y: 20 },
      { x: 2, y: 150 },
    ],
    Upcoming: true,
  },
  {
    key: 3,
    totalpot: 0,
    lifeTimeGoal: 0,
    chartData: [
      { x: 1, y: 150 },
      { x: 2, y: 70 },
    ],
    Upcoming: true,
  },
];

const WidgetList = [
  {
    key: 1,
    title: 'Deposit',
    image: assets.IncomeIcon,
    bgColor: '#D1D8D1',
    navigateTo: 'Transfers',
  },
  {
    key: 2,
    title: 'Transfers',
    image: assets.TransferIcon,
    bgColor: '#E2DDC8',
    navigateTo: 'Transfers',
  },
  {
    key: 3,
    title: 'Withdrawal',
    image: assets.WalletIcon,
    bgColor: '#EBE7E0',
    navigateTo: 'Transfers',
  },
  {
    key: 4,
    title: 'Aggregate',
    image: assets.IncomeIcon,
    bgColor: '#EBE7E0',
    navigateTo: 'Aggregate',
  },
];

const CardList = [
  {
    key: 1,
    title: 'INVESTMENT GUIDE',
    description: 'The basic types of investments',
    image: assets.BoatOnSea2,
    bgColor: '#D1D8D1',
  },
  {
    key: 2,
    title: 'INVESTMENT GUIDE ONE',
    description: 'The basic types of investments',
    image: assets.BoatOnSea2,
    bgColor: '#E2D8C8',
  },
  {
    key: 3,
    title: 'INVESTMENT GUIDE TWO',
    description: 'The basic types of investments',
    image: assets.BoatOnSea2,
    bgColor: '#EBE7E0',
  },
];

type Props = NativeStackScreenProps<RootDrawerParamList, 'Dashboard'>;

function Dashboard({ navigation }: Props) {
  const AnimatedRef = useRef<BottomSheetRefProps>(null);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {
    dob,
    retireAge,
    retireAmount,
    profilePhoto,
    activateGoal,
    firstName,
    lastName,
  } = useSelector((state: RootState) => state.onboarding);
  const [lifeTimeGoal, setLifeTimeGoal] = useState(0);
  const [totalPotPercentage, setTotalPotPercentage] = useState(0);
  const [potSizeTitile, setPotSizeTitile] = useState('');
  const [potSize, setPotSize] = useState(0);
  const [totalPot, setTotalPot] = useState(0);
  const [potSizeOnpress, setPotSizeOnpress] = useState(0);
  const [loader, setLoader] = useState(false);
  const currentAge = moment().diff(moment(dob), 'years', false);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 30 }).current;
  const slidesRef = useRef(null);

  // Dropdown declaration
  const [selected, setSelected] = useState(undefined);
  const data = [
    { label: 'Profile', value: '1', route: 'UserProfile' },
    { label: 'Logout', value: '2', route: 'Splash' },
  ];
  const { completionList, completionValue, nonCompletionList } = useSelector(
    (state: RootState) => state.onboardingProgress,
  );

  const handleAnimated = () => {
    AnimatedRef?.current?.scrollTo(1.03);
  };

  //currency formater
  const currencyFormat = (num: any) => {
    num = num.toString();
    if (num.length > 0) {
      return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
      return '';
    }
  };

  // Totalpot Percentage Calculations
  const totalpotPercentageCalc = (age: number, income: number) => {
    const MAX_AGE = 80;
    const MIN_AGE = 18;
    let min_value: number = (MAX_AGE - age) * income;
    let max_value: number = (MAX_AGE - MIN_AGE) * income;
    return parseInt(((max_value / min_value) * 100).toFixed(2));
  };

  // Slider functionality
  const scrollX = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState(0);

  useFocusEffect(
    useCallback(() => {
      dispatch(hideSafeAreaView());
      dispatch(setStatusbarColor(COLORS.background.primaryDrakGreen));
      dispatch(setBarStyle('light-content'));
      handleAnimated();

      /* GET ONBOARDING STATUS VALUE AND IT
      WILL STORE THE VALUE IN REDUX ALSO */
      getCurrentOnboardingStatus();

      // cleanup
      return () => {
        dispatch(setStatusbarColor(COLORS.background.primary));
        dispatch(setBarStyle('dark-content'));
        dispatch(showSafeAreaView());
      };
    }, []),
  );

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
    return () => {
      dispatch(showSafeAreaView());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFocused || retireAge || retireAmount) {
      updateRetirementPlanData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retireAge, retireAmount, isFocused]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const PotSize = await calculatePotSize();
        if (potSizeOnpress === 0) {
          setPotSizeTitile(PotSize[potSizeOnpress].name);
          setPotSize(PotSize[potSizeOnpress].value);
          setTotalPot(PotSize[potSizeOnpress].value);
        }
      })();
    }
  }, [isFocused]);

  const updateRetirementPlanData = () => {
    let goal: number = (80 - currentAge) * retireAmount;
    totalpotPercentageCalc(retireAge, retireAmount);
    setLifeTimeGoal(currencyFormat(goal));
  };

  const handleTotalPot = async () => {
    const PotSize = await calculatePotSize();
    let count = potSizeOnpress + 1;
    if (count > PotSize.length - 1) {
      setPotSizeOnpress(0);
      count = 0;
    } else {
      setPotSizeOnpress(count);
    }
    setPotSizeTitile(PotSize[count].name);
    setPotSize(PotSize[count].value);
  };

  const calculatePotSize = async () => {
    // setLoader(true);
    const pensionData: any = await getAggregatePension();
    const mashmallowIncome = 0;
    var potList: any = [];
    var totalPensionAmt: number =
      pensionData?.data?.length > 0
        ? pensionData.data.reduce(
            (n: any, { potSize }: { potSize: any }) => n + potSize,
            0,
          )
        : 0;
    var totalValue = mashmallowIncome + totalPensionAmt;
    potList.push({ name: 'Total', value: totalValue });
    potList.push({ name: 'MM', value: mashmallowIncome });
    pensionData.data.map((item: any) => {
      potList.push({ name: item.pensionName, value: item.potSize });
    });
    // setLoader(false);
    return potList;
  };

  const renderPieCharItem = ({ item, index }) => {
    return (
      <Box style={[styles.pieChartWidget]}>
        <Box
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 40,
          }}>
          <Box style={styles.circle}>
            <Svg viewBox="0 0 400 400">
              <VictoryPie
                standalone={false}
                padding={10}
                width={400}
                height={400}
                colorScale={['#78B894', '#DDDDDC']}
                data={item.chartData}
                innerRadius={150}
                labelRadius={100}
                style={{ labels: { display: 'none' } }}
              />
            </Svg>
          </Box>
          {item.Upcoming ? (
            <>
              <Box>
                <Text style={styles.setGoal}>UPCOMING</Text>
              </Box>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleTotalPot}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 150,
                  borderTopRightRadius: 150,
                  height: '55%',
                  width: '70%',
                }}>
                <Text style={styles.pieChartTitleText}>
                  {`${
                    potSizeTitile.length > 10
                      ? potSizeTitile.slice(0, 10) + '..'
                      : potSizeTitile
                      ? potSizeTitile
                      : 'TOTAL'
                  } Pot`}
                </Text>
                <Text style={styles.pieChartAmoutText}>
                  {'\u20AC'} {currencyFormat(potSize)}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignSelf: 'center',
                  borderBottomWidth: 2,
                  borderBottomColor: 'rgba(0, 0, 0, 0.08)',
                  width: '55%',
                }}
              />
              {parseInt(lifeTimeGoal) > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('RetirementPlan');
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: 150,
                    borderBottomRightRadius: 150,
                    height: '48%',
                    width: '70%',
                  }}>
                  <Text style={[styles.pieChartTitleText]}>LIFETIME GOAL</Text>
                  <Text style={styles.pieChartAmoutText}>
                    {'\u20AC'} {lifeTimeGoal}.00
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('RetirementPlan');
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: 150,
                    borderBottomRightRadius: 150,
                    height: '48%',
                    width: '70%',
                  }}>
                  <Box>
                    <Text style={styles.setGoal}>Set a goal</Text>
                  </Box>
                </TouchableOpacity>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(item.navigateTo)}
        key={index.toString()}>
        <Box style={[{ backgroundColor: item.bgColor }, styles.widget]}>
          <Image
            source={item.image}
            style={{ width: 65, height: 30, marginBottom: 10 }}
          />
          <Text style={styles.widgetText}>{item.title}</Text>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderItemCard = ({ item, index }) => {
    return (
      <TouchableOpacity key={index}>
        <Box style={[{ backgroundColor: item.bgColor }, styles.card]}>
          <Box style={styles.cardImage}>
            <Image source={item.image} />
          </Box>
          <Box style={styles.cardDescription}>
            <Text style={styles.cardSubTitleText}>{item.title}</Text>
            <Text style={styles.cardDescText}>{item.description}</Text>
          </Box>
          <Box style={styles.progressBar}>
            <ProgressBar
              height={4}
              progress={80}
              trackColor={COLORS.white}
              backgroundColor="#1A6A73"
              animated={true}
            />
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!loader && (
        <Box style={styles.outerContainer}>
          {/* Header */}
          <Box style={styles.headerContainer}>
            <View style={styles.headerLeftColumn}>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => navigation.openDrawer()}>
                <Image
                  source={assets.HamburgerMenu}
                  style={styles.hamburgerMenu}
                />
              </TouchableOpacity>
              <Image source={assets.LogoSxSize} style={styles.logo} />
            </View>
            <View style={styles.headerTitleTopView}>
              <View style={styles.totalPotTitleText}>
                <Text style={styles.topTitleText}>Total Pot</Text>
              </View>
              <View style={styles.headerTitleValueView}>
                <Text style={styles.amoutText}>
                  {'\u20AC'} {currencyFormat(totalPot)}
                </Text>
                <View style={{ marginHorizontal: 6 }}>
                  <Image
                    source={assets.Triangle}
                    style={{ tintColor: COLORS.background.primayGreen }}
                  />
                </View>
                <Text style={styles.percentageText}>{totalPotPercentage}%</Text>
              </View>
            </View>
            <View style={[styles.headerRightColumn, styles.rightView]}>
              <CustomDropDown
                label="Select Item"
                data={data}
                onSelect={setSelected}
                navigation={navigation}>
                {profilePhoto.url ? (
                  <Image
                    source={{ uri: profilePhoto.url }}
                    style={styles.avatar}
                  />
                ) : (
                  <UserAvatar
                    size={50}
                    bgColor={COLORS.green}
                    style={styles.avatar}
                    name={firstName ? `${firstName} ${lastName}` : ''}
                  />
                )}
              </CustomDropDown>
            </View>
          </Box>
          <Box style={styles.container}>
            <AnimatedDashboardLayer ref={AnimatedRef}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box style={styles.AnimatedWrapper}>
                  {/* Pie Chart View */}
                  <Box style={styles.pieChartContainer}>
                    {/* <PieChart navigation={navigation} /> */}
                    <FlatList
                      data={PieChartData}
                      renderItem={renderPieCharItem}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      decelerationRate={170}
                      snapToInterval={SIZES.screen_width}
                      bounces={false}
                      keyExtractor={item => `key-${item.key}`}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                          useNativeDriver: false,
                        },
                      )}
                      viewabilityConfig={viewConfig}
                      scrollEventThrottle={32}
                      ref={slidesRef}
                    />
                  </Box>
                  <Box height={10} />
                  <Box width={'100%'} justifyContent={'center'}>
                    <Paginator
                      data={PieChartData}
                      scrollX={scrollX}
                      dotColor="#78B894"
                    />
                  </Box>
                  {/* End Pie Chart View */}

                  <Box height={25} />
                  {/* Profile completios */}
                  <View
                    style={{
                      left: 0,
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      onPress={() => navigation.navigate('ThingsToDoScreen')}>
                      <View
                        style={[
                          {
                            width: SIZES.screen_width * 0.9,
                            paddingTop: SIZES.padding * 3,
                            paddingBottom: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 2,
                            borderRadius: SIZES.radiusSm,
                            backgroundColor: '#EDEAE7',
                            shadowColor: '#52006A',
                            elevation: 5,
                          },
                          Platform.OS === 'ios' && {
                            shadowOffset: { width: 5, height: 5 },
                            shadowOpacity: 0.2,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {/* Avatar */}
                          <CircularProgress
                            radius={30}
                            value={completionValue}
                            titleColor={'#78B894'}
                            fontSize={14}
                            valueSuffix={'%'}
                            inActiveStrokeColor={'#78B894'}
                            activeStrokeColor={'#78B894'}
                            activeStrokeWidth={5}
                            inActiveStrokeOpacity={0.2}
                            inActiveStrokeWidth={4}
                            duration={2000}
                            onAnimationComplete={() => setValue(50)}
                          />

                          <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                            {/* Name & Rating */}
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  color: COLORS.black,
                                  fontFamily: FONTS.PlayfairDisplayBold,
                                  fontSize: 16,
                                  lineHeight: 20,
                                }}>
                                {'Complete Your Profile'}
                              </Text>
                            </View>

                            {/* Restaurant */}
                            <Text
                              style={{
                                color: COLORS.lightGray,
                                fontFamily: FONTS.MerriweatherRegular,
                                fontSize: 12,
                                lineHeight: 20,
                              }}>
                              {'To make the most of your account'}
                            </Text>
                          </View>
                        </View>

                        {/* Buttons */}
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: SIZES.padding * 2,
                            justifyContent: 'flex-end',
                          }}>
                          <AbstractButton
                            buttonStyle={{
                              backgroundColor: COLORS.green,
                              width: 130,
                              height: 35,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 100,
                            }}
                            textStyle={styles.nextBtn}
                            onPress={() =>
                              navigation.navigate('ThingsToDoScreen')
                            }>
                            FINISH SETUP
                          </AbstractButton>
                        </View>
                      </View>
                    </Pressable>
                  </View>

                  <Box height={25} />
                  {/* Widgets Container */}
                  <Box style={styles.widgetContainer}>
                    <FlatList
                      data={WidgetList}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={item => `key-${item.key}`}
                    />
                  </Box>

                  <Box height={25} />
                  {/* Card Container */}
                  <Box style={styles.cardOuterContainer}>
                    <Text style={styles.cardTitleText}>Knowledge</Text>
                    <Box style={styles.cardContainer}>
                      <FlatList
                        data={CardList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItemCard}
                        keyExtractor={item => `key-${item.key}`}
                      />
                    </Box>
                  </Box>
                </Box>
              </ScrollView>
            </AnimatedDashboardLayer>
          </Box>
        </Box>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginLeft: 19,
  },
  hamburgerMenu: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.white,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.background.primaryDrakGreen,
    paddingVertical: Platform.OS === 'ios' ? 40 : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.primaryDrakGreen,
  },
  headerContainer: {
    height: 50,
    marginTop: 30,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.background.primaryDrakGreen,
  },
  headerLeftColumn: {
    flex: 0.6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerRightColumn: {
    flex: 0.4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  totalPotTitleText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleTopView: {
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitleText: {
    fontFamily: FONTS.OpenSansBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 0.16,
    textTransform: 'uppercase',
    color: COLORS.white,
  },
  amoutText: {
    fontFamily: FONTS.OpenSansBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
  percentageText: {
    color: COLORS.white,
    fontFamily: FONTS.OpenSans,
    fontSize: 12,
    lineHeight: 20,
  },
  headerTitleValueView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightView: {
    justifyContent: 'flex-end',
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 40,
  },
  setGoal: {
    minWidth: SIZES.screen_width / 3,
    fontFamily: FONTS.MerriweatherBlack,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 1.6,
    color: '#1A6A73',
    textTransform: 'uppercase',
  },

  // Animated View Styles
  AnimatedWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 50,
  },
  centerText: {
    width: 300,
    height: 300,
    textAlign: 'center',
    color: COLORS.black,
  },
  circle: {
    marginTop: 25,
    width: 300,
    height: 300,
    textAlign: 'center',
    color: COLORS.black,
    position: 'absolute',
  },
  widgetContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widget: {
    height: 90,
    width: 100,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: '#333333',
  },
  cardOuterContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    marginHorizontal: 50,
    marginBottom: 60,
  },
  pieChartContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    height: 290,
  },
  pieChartWidget: {
    flex: 1,
    paddingVertical: '4%',
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    color: COLORS.black,
  },
  cardContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 50,
    paddingRight: 20,
  },
  cardTitleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    alignSelf: 'flex-start',
  },
  card: {
    width: 320,
    height: 280,
    backgroundColor: '#EDEAE7',
    borderRadius: 8,
    justifyContent: 'space-between',
    marginRight: 9,
  },
  cardImage: {
    width: 320,
    height: 142,
    backgroundColor: '#CCDDC1',
    borderRadius: 8,
  },
  cardDescription: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  cardSubTitleText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 1.16,
    textTransform: 'uppercase',
    color: '#1A6A73',
    marginBottom: 10,
  },
  cardDescText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 20,
    color: '#333333',
  },
  progressBar: {
    justifyContent: 'center',
    height: '20%',
    paddingHorizontal: 20,
  },
  pieChartTitleText: {
    fontFamily: FONTS.MerriweatherBlack,
    fontSize: 12,
    lineHeight: 13,
    textAlign: 'center',
    letterSpacing: 1.6,
    color: '#1A6A73',
    textTransform: 'uppercase',
  },
  pieChartAmoutText: {
    fontFamily: FONTS.RobotoMedium,
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
    marginTop: '5%',
  },
  activeButton: {
    backgroundColor: 'black',
    width: 24,
    height: 4,
    marginBottom: '275%',
  },
  inActiveButton: {
    backgroundColor: 'black',
    width: 4,
    height: 4,
    marginBottom: '275%',
  },
});

export default Dashboard;
