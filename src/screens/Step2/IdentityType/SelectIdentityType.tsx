import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  View,
  FlatList,
  Platform,
} from 'react-native';
import { Box, AbstractButton } from '../../../components';
import { COLORS, assets, FONTS, SIZES } from '../../../constants';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NationalityBottomSheetModal from './NationalityBottomSheetModal';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { RootState, useAppDispatch } from '../../../state';
import { useSelector } from 'react-redux';
import { setIdentityType } from '../../../state/onboarding/StepTwo/index';
import {
  setBarStyle,
  setIsBottomSheet,
  setIsEnableHeader,
  setStatusbarColor,
  setTranslucent,
} from '../../../state/generalUtil';
import { useBackHandler } from '@react-native-community/hooks';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { getOnfidoSDKToken } from '../../../service/OnfidoService';
import PermissionService from '../../../service/PermissionService';

const Item = ({ item, onPress, backgroundColor, textColor, icon }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* <Image source={icon} /> */}
    <View style={[styles.display]}>
      <Image source={icon} />
      <Text style={[styles.title, textColor]}>{item.title}</Text>
    </View>
    <Image style={styles.image} source={item.image} />
  </TouchableOpacity>
);

const SelectIdentityType = ({
  route: route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const [identity, setIdentity] = useState('Irish');
  const { PERMISSIONS_TYPE, checkPermissions, requestPermisssions } =
    PermissionService;
  const { cameraPermissionStatus } = useSelector(
    (state: RootState) => state.permission,
  );

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
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (sheetRef.current === null) {
      dispatch(setIsBottomSheet(false));
    }
  }, [sheetRef.current]);

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === identityType ? '#EDEDE7' : '#EDEDE7';
    const color = item.id === identityType ? '#333333' : '#333333';

    const icon =
      item.id === identityType
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;

    return (
      <Item
        item={item}
        onPress={() => {
          dispatch(setIdentityType(item.id));
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
        icon={icon}
      />
    );
  };

  // Redux state management
  const dispatch = useAppDispatch();
  const { nationality, identityType, identityTypeList, allNationalityList } =
    useSelector((state: RootState) => state.onboardingStepTwo);

  // Search functionality
  const searchNationality = (nameKey: number, myArray: any) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
        return myArray[i];
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
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
    }, [isOpen, dispatch]),
  );

  useEffect(() => {
    let identityName = searchNationality(nationality, allNationalityList);
    setIdentity(identityName ? identityName.name : identity);
  }, [nationality]);

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
    getOnfidoSDKToken();
  }, []);

  const handleContinue = async () => {
    const pmtStatus = await checkPermissions(PERMISSIONS_TYPE.camera);
    const id = route?.params?.doItLaterFlag;

    if (pmtStatus === 'granted') {
      if (id) {
        navigation.navigate('PrepareYourId', { doItLaterFlag: id });
      } else {
        navigation.navigate('PrepareYourId');
      }
    } else if (pmtStatus === 'denied') {
      if (cameraPermissionStatus === 'denied') {
        if (id) {
          navigation.navigate('CameraAccessDenied', { doItLaterFlag: id });
        } else {
          navigation.navigate('CameraAccessDenied');
        }
      } else {
        if (id) {
          navigation.navigate('CameraAccessIsRequired', { doItLaterFlag: id });
        } else {
          navigation.navigate('CameraAccessIsRequired');
        }
      }
    }
  };

  return (
    <>
      {isOpen ? (
        <Box style={[{ backgroundColor: '#000000' }, styles.container]} />
      ) : (
        <>
          <Box style={styles.container}>
            <Box pl={25}>
              <Box pt={60} flexDirection={'column'}>
                <Text style={styles.titleText}>Select identity type</Text>
                <Box pt={25} width="100%">
                  <Box width="90%">
                    <Text style={styles.label}>NATIONALITY</Text>
                    <TouchableOpacity
                      onPress={() => {
                        // setListName('citizenship');
                        handleSnapPress(1);
                        dispatch(setIsBottomSheet(true));
                      }}>
                      <Box style={styles.selectButton}>
                        <Text style={styles.textInput}>{identity}</Text>
                        <Image
                          style={styles.imageStyle}
                          source={assets.ArrowDown}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>

                <Box pt={35} width="100%">
                  <Text style={styles.label}>IDENTITY TYPE</Text>
                </Box>
              </Box>
            </Box>

            <SafeAreaView style={styles.flatList}>
              <FlatList
                data={identityTypeList}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                extraData={identityType}
              />
            </SafeAreaView>

            <Box style={styles.continueBtn}>
              <AbstractButton onPress={handleContinue}>Continue</AbstractButton>
            </Box>
          </Box>
        </>
      )}
      {/* Bottom Sheet */}
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => handleClosePress()}
          backgroundStyle={{ backgroundColor: COLORS.background.primary }}>
          <BottomSheetView>
            <NationalityBottomSheetModal
              route={route}
              navigation={navigation}
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
        : SIZES.screen_height / 1.24,
  },
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
    lineHeight: 28,
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 1,
    color: '#747474',
  },
  section: {
    flexDirection: 'row',
    top: 10,
  },
  Arrowdown: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  checkbox: {
    color: '#333333',
    fontFamily: FONTS.Merriweather,
    fontSize: 14,
    lineHeight: 24,
  },
  box: {
    borderColor: 'transparent',
    height: 84,
  },
  item: {
    padding: 15,
    height: 84,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.Merriweather,
    lineHeight: 24,
    color: '#333333',
    justifyContent: 'space-between',
    marginLeft: '7%',
  },
  flatList: {
    paddingHorizontal: 10,
  },
  image: {
    alignItems: 'flex-end',
    width: 64,
    height: 56,
  },
  display: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  imageStyle: {
    position: 'absolute',
    left: '92%',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 1,
    paddingTop: 15,
    paddingBottom: 10,
    borderColor: '#e5e5e5',
  },
});

export default SelectIdentityType;
