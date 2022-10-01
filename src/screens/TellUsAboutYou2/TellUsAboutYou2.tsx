import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {
  Box,
  AbstractButton,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../../components';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CountryBottomSheetModal from './CountryBottomSheetModal';
import CitizenshipBottomSheetModal from './CitizenshipBottomSheetModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useAppDispatch } from '../../state/index';
import { setDOB } from '../../state/onboarding';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { setCountry } from '../../state/onboarding';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../../components/Header/Header';
import { useBackHandler } from '@react-native-community/hooks';

const TellUsAboutYou2 = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const countryID = useSelector((state: RootState) => state.onboarding.country);
  const citizenshipID = useSelector(
    (state: RootState) => state.onboarding.citizenship,
  );
  const dateOfBirthError = useSelector(
    (state: RootState) => state.onboarding.dobError,
  );
  const dateOfBirth = useSelector((state: RootState) => state.onboarding.dob);

  const [dob, setDob] = useState(dateOfBirth);
  const [dobError, setDobError] = useState('');
  const [listName, setListName] = useState('country');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [countryName, setCountryName] = useState(countryID);

  console.log('checking', countryName);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    var years = moment().diff(moment(date), 'years', false);
    console.log('hi', years);
    if (date === null || years < 17) {
      setDobError('Your age must be 18 or above');
    } else {
      setDobError('');
    }
    hideDatePicker();
    setDob(date);
  };

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState(false);

  // BottomSheet snap variables
  const snapPoints = ['90%'];

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
    dispatch(setStatusbarColor('#000000'));
    dispatch(setBarStyle('light-content'));
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (sheetRef.current === null) {
      dispatch(setIsBottomSheet(false));
    } else {
      dispatch(setIsBottomSheet(true));
    }
  }, [sheetRef.current]);

  useEffect(() => {
    if (isOpen) {
      dispatch(setStatusbarColor('#000000'));
      dispatch(setBarStyle('light-content'));
      dispatch(setTranslucent(false));
      dispatch(setIsEnableHeader(false));
    } else {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      dispatch(setIsEnableHeader(true));
    }
  }, [isOpen]);

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
          <Box style={[{ backgroundColor: '#000000' }, styles.container]} />
        ) : (
          <>
            <Box style={styles.container}>
              {/* <StatusBar backgroundColor="#F2F2EF" barStyle="dark-content" /> */}
              <Box flex={1} mt={40}>
                <Box>
                  <Text style={styles.titleText}>Tell us about you</Text>
                </Box>
                <Box mt={40} width="100%">
                  <Box marginTop={20} width="100%">
                    <Box width="100%">
                      <Text style={styles.label}>COUNTRY OF BIRTH</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setListName('country');
                          handleSnapPress(1);
                          dispatch(setIsBottomSheet(true));
                        }}>
                        <Box style={styles.selectButton}>
                          <Text style={styles.textInput}>{countryName}</Text>
                          <Image
                            style={styles.imageStyle}
                            source={assets.ArrowDown}
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  <Box marginTop={20} width="100%">
                    <Box width="100%">
                      <Text style={styles.label}>CITIZENSHIP</Text>
                      <TouchableOpacity
                        disabled={true}
                        // onPress={() => {
                        //   setListName('citizenship');
                        //   handleSnapPress(1);
                        // }}
                      >
                        <Box style={styles.selectButton}>
                          <Text style={styles.citizenshipTextInput}>Irish</Text>
                          {/* <Image
                        style={styles.imageStyle}
                        source={assets.ArrowDown}
                      /> */}
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  <Box marginTop={20} width="100%">
                    <Box width="100%">
                      <Text style={styles.label}>DATE OF BIRTH</Text>
                      <TouchableOpacity onPress={showDatePicker}>
                        <Box style={styles.selectButton}>
                          <Text
                            style={
                              moment(dob).format('DD/MM/YYYY') ===
                              moment(new Date()).format('DD/MM/YYYY')
                                ? styles.citizenshipTextInput
                                : styles.dateTextInput
                            }
                            error={true}>
                            {dob
                              ? moment(dob).format('DD/MM/YYYY') ===
                                moment(new Date()).format('DD/MM/YYYY')
                                ? 'dd/mm/yyyy'
                                : moment(dob).format('DD/MM/YYYY')
                              : 'dd/mm/yyyy'}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                    <Text style={styles.errorText}>{dobError}</Text>
                    <Box>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        date={dob}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box style={styles.continueBtn}>
                <AbstractButton
                  disabled={
                    moment(dob).format('DD/MM/YYYY') ===
                      moment(new Date()).format('DD/MM/YYYY') || dobError !== ''
                  }
                  onPress={() => {
                    dispatch(setDOB(dob));
                    dispatch(setCountry(countryName));
                    {
                      route?.params?.flag === true
                        ? navigation.navigate('ConfirmDetails')
                        : navigation.navigate('FindYourAddress');
                    }
                  }}
                  textStyle={styles.nextBtn}>
                  Continue
                </AbstractButton>
              </Box>
            </Box>
          </>
        )}
      </KeyboardAvoidingWrapper>
      {/* Bottom Sheet */}
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => handleClosePress()}
          backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
          <BottomSheetView>
            {listName === 'country' ? (
              <CountryBottomSheetModal
                setCountryName={setCountryName}
                route={route}
                navigation={navigation}
                Cname={countryName}
                handleClosePress={handleClosePress}
              />
            ) : (
              <CitizenshipBottomSheetModal
                route={route}
                navigation={navigation}
                handleClosePress={handleClosePress}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
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
        ? SIZES.screen_height / 1.28
        : SIZES.screen_height / 1.22,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleText: {
    width: 300,
    top: 20,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
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
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
  },
  citizenshipTextInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
    opacity: 0.5,
  },
  dateTextInput: {
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 14,
    color: COLORS.black,
    padding: '1%',
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
  errorText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 11,
    color: '#F20000',
    padding: '1%',
  },
});

export default TellUsAboutYou2;
