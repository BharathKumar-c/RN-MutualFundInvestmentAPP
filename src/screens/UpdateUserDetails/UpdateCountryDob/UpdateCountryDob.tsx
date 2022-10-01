import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';
import {
  AbstractButton,
  Box,
  KeyboardAvoidingWrapper,
} from '../../../components';
import { assets, COLORS, FONTS, SIZES } from '../../../constants';
import { RootStackParamList } from '../../../navigation/types';
import { updateUserDetails } from '../../../service/OnboardingService';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
} from '../../../state/generalUtil';
import { useAppDispatch } from '../../../state/index';
import { setCountry, setDOB } from '../../../state/onboarding';
import { RootState } from '../../../state/rootReducer';
import CitizenshipBottomSheetModal from './CitizenshipBottomSheetModal';
import CountryBottomSheetModal from './CountryBottomSheetModal';

const UpdateCountryDob = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(new Date());
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
  const [countryName, setCountryName] = useState(countryID);
  const [listName, setListName] = useState('country');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDisableBtn, setisDisableBtn] = useState(true);

  useEffect(() => {
    handleDisableBtn();
  }, [dob, countryName]);

  const handleDisableBtn = () => {
    if (
      (countryName && countryName !== countryID) ||
      moment(dob).format('YYYY-MM-DD') !== dateOfBirth
    ) {
      setisDisableBtn(false);
    } else {
      setisDisableBtn(true);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    var years = moment().diff(moment(date), 'years', false);
    if (date === null || years < 17) {
      setDobError('Your age must be 18 or above');
    } else {
      setDob(date);
      setDobError('');
    }
  };

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const getCountryName = (name: any) => {
    setCountryName(name);
  };

  const handleOnPress = async () => {
    try {
      const result = await updateUserDetails({
        citizenship: citizenshipID,
        country: countryName ? countryName : countryID,
        dob,
      });
      if (result) {
        dob && (await dispatch(setDOB(dob)));
        countryName && (await dispatch(setCountry(countryName)));
        navigation.navigate('UpdateConfirmDetails');
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <>
      <KeyboardAvoidingWrapper>
        {isOpen ? (
          <Box style={[{ backgroundColor: '#000000' }, styles.container]} />
        ) : (
          <>
            <Box style={styles.container}>
              <Box flex={1} mt={40}>
                <Box>
                  <Text style={styles.titleText}>
                    Update country and date of birth
                  </Text>
                </Box>
                <Box mt={40} width="100%">
                  <Box marginTop={20} width="100%">
                    <Box width="100%">
                      <Text style={styles.label}>COUNTRY OF BIRTH</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setListName('country');
                          handleSnapPress(1);
                          // dispatch(setIsBottomSheet(true));
                        }}>
                        <Box style={styles.selectButton}>
                          <Text style={styles.textInput}>
                            {countryName ? countryName : countryID}
                          </Text>
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
                      <TouchableOpacity disabled={true}>
                        <Box style={styles.selectButton}>
                          <Text style={styles.citizenshipTextInput}>Irish</Text>
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
                            error={dobError}>
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
                        date={new Date(moment(dob).format('YYYY-MM-DD'))}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box style={styles.continueBtn}>
                <AbstractButton
                  disabled={isDisableBtn}
                  onPress={handleOnPress}
                  textStyle={styles.nextBtn}>
                  Save
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
                route={route}
                navigation={navigation}
                getCountryName={setCountryName}
                value={countryName}
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

export default UpdateCountryDob;
