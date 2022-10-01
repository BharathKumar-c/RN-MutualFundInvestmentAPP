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
} from 'react-native';
import {
  Box,
  AbstractButton,
  KeyboardAvoidingWrapper,
  CustomInput,
} from '../../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../../constants';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import EmploymentStatus from './EmploymentStatu';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { setPpsnNo, setEmploymentStatus } from '../../../state/onboarding';
import { useAppDispatch } from '../../../state/index';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
} from '../../../state/generalUtil';
import Header from '../../../components/Header/Header';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import {
  addDoitLater,
  createUserOnboarding,
  getDoitLater,
  getUserDataById,
  stepOneComplete,
} from '../../../service/OnboardingService';

const TaxDetails = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { employmentStatus } = useSelector(
    (state: RootState) => state.onboarding,
  );

  const ppsnNo = useSelector((state: RootState) => state.onboarding.ppsnNumber);
  const ppsnNumberError = useSelector(
    (state: RootState) => state.onboarding.ppsnNumberError,
  );

  const [ppsnNumber, setPpsnNumber] = useState(ppsnNo);
  const [disableBtn, setDisableBtn] = useState(true);
  const [employmentStatusName, setEmploymentStatusName] =
    useState(employmentStatus);
  const employmentStatusID = useSelector(
    (state: RootState) => state.onboarding.employmentStatusId,
  );
  const [ppsnErr, setPpsnErr] = useState('');

  useEffect(() => {
    handleDisableBtn();
  }, [ppsnNumber, employmentStatusName]);

  const handleDisableBtn = () => {
    if (
      (ppsnNumber.toUpperCase() !== ppsnNo.toUpperCase() ||
        employmentStatusName !== employmentStatus) &&
      !ppsnErr
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  };

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

  // BottomSheet snap variables
  const snapPoints = ['60%'];

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
    }, [isOpen]),
  );

  const onContinuePress = async () => {
    try {
      await stepOneComplete({
        employmentStatus: employmentStatusName,
        ppsnNumber,
      });
      ppsnNumber && dispatch(setPpsnNo(ppsnNumber));
      employmentStatusName &&
        dispatch(
          setEmploymentStatus({
            name: employmentStatusName,
            id: 0,
          }),
        );
      navigation.navigate('UpdateConfirmDetails');
    } catch (error) {
      setLoader(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UpdateConfirmDetails' }],
        }),
      );
    }
  };

  const handlePPSNChange = (value: string) => {
    if (value.length <= 0) {
      setPpsnNumber(value);
    } else {
      if (value.match(/^[a-z0-9]+$/i)) {
        setPpsnNumber(value);
      }
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      if (value === '') {
        setPpsnErr('Enter Personal Public Service Number');
      } else if (specialCharRegExp.test(value)) {
        setPpsnErr('Personal Public Service Number must be numbers');
      } else if (value.length != 9) {
        setPpsnErr('Personal Public Service Number must be 9 digits');
      } else {
        setPpsnErr('');
      }
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
              <Box pt={40} flexDirection={'column'}>
                <Text style={styles.titleText}>Update tax details</Text>

                <Box mt={40}>
                  <Box width="100%">
                    <Text style={styles.label}>EMPLOYMENT STATUS</Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleSnapPress(1);
                        dispatch(setIsBottomSheet(true));
                      }}>
                      <Box style={styles.selectButton}>
                        <Text style={styles.textInputEmpStatus}>
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
                    style={styles.textInput}
                    labelStyle={styles.label}
                    placeholder={'9 digit code'}
                    onChangeText={(value: string) => handlePPSNChange(value)}
                    error={ppsnErr}
                  />
                </Box>
              </Box>
              <Box style={styles.btnContainer}>
                <AbstractButton disabled={disableBtn} onPress={onContinuePress}>
                  Save
                </AbstractButton>
              </Box>
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
              selectedValue={employmentStatusName}
              setEmploymentStatusName={setEmploymentStatusName}
              handleClosePress={handleClosePress}
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
    textTransform: 'uppercase',
  },
  textInputEmpStatus: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textTransform: 'capitalize',
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
  btnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.28
        : SIZES.screen_height / 1.22,
  },
});

export default TaxDetails;
