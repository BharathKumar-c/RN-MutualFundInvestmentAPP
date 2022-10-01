import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {
  Box,
  AbstractButton,
  KeyboardAvoidingWrapper,
  CustomInput,
} from '../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import EmploymentStatus from './EmploymentStatu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { setPpsnNo, setEmploymentStatus } from '../../state/onboarding';
import { useAppDispatch } from '../../state/index';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
} from '../../state/generalUtil';
import Header from '../../components/Header/Header';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import {
  addDoitLater,
  createUserOnboarding,
  getDoitLater,
  getUserDataById,
  stepOneComplete,
} from '../../service/OnboardingService';
import { screensEnabled } from 'react-native-screens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TaxDetails = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { employmentStatus } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const employmentStatusID = useSelector(
    (state: RootState) => state.onboarding.employmentStatusId,
  );
  const ppsnNo = useSelector((state: RootState) => state.onboarding.ppsnNumber);
  const ppsnNumberError = useSelector(
    (state: RootState) => state.onboarding.ppsnNumberError,
  );
  const [ppsnNumber, setPpsnNumber] = useState(ppsnNo);
  const [employmentStatusName, setEmploymentStatusName] =
    useState(employmentStatus);
  const [empStatusId, setempStatusId] = useState(employmentStatusID);
  const [userId, setUserId] = useState('');

  const DATA = [
    {
      id: 1,
      name: 'Student',
    },
    {
      id: 2,
      name: 'Unemployed',
    },
    {
      id: 3,
      name: 'Working',
    },
    {
      id: 4,
      name: 'Retiree',
    },
  ];

  useEffect(() => {
    if (employmentStatusID) {
      const status = DATA.filter(obj => {
        return obj.id === employmentStatusID;
      });
      setEmploymentStatusName(status[0].name);
    }
  }, [employmentStatusID]);

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  // BottomSheet snap variables
  const snapPoints = ['58%'];

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false);
    dispatch(setStatusbarColor('#F2F2EF'));
    dispatch(setBarStyle('dark-content'));
    dispatch(setIsBottomSheet(false));
  }, []);

  // BottomSheet Callbacks
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
    dispatch(setStatusbarColor('#000000'));
    dispatch(setBarStyle('light-content'));
  }, []);

  useEffect(() => {
    if (sheetRef.current === null) {
      dispatch(setIsBottomSheet(false));
    } else {
      dispatch(setIsBottomSheet(true));
    }
  }, [sheetRef.current]);

  useFocusEffect(
    useCallback(() => {
      if (isOpen) {
        dispatch(setStatusbarColor('#000000'));
        dispatch(setBarStyle('light-content'));
        dispatch(setIsEnableHeader(false));
      } else {
        dispatch(setStatusbarColor('#F2F2EF'));
        dispatch(setBarStyle('dark-content'));
        dispatch(setIsEnableHeader(true));
      }
      getUserId();
    }, [isOpen]),
  );

  const getUserId = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      setUserId(userData.basicInfo?.userId);
    }
  };

  const doItLater = async () => {
    addDoitLater(parseInt(userId), 4); // Tax skip id : 4

    if (route?.params?.doItLaterFlag === 4) {
      navigation.replace('ThingsToDoScreen');
    } else {
      navigation.navigate('LetsVerifyYourIdentity');
    }
  };

  const onContinuePress = () => {
    setLoader(true);
    if (userId) {
      try {
        createUserOnboarding(parseInt(userId), 4);
        stepOneComplete({
          employmentStatus: employmentStatusName,
          ppsnNumber,
        });

        const data = {
          id: empStatusId,
          name: employmentStatusName,
        };

        dispatch(setPpsnNo(ppsnNumber));
        dispatch(setEmploymentStatus(data));
        if (route?.params?.doItLaterFlag === 4) {
          navigation.replace('ThingsToDoScreen');
        } else {
          navigation.navigate('FirstStepComplete');
        }
        setLoader(false);
      } catch (error) {
        Alert.alert('Something went worng!', `${error}`);
      }
    } else {
      console.log('User not regiester');
    }
    setLoader(false);
  };

  const handlePPSNChange = (value: string) => {
    if (value.length === 0) {
      setPpsnNumber('');
    }
    if (value.match(/^[a-z0-9]+$/i)) {
      setPpsnNumber(value);
    }
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

  return (
    <>
      <KeyboardAvoidingWrapper>
        {isOpen ? (
          <Box style={[{ backgroundColor: '#000000' }, styles.container]}>
            {/* <StatusBar backgroundColor="#000000" barStyle="light-content" /> */}
          </Box>
        ) : (
          <>
            <Box style={styles.container}>
              {/* <StatusBar backgroundColor="#F2F2EF" barStyle="dark-content" /> */}
              <Box>
                <Box pt={70} flexDirection={'column'}>
                  <Text style={styles.titleText}>Tax Details</Text>

                  <Box mt={40}>
                    <Box width="100%">
                      <Text style={styles.label}>EMPLOYMENT STATUS</Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleSnapPress(1);
                          dispatch(setIsBottomSheet(true));
                        }}>
                        <Box style={styles.selectButton}>
                          <Text style={styles.textInput}>
                            {employmentStatusName}
                          </Text>
                          <Image
                            style={styles.imageStyle}
                            source={assets.ArrowDown}
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>

                  <Box mt={20}>
                    <CustomInput
                      value={ppsnNumber}
                      label={'PERSONAL PUBLIC SERVICE NUMBER (PPSN)'}
                      maxLength={9}
                      autoCapitalize={'characters'}
                      autoCorrect={false}
                      style={styles.textInputPPSN}
                      labelStyle={styles.label}
                      placeholder={'9 digit code'}
                      onChangeText={(value: string) => handlePPSNChange(value)}
                      error={ppsnNumberError}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box style={styles.btnContainer}>
              <AbstractButton
                disabled={
                  !ppsnNumber || ppsnNumberError || ppsnNumber.length < 9
                }
                loader={loader}
                onPress={() => onContinuePress()}>
                Continue
              </AbstractButton>
              <AbstractButton
                buttonStyle={{
                  backgroundColor: COLORS.background.primary,
                }}
                onPress={doItLater}
                textStyle={styles.skipBtn}>
                Do it later
              </AbstractButton>
            </Box>
          </>
        )}
      </KeyboardAvoidingWrapper>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => handleClosePress()}
          backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
          <BottomSheetView>
            <EmploymentStatus
              route={route}
              navigation={navigation}
              handleClosePress={handleClosePress}
              selectedName={employmentStatusName}
              setEmploymentStatusName={setEmploymentStatusName}
              setempStatusId={setempStatusId}
              selectedId={empStatusId}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  container1: {
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'left',
    lineHeight: 30,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textTransform: 'capitalize',
  },
  textInputPPSN: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.lightGray,
  },
  section: {
    flexDirection: 'row',
    top: 10,
  },
  Arrowdown: {
    top: '30%',
    right: '150%',
  },
  btnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.4
        : SIZES.screen_height / 1.35,
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
  imageStyle: {
    position: 'absolute',
    left: '92%',
  },
  skipBtn: {
    paddingTop: '6%',
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
});

export default TaxDetails;
