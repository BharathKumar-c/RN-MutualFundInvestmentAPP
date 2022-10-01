import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  Pressable,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { Box } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { RootState, useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ProfilePhotoBottomSheet from './ProfilePhotoBottomSheet';
import { setProfilePhoto } from '../../state/onboarding';
import ImagePicker from 'react-native-image-crop-picker';
import { CustomCamera } from '../../components/CameraScreen';
import {
  createUserOnboarding,
  getUserDataById,
  uploadProfileImage,
} from '../../service/OnboardingService';
import UserAvatar from 'react-native-user-avatar';
import { InfoPopUp } from '../../components/PopUpModal';
import CameraInfoPopup from './CameraInfoPopup';
import PermissionService from '../../service/PermissionService';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import { useBackHandler } from '@react-native-community/hooks';

const UserProfile = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { firstName, lastName, profilePhoto } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [isDenyModalVisible, setIsDenyModalVisible] = useState(false);
  const [PermissionStatus, setPermissionStatus] = useState('');
  const { PERMISSIONS_TYPE, checkPermissions, requestPermisssions } =
    PermissionService;

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // BottomSheet snap variables
  const snapPoints = ['30%'];

  // BottomSheet Callbacks
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
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
            console.log({ PermissionStatus, resStatus });
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

  const handleSelectPhoto = async () => {
    setIsOpen(false);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      // cropping: true,
      mediaType: 'photo',
    }).then(async image => {
      dispatch(setProfilePhoto(image.path));
      const userData: any = await getUserDataById();
      if (userData?.basicInfo?.userId) {
        console.log({ image, userData });
        await uploadProfileImage(image.path, userData?.basicInfo?.userId);
        createUserOnboarding(parseInt(userData?.basicInfo?.userId), 10);
      }
    });
  };

  const handleCloseModal = useCallback(() => {
    setIsDenyModalVisible(false);
  }, []);

  const handleCloseCam = async (image?: any) => {
    if (image) {
      dispatch(setProfilePhoto(image.uri));
      const userData: any = await getUserDataById();
      if (userData?.basicInfo?.userId) {
        await uploadProfileImage(image.uri, userData?.basicInfo?.userId);
        createUserOnboarding(parseInt(userData?.basicInfo?.userId), 10);
      }
    }
    setOpenCamera(false);
    setIsOpen(false);
  };

  const otherList: any = [
    {
      name: 'Dashboard',
      icon: assets.BarGraph,
      navigateTo: 'Home',
    },
    {
      name: 'Transactions',
      icon: assets.PigBank,
      navigateTo: 'Transactions',
    },
    {
      name: 'Payments',
      icon: assets.BarGraph,
      navigateTo: 'Payments',
    },
  ];

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
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box style={styles.innerContainer}>
                {/* PROFILE IMAGE */}
                <Box style={{ flex: 2 }}>
                  {/* Image */}
                  <Box style={styles.imgContainer}>
                    <Box style={styles.imgOuterCircle}>
                      <TouchableOpacity
                        onPress={() => {
                          handleSnapPress(1);
                        }}>
                        {profilePhoto.url ? (
                          <Image
                            source={{ uri: profilePhoto.url }}
                            style={styles.imgInnerCircle}
                          />
                        ) : (
                          <UserAvatar
                            bgColor={COLORS.green}
                            size={50}
                            style={styles.imgInnerCircle}
                            name={firstName ? `${firstName} ${lastName}` : ''}
                          />
                        )}
                      </TouchableOpacity>
                      <Box style={styles.imageWrapper}>
                        <Pressable
                          style={styles.imgSemiCircle}
                          onPress={() => {
                            handleSnapPress(1);
                          }}>
                          <Image
                            source={assets.Pencil}
                            style={{ width: 15.83, height: 16 }}
                          />
                        </Pressable>
                      </Box>
                    </Box>
                  </Box>
                  <Box style={styles.userNameWrapper}>
                    <Text
                      style={
                        styles.userName
                      }>{`${firstName} ${lastName}`}</Text>
                    <Text style={styles.userType}>Basic Member</Text>
                    <Box style={styles.userStatusBtn}>
                      <Text style={styles.userStatus}>UNVERIFIED</Text>
                    </Box>
                  </Box>
                </Box>

                {/* REFERRAL */}
                <Box style={{ flex: 3, paddingVertical: SIZES.padding * 2 }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Referrals');
                    }}>
                    <Box
                      style={{
                        width: SIZES.screen_width * 0.9,
                        paddingTop: SIZES.padding * 2,
                        borderRadius: SIZES.radius - 12,
                        backgroundColor: '#B5DFC8',
                      }}>
                      <Box
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <Box
                          style={{
                            paddingBottom: SIZES.padding * 2,
                          }}>
                          <Text
                            style={{
                              fontFamily: FONTS.MerriweatherBold,
                              fontSize: 10,
                              lineHeight: 18,
                              letterSpacing: 0.16,
                              textTransform: 'uppercase',
                              color: '#145650',
                              marginBottom: 4,
                            }}>
                            REFERRAL
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONTS.PlayfairDisplayBold,
                              fontSize: 16,
                              lineHeight: 20,
                              color: COLORS.black,
                            }}>
                            Invite friends and{'\n'}earn{' '}
                            <Text style={{ fontFamily: FONTS.RobotoMedium }}>
                              € 5
                            </Text>
                          </Text>
                        </Box>
                        <Box>
                          <Image source={assets.RaiseUpArrowSmall} />
                        </Box>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                </Box>

                {/* MANAGE ACCOUNT */}
                <Box
                  style={{
                    flex: 4,
                    paddingVertical: SIZES.padding,
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.PlayfairDisplayBold,
                      fontSize: 16,
                      lineHeight: 20,
                      color: COLORS.black,
                    }}>
                    Manage account
                  </Text>
                  <Box style={{ flex: 1 }}>
                    <Box
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('UpdateConfirmDetails');
                        }}>
                        <Box
                          style={{
                            width: SIZES.screen_width * 0.42,
                            padding: SIZES.padding * 2,
                            borderRadius: SIZES.radius - 12,
                            backgroundColor: '#EDEAE7',
                          }}>
                          <Image source={assets.RevienIcon} />
                          <Text style={styles.cardText}>Personal details</Text>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {}}>
                        <Box
                          style={{
                            width: SIZES.screen_width * 0.42,
                            padding: SIZES.padding * 2,
                            borderRadius: SIZES.radius - 12,
                            backgroundColor: '#EDEAE7',
                          }}>
                          <Image source={assets.PigyIcon} />
                          <Text style={styles.cardText}>Account</Text>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity onPress={() => {}}>
                        <Box
                          style={{
                            width: SIZES.screen_width * 0.42,
                            padding: SIZES.padding * 2,
                            borderRadius: SIZES.radius - 12,
                            backgroundColor: '#EDEAE7',
                          }}>
                          <Image source={assets.GiftIcon} />
                          <Text style={styles.cardText}>Documents</Text>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {}}>
                        <Box
                          style={{
                            width: SIZES.screen_width * 0.42,
                            padding: SIZES.padding * 2,
                            borderRadius: SIZES.radius - 12,
                            backgroundColor: '#EDEAE7',
                          }}>
                          <Image source={assets.SettingIcon} />
                          <Text style={styles.cardText}>Settings</Text>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                </Box>

                {/* OTHERS */}
                <Box style={{ flex: 5, paddingVertical: SIZES.padding * 2 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.PlayfairDisplayBold,
                      fontSize: 16,
                      lineHeight: 20,
                      color: COLORS.black,
                    }}>
                    Others
                  </Text>
                  <Box marginBottom={50}>
                    {otherList?.map((item: any, index: number) => {
                      return (
                        <TouchableOpacity
                          onPress={() => navigation.navigate(item.navigateTo)}
                          key={index}>
                          <Box
                            style={{
                              flexDirection: 'row',
                              paddingVertical: SIZES.padding * 2,
                              alignItems: 'center',
                            }}>
                            <Image source={item.icon} />
                            <Text
                              style={{
                                fontFamily: FONTS.MerriweatherRegular,
                                fontSize: 14,
                                lineHeight: 24,
                                letterSpacing: -0.16,
                                color: '#333333',
                                marginLeft: 15,
                              }}>
                              {item.name}
                            </Text>
                          </Box>
                        </TouchableOpacity>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </ScrollView>
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
  othersContainer: {
    backgroundColor: 'green',
    paddingBottom: 50,
  },
  container: {
    color: COLORS.black,
    minHeight: SIZES.screen_height,
  },
  containerOpacity: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  imgOuterCircle: {
    borderRadius: 80,
    width: 160,
    height: 160,
    borderColor: '#78B894',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgInnerCircle: {
    borderRadius: 117.5,
    width: 135,
    height: 135,
    margin: 5,
  },
  imageWrapper: {
    position: 'absolute',
    width: 160, // half of the image width
    height: 160,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  imgSemiCircle: {
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 111,
    width: 135,
    height: 135,
    borderRadius: 117.5, // half of the image width
    backgroundColor: COLORS.background.primary,
  },
  userNameWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: -0.32,
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  userType: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  userStatusBtn: {
    marginVertical: 10,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  userStatus: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: COLORS.white,
  },
  cardText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.black,
    paddingTop: 8,
  },
});

export default UserProfile;
