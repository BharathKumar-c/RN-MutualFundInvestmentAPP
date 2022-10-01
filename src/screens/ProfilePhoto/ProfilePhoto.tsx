import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { Box, AbstractButton } from '../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useAppDispatch } from '../../state/index';
import { setProfilePhoto, setUserId } from '../../state/onboarding';
import { setIsBottomSheet, setIsEnableHeader } from '../../state/generalUtil';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import ProfilePhotoBottomSheet from './ProfilePhotoBottomSheet';
import { useBackHandler, useDimensions } from '@react-native-community/hooks';
import {
  addDoitLater,
  createUserOnboarding,
  getDoitLater,
  getUserDataById,
  uploadProfileImage,
} from '../../service/OnboardingService';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { CustomCamera } from '../../components/CameraScreen';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ApiUtil from '../../util/ApiUtil';
import { CommonActions } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import PermissionService from '../../service/PermissionService';
import { InfoPopUp } from '../../components/PopUpModal';
import CameraInfoPopup from './CameraInfoPopup';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import style from '../../components/CustomInput/style';

const ProfilePhoto = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { profilePhoto, userId } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const { PERMISSIONS_TYPE, checkPermissions, requestPermisssions } =
    PermissionService;
  const dispatch = useAppDispatch();
  const [isSelected, setIsSelected] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [isDenyModalVisible, setIsDenyModalVisible] = useState(false);
  const [PermissionStatus, setPermissionStatus] = useState('');
  const { screen, window } = useDimensions();
  // var ImagePicker = NativeModules.ImageCropPicker;

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Keep Tracking bootom sheet is open or not.
  const [isOpen, setIsOpen] = useState(false);

  // BottomSheet snap variables
  // const snapPoints = useMemo(() => ['30%'], []);

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsDenyModalVisible(false);
  }, []);

  const UpdateProfilePhoto = async () => {
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      await uploadProfileImage(profilePhoto.url, userData?.basicInfo?.userId);
      dispatch(setUserId(userData.basicInfo?.userId));
    }
  };

  // BottomSheet Callbacks
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  const handleTakePhoto = async () => {
    setIsOpen(false);
    const pmtStatus = await checkPermissions(PERMISSIONS_TYPE.camera);
    if (pmtStatus === 'granted') {
      setPermissionStatus('granted');
      setOpenCamera(true);
    } else {
      if (!PermissionStatus) {
        await requestPermisssions(PERMISSIONS_TYPE.camera)
          .then(resStatus => {
            if (resStatus === 'denied') {
              setPermissionStatus('denied');
            } else if (resStatus === 'granted') {
              setPermissionStatus('granted');
              setOpenCamera(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (PermissionStatus === 'denied') {
        setIsDenyModalVisible(true);
      }
    }
  };

  const handleCloseCam = (image?: any) => {
    if (image) {
      dispatch(setProfilePhoto(image.uri));
    }
    setOpenCamera(false);
    setIsOpen(false);
  };

  const handleSelectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
    }).then(async image => {
      setIsSelected(true);
      dispatch(setProfilePhoto(image.path));
    });
  };

  const handleContinue = () => {
    if (userId) {
      UpdateProfilePhoto();
      createUserOnboarding(userId, 10);
    }
    if (route?.params?.doItLaterFlag === 10) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.navigate('ConfirmDetails');
    }
  };

  const doItLater = async () => {
    dispatch(setProfilePhoto(''));
    if (route?.params?.doItLaterFlag === 10) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ThingsToDoScreen' }],
        }),
      );
    } else {
      navigation.navigate('ConfirmDetails');
    }
  };

  useBackHandler(
    useCallback(() => {
      if (isOpen) {
        setIsOpen(false);
      } else if (isDenyModalVisible) {
        setIsDenyModalVisible(false);
      } else {
        navigation.goBack();
      }
      return true;
    }, [isOpen]),
  );

  return (
    <>
      {openCamera ? (
        <Box width={SIZES.screen_width} height={SIZES.screen_height}>
          <CustomCamera type={'front'} close={handleCloseCam} />
        </Box>
      ) : (
        <>
          <Box style={styles.container}>
            <InfoPopUp
              visible={isDenyModalVisible}
              handleCloseModal={handleCloseModal}>
              {
                <CameraInfoPopup
                  handleSnapPress={handleSnapPress}
                  handleCloseModal={handleCloseModal}
                />
              }
            </InfoPopUp>
            <Box>
              <Box
                pt={145}
                flexDirection={'column'}
                style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  disabled={isOpen}
                  onPress={() => {
                    handleSnapPress(1);
                  }}>
                  <View style={styles.photoView}>
                    {profilePhoto.url ? (
                      <>
                        <Box>
                          <Image
                            source={{ uri: profilePhoto.url }}
                            style={styles.image}
                          />
                        </Box>
                        <Box style={styles.insideImg3}>
                          <Image
                            source={assets.EditPen}
                            style={styles.PlusIconImage}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box style={styles.insideImg1}>
                          <Image
                            source={assets.Smile}
                            style={styles.SmileImage}
                          />
                        </Box>
                        <Box style={styles.insideImg2}>
                          <Image
                            source={assets.PlusIcon}
                            style={styles.PlusIconImage}
                          />
                        </Box>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <Text style={styles.text}>Add profile photo</Text>
                <Text style={styles.text1}>
                  To promote a safe and transparent community, we recommend a
                  clear photo of yourself
                </Text>
              </Box>
            </Box>
          </Box>
          <Box style={styles.continueBtn}>
            <AbstractButton
              disabled={!profilePhoto.url}
              onPress={handleContinue}>
              Continue
            </AbstractButton>
            <TouchableOpacity onPress={doItLater}>
              <Text style={styles.text2}>Do it later</Text>
            </TouchableOpacity>
          </Box>
          {/* Bottom Sheet */}
          <CustomBottomSheet
            openBSheet={isOpen}
            snapPoint={'30%'}
            setSheetState={setIsOpen}
            enablePanDownToClose={false}
            backgroundStyle={styles.backgroundStyle}>
            <ProfilePhotoBottomSheet
              route={route}
              navigation={navigation}
              handleTakePhoto={handleTakePhoto}
              handleSelectPhoto={handleSelectPhoto}
              handleClosePress={handleClosePress}
            />
          </CustomBottomSheet>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: COLORS.background.primary,
    borderColor: COLORS.gray,
    borderWidth: 2,
  },
  iOSBackdrop: {
    backgroundColor: COLORS.black,
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: '#232f34',
    opacity: 0.32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.4
        : SIZES.screen_height / 1.35,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background.primary,
  },
  containerOpacity: {
    flex: 1,
    opacity: 0.5,
    paddingHorizontal: 20,
    // backgroundColor: COLORS.lightGray,
  },
  container1: {
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  SmileImage: {
    width: 65,
    height: 64,
  },
  PlusIconImage: {
    width: 40,
    height: 40,
  },
  text: {
    paddingTop: '10%',
    color: COLORS.black,
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.PlayfairDisplayBold,
    lineHeight: 30,
    alignItems: 'center',
  },
  text1: {
    fontSize: SIZES.font,
    fontFamily: FONTS.MerriweatherRegular,
    lineHeight: 24,
    color: '#2B2928',
    paddingHorizontal: '15%',
    paddingVertical: '4%',
    textAlign: 'center',
  },
  text2: {
    paddingTop: '8%',
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
  photoView: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.white,
    borderRadius: 100,
  },
  insideImg1: {
    top: '30%',
    left: '28%',
  },
  insideImg2: {
    top: '30%',
    left: '70%',
  },
  insideImg3: {
    top: '-30%',
    left: '70%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
});

export default ProfilePhoto;
