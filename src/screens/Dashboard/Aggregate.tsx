import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  Alert,
  Platform,
} from 'react-native';
import React, {
  useCallback,
  useState,
  ReactElement,
  useLayoutEffect,
} from 'react';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { Box } from '../../components';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';
import CustomDropDown from './Home/CustomDropDown';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../../state';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../../state/generalUtil';
import {
  deletePension,
  getAggregatePension,
} from '../../service/PensionService';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { AggregateInfoPopUp } from '../../components/PopUpModal';

const data = [
  { label: 'edit', value: '1', route: 'SignUp' },
  { label: 'transfer', value: '2', route: 'Splash' },
];

const Aggregate = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { width, height } = Dimensions.get('window');
  const [aggregateData, setAggregateData] = useState([]);
  const [pension, setPension] = useState([]);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);

  const WidgetList = [
    {
      key: 1,
      title: 'Deposit',
      image: assets.IncomeIcon,
      bgColor: '#D1D8D1',
    },
    {
      key: 2,
      title: 'Transfers',
      image: assets.TransferIcon,
      bgColor: '#E2DDC8',
    },
    {
      key: 3,
      title: 'Withdrawal',
      image: assets.WalletIcon,
      bgColor: '#EBE7E0',
    },
    {
      key: 4,
      title: 'Aggregate',
      image: assets.IncomeIcon,
      bgColor: '#EBE7E0',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primayGreen));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      getUserPensions();
    }, [dispatch]),
  );

  const getUserPensions = async () => {
    setLoader(true);
    try {
      const result = await getAggregatePension();
      setAggregateData(result?.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, []),
  );

  const handleDelete = async item => {
    setLoader(true);
    try {
      await deletePension(item?.id);
      getUserPensions();
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const showConfirmDialog = item => {
    return Alert.alert(
      `${item.pensionName}`,
      'Are you sure you want to delete this pension?',
      [
        // The "Yes" button
        {
          text: 'Delete',
          onPress: () => {
            handleDelete(item);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'cancel',
        },
      ],
    );
  };

  const handleOpenModal = pension => {
    setPension(pension);
    setVisible(true);
  };

  const handleCloseModal = useCallback(() => {
    setVisible(false);
  }, [visible]);

  return (
    <MenuProvider>
      <Box style={styles.container}>
        <Box style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={assets.BackIcon} style={styles.Image} />
          </TouchableOpacity>
        </Box>
        <AggregateInfoPopUp
          visible={visible}
          pension={pension}
          handleCloseModal={handleCloseModal}
        />
        <Box style={styles.headerTitle}>
          <Text style={styles.HeaderText}>Pension aggregate</Text>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => navigation.navigate('AddPension')}>
            <Image
              source={assets.PlusIcon}
              style={[styles.Image, { width: 40, height: 40, marginRight: 10 }]}
            />
          </TouchableOpacity>
        </Box>
        <Box
          style={{
            flex: 1,
            width: '100%',
          }}>
          {aggregateData.length > 0 ? (
            <ScrollView>
              <Box style={styles.TileContainer}>
                {aggregateData.map((item, index) => (
                  <Shadow
                    distance={20}
                    startColor={'#00000010'}
                    containerViewStyle={{ marginVertical: 15 }}
                    radius={20}
                    key={index.toString()}>
                    <Box
                      style={[
                        { maxWidth: width / 2.5, maxHeight: height / 4.5 },
                        styles.Card,
                      ]}
                      key={index.toString()}>
                      <Box style={styles.CardInner}>
                        <Box style={styles.CardHeader}>
                          <Text style={styles.CardTitle}>
                            {item.pensionName.length > 8
                              ? item.pensionName.slice(0, 8) + '..'
                              : item.pensionName}
                          </Text>
                          {/* Menu Code here */}
                          <View
                            onTouchStart={e => {
                              // console.log(e.nativeEvent);
                            }}>
                            <Menu>
                              <MenuTrigger customStyles={triggerStyles}>
                                <Image
                                  source={assets.kebabMenu}
                                  style={{
                                    width: 15,
                                    height: 15,
                                    padding: 10,
                                  }}
                                />
                              </MenuTrigger>
                              <MenuOptions
                                customStyles={optionsStyles}
                                optionsContainerStyle={{
                                  width: 100,
                                  zIndex: 999,
                                }}>
                                <MenuOption
                                  onSelect={() =>
                                    navigation.navigate('AddPension', {
                                      item,
                                    })
                                  }
                                  text="Edit"
                                />
                                <MenuOption
                                  onSelect={() => {}}
                                  // disabled={true}
                                  text="Transfer"
                                />
                                <MenuOption
                                  onSelect={() => showConfirmDialog(item)}>
                                  <Text style={{ color: 'red' }}>Delete</Text>
                                </MenuOption>
                              </MenuOptions>
                            </Menu>
                          </View>
                        </Box>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            handleOpenModal(item);
                          }}
                          key={index}>
                          <Box>
                            <Image
                              source={assets.PensionIcon}
                              style={{
                                width: 65,
                                height: 60,
                                marginBottom: 10,
                              }}
                            />
                            <Box style={styles.cardTextContainer}>
                              <Text style={[styles.CardText]}>
                                {'\u20AC'} <Text>{item?.potSize}</Text>{' '}
                              </Text>
                              <Text style={[styles.CardText, { fontSize: 12 }]}>
                                <Text>
                                  {item?.employer.length > 16
                                    ? item?.employer.slice(0, 16) + '..'
                                    : item?.employer}
                                </Text>{' '}
                              </Text>
                            </Box>
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    {/* </TouchableOpacity> */}
                  </Shadow>
                ))}
              </Box>
            </ScrollView>
          ) : (
            <Box style={[{ height: height / 1.2 }, styles.NoTilePage]}>
              <Text style={styles.msg}>No pension available</Text>
            </Box>
          )}
        </Box>
      </Box>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: COLORS.background.primayGreen,
    paddingVertical: Platform.OS === 'ios' ? SIZES.padding : SIZES.padding,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  headerTitle: {
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  Image: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  HeaderText: {
    textAlign: 'left',
    // backgroundColor: 'teal',
    // flexGrow: 1,
    paddingHorizontal: 10,
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: 1,
    // backgroundColor: 'pink',
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: 0,
    paddingLeft: 20,
  },
  TileContainer: {
    flex: 1,
    flexWrap: 'wrap',
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
    // backgroundColor: 'pink',
  },
  msg: {
    color: COLORS.lightGray,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 1,
    // marginBottom: 50,
  },
  NoTilePage: {
    flex: 1,
    // width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    // backgroundColor: 'teal',
  },
  Card: {
    borderRadius: 10,
    padding: SIZES.padding / 2,
    backgroundColor: COLORS.white,
  },
  CardInner: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    overflow: 'hidden',
  },
  CardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'grey',
    width: '100%',
    padding: 10,
  },
  CardTitle: {
    color: COLORS.black,
    fontFamily: FONTS.RobotoBold,
    fontSize: SIZES.h3,
    lineHeight: SIZES.body2,
    letterSpacing: 1,
  },
  CardText: {
    color: COLORS.black,
    fontFamily: FONTS.RobotoRegular,
    fontSize: SIZES.body4,
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: 'left',
    paddingBottom: 5,
  },
  cardTextContainer: {
    width: '100%',
    paddingLeft: 5,
    alignItems: 'center',
  },
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    // padding: 5,
    borderRadius: 2,
  },
  // optionsWrapper: {
  //   backgroundColor: 'transparent',
  // },
  optionWrapper: {
    backgroundColor: 'white',
    margin: 3,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: COLORS.black,
  },
};

const triggerStyles = {
  triggerText: {
    color: 'white',
  },
  triggerWrapper: {
    padding: 10,
  },
  triggerTouchable: {
    underlayColor: 'darkblue',
    activeOpacity: 70,
  },
  // TriggerTouchableComponent: TouchableHighlight,
};
export default Aggregate;
