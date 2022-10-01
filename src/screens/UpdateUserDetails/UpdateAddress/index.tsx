import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, LogBox, Platform, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  AbstractButton,
  Box,
  KeyboardAvoidingWrapper,
} from '../../../components';
import CustomInput from '../../../components/CustomInput';
import { assets, COLORS, FONTS, SIZES } from '../../../constants';
import AddressBottomSheet from './AddressBottomSheet';
import { RootState, useAppDispatch } from '../../../state';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
} from '../../../state/generalUtil';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AutoComplete from './AutoComplete';
import { useSelector } from 'react-redux';
import { setAddress } from '../../../state/onboarding';
import Header from '../../../components/Header/Header';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { updateUserDetails } from '../../../service/OnboardingService';

const UpdateAddress = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { address } = useSelector((state: RootState) => state.onboarding);
  const [userAddress, setUserAddress] = useState(address);
  // const [userAddressBs, setUserAddressBs] = useState('');
  const [isDisable, setisDisable] = useState(true);

  useEffect(() => {
    handleDisableBtn();
  }, [userAddress]);

  const handleDisableBtn = () => {
    if (userAddress && userAddress !== address) {
      setisDisable(false);
    } else {
      setisDisable(true);
    }
  };

  const updateAddress = (val: string) => {
    setUserAddress(val);
  };

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState(false);

  // BottomSheet snap variables
  const snapPoints = ['85%'];

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

  // useFocusEffect hook runs every time page navigates/renders
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
    }, [isOpen, dispatch]),
  );

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

  const handleOnPress = async () => {
    try {
      const result = await updateUserDetails({
        address: userAddress,
      });
      if (result) {
        dispatch(setAddress(userAddress));
        navigation.navigate('UpdateConfirmDetails');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {}
      <Box flex={1}>
        {isOpen ? (
          <Box style={[{ backgroundColor: '#000000' }, styles.container]} />
        ) : (
          <>
            <Box
              style={[
                { backgroundColor: COLORS.background.primary },
                styles.container,
              ]}>
              <Box mt={20} flex={1}>
                <Box mb={25}>
                  <Text style={styles.titleText}>Update your address</Text>
                </Box>
                <AutoComplete
                  updateAddress={updateAddress}
                  setUserAddress={setUserAddress}
                  // setUserAddressBs={setUserAddressBs}
                  // userAddressBs={userAddressBs}
                  userAddress={userAddress}>
                  <Box flex={20}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSnapPress(1);
                        dispatch(setIsBottomSheet(true));
                        dispatch(setAddress(''));
                      }}>
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <Text style={styles.titleAddress}>
                          I can’t find my address
                        </Text>
                        <Image source={assets.ArrowRight} />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </AutoComplete>
              </Box>
              <Box style={styles.continueBtn}>
                <AbstractButton disabled={isDisable} onPress={handleOnPress}>
                  Save
                </AbstractButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
      {/* Bottom Sheet */}
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => handleClosePress()}
          backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
          <BottomSheetView>
            <AddressBottomSheet
              route={route}
              navigation={navigation}
              setUserAddress={setUserAddress}
              data={address}
              handleClosePress={handleClosePress}
            />
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
    paddingLeft: 20,
    paddingRight: 20,
  },

  titleText: {
    width: 300,
    top: 16,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    color: COLORS.black,
  },
  textInput: {
    fontFamily: FONTS.MerriweatherRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#00000010',
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  renderBox: {
    paddingVertical: '2%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    fontFamily: FONTS.MerriweatherRegular,
    color: '#333333',
    fontSize: 13,
  },
  item: {
    borderColor: '1px solid rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  titleAddress: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 21,
    color: '#1A6A73',
    paddingVertical: '3%',
  },
});

export default UpdateAddress;
