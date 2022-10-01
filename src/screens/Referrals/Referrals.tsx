import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { Box } from '../../components';
import { COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { RootState, useAppDispatch } from '../../state';
import {
  setBarStyle,
  setIsEnableHeader,
  setStatusbarColor,
} from '../../state/generalUtil';
import ReferralBottomSheet from './ReferralBottomSheet';

const Referrals = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // BottomSheet Hooks
  const sheetRef = useRef<BottomSheet>(null);

  // BottomSheet snap variables
  const snapPoints = ['27%'];

  // BottomSheet Callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isOpen) {
        dispatch(setIsEnableHeader(false));
        dispatch(setStatusbarColor(COLORS.black));
        dispatch(setBarStyle('light-content'));
      } else {
        dispatch(setIsEnableHeader(true));
        dispatch(setStatusbarColor(COLORS.background.primary));
        dispatch(setBarStyle('dark-content'));
      }
    }, [dispatch, isOpen]),
  );

  const DotLine = () => {
    return (
      <Box style={styles.dotLineContainer}>
        <Box style={styles.dotLineStyle} />
      </Box>
    );
  };

  const CopyToClipBoard = async () => {
    Clipboard.setString('https://mashmallow.com/e/refsdfsb');
    ToastAndroid.showWithGravity(
      'Copy to link',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
  };

  return (
    <>
      {isOpen ? (
        <Box style={styles.containerOpacity}>
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setIsOpen(false)}
            backgroundStyle={styles.bottomSheetContainer}>
            <BottomSheetView>
              <ReferralBottomSheet
                route={route}
                navigation={navigation}
                handleClosePress={handleClosePress}
              />
            </BottomSheetView>
          </BottomSheet>
        </Box>
      ) : (
        <Box style={styles.container}>
          <ScrollView>
            {/* Heading Title */}
            <Box style={styles.titleWrapper}>
              <Text style={styles.titleText}>Refer a friend</Text>
              <Text style={styles.subTitleText}>
                And earn{' '}
                <Text style={{ fontFamily: FONTS.RobotoRegular }}>€5</Text>
              </Text>
              <Box style={styles.helpIconWrapper}>
                <TouchableOpacity onPress={() => {}}>
                  <Icon
                    name="information-outline"
                    size={22}
                    color={'#1A6A73'}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.helpText}>How it works</Text>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box height={30} />
            {/* refferals steps */}
            <Box flex={1.5} paddingHorizontal={20}>
              <DotLine />
              <Box style={styles.refferalStepList}>
                <Box style={styles.circle}>
                  <Icon
                    name="link-variant-plus"
                    color={COLORS.green}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ fontSize: 23 }}
                  />
                </Box>
                <TouchableOpacity onPress={() => {}}>
                  <Box style={styles.stepTitleWrapper}>
                    <Text style={styles.stepTitleText}>
                      Invite your friends to install{'\n'}the app through the
                      link
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
              <Box height={35} />
              <Box style={styles.refferalStepList}>
                <Box style={styles.circle}>
                  <Icon
                    name="piggy-bank-outline"
                    color={COLORS.green}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ fontSize: 23 }}
                  />
                </Box>
                <TouchableOpacity onPress={() => {}}>
                  <Box style={styles.stepTitleWrapper}>
                    <Text style={styles.stepTitleText}>
                      They make their first{'\n'}investment
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
              <Box height={35} />
              <Box style={styles.refferalStepList}>
                <Box style={styles.circle}>
                  <Icon
                    name="cash-plus"
                    color={COLORS.green}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ fontSize: 23 }}
                  />
                </Box>
                <TouchableOpacity onPress={() => {}}>
                  <Box style={styles.stepTitleWrapper}>
                    <Text style={styles.stepTitleText}>
                      You get{' '}
                      <Text style={{ fontFamily: FONTS.RobotoBlack }}>€ 5</Text>{' '}
                      in your pot
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box height={35} />
            {/* referrals link */}
            <Box flex={0.7} paddingHorizontal={20}>
              <Box style={styles.refferalWrapper}>
                <Text style={styles.refferalLink}>
                  https://mashmallow.com/e/refsdfsb
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    CopyToClipBoard();
                  }}>
                  <Text style={styles.refferalLinkBtn}>Copy</Text>
                  {/* <Icon name="content-copy" style={styles.refferalLinkBtn} /> */}
                </TouchableOpacity>
              </Box>
              <TouchableOpacity onPress={() => setIsOpen(true)}>
                <Box style={styles.refferFriendWrapper}>
                  <Icon
                    name="export-variant"
                    size={22}
                    style={styles.exportIcon}
                    color={COLORS.background.primayGreen}
                  />
                  <Box style={styles.referNowWrapper}>
                    <Text style={styles.referFriendBtn}>Refer now</Text>
                  </Box>
                </Box>
              </TouchableOpacity>
            </Box>
            <Box height={30} />
          </ScrollView>
        </Box>
      )}
    </>
  );
};

export default Referrals;

const styles = StyleSheet.create({
  referNowWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  exportIcon: {
    position: 'absolute',
    left: 20,
    color: COLORS.background.primayGreen,
    size: 22,
  },
  stepTitleWrapper: { justifyContent: 'center', marginLeft: 10 },
  infoIcon: { opacity: 0.8, color: '#1A6A73' },
  bottomSheetContainer: {
    backgroundColor: COLORS.background.primary,
    borderColor: COLORS.gray,
    borderWidth: 2,
  },
  dotLineStyle: {
    top: '10%',
    height: '80%',
    borderStyle: 'dotted',
    borderLeftWidth: 5,
    opacity: 0.5,
  },
  dotLineContainer: {
    left: 20,
    width: 44,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  containerOpacity: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 13,
    lineHeight: 15,
    color: COLORS.black,
    paddingVertical: 2,
    marginLeft: 8,
    opacity: 0.5,
  },
  imgInnerCircle: {
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  navItemText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 15,
    color: COLORS.green,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomNavContainer: {
    backgroundColor: COLORS.background.primayGreen,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    width: '97%',
    bottom: 40,
    height: 60,
    elevation: 4,
    shadowColor: '#52006A',
    alignSelf: 'center',
  },
  imageText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.32,
    color: COLORS.green,
    padding: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
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
  cardDescription: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  cardImage: {
    width: 320,
    height: 142,
    backgroundColor: '#CCDDC1',
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
  },
  card: {
    width: 320,
    height: 142,
    backgroundColor: '#EDEAE7',
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginRight: 9,
  },
  cardOuterContainer: {
    flex: 1,
    width: SIZES.screen_width,
    paddingLeft: 20,
  },
  cardContainer: {
    flex: 1,
    width: SIZES.screen_width,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 50,
    paddingRight: 20,
  },
  referFriendBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 15,
    color: COLORS.background.primayGreen,
  },
  refferFriendWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding * 1.2,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.green,
    marginTop: 15,
  },
  refferalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: SIZES.screen_width * 0.9,
    paddingVertical: SIZES.padding * 1.2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.background.primayGreen,
    elevation: 4,
    shadowColor: '#52006A',
  },
  refferalLink: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 15,
    color: COLORS.green,
  },
  refferalLinkBtn: {
    fontFamily: FONTS.MerriweatherBlack,
    fontSize: 14,
    lineHeight: 15,
    color: COLORS.green,
  },
  inactiveCircle: {
    fontFamily: FONTS.RobotoBold,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.32,
    color: COLORS.black,
  },
  activeCircle: {
    fontFamily: FONTS.RobotoBold,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.32,
    color: COLORS.green,
  },
  stepTitleText: {
    fontFamily: FONTS.MerriweatherBlack,
    fontSize: 13,
    lineHeight: 20,
    color: '#1A6A73',
    marginLeft: 8,
    paddingVertical: 5,
  },
  stepSubTitleText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 13,
    lineHeight: 15,
    color: COLORS.black,
    paddingVertical: 5,
    marginLeft: 8,
    opacity: 0.5,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: COLORS.background.primayGreen,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#52006A',
  },
  refferalStepList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    color: COLORS.black,
    minHeight: SIZES.screen_height,
  },
  titleWrapper: {
    flex: 0.7,
    paddingHorizontal: 20,
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    paddingTop: 20,
    lineHeight: 30,
    letterSpacing: -0.32,
    color: COLORS.black,
  },
  subTitleText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black,
    paddingVertical: 5,
  },
  helpIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  helpText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 18,
    color: '#1A6A73',
    marginLeft: 8,
    opacity: 0.8,
  },
});
