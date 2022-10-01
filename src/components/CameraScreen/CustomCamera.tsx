import { useBackHandler } from '@react-native-community/hooks';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableHighlight,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import {
  hideSafeAreaView,
  hideSafeAreaViewBottom,
  setBarStyle,
  setIsEnableHeader,
  setStatusbarColor,
  showSafeAreaView,
} from '../../state/generalUtil';
import AbstractButton from '../AbstractButton';
import Box from '../Box';
import { useAppDispatch } from '../../state/index';
import { MaterialIndicator } from 'react-native-indicators';
import { useFocusEffect } from '@react-navigation/native';

interface cameraProps {
  type: string;
  close: (data?: any) => void;
}

export default function CustomCamera(props: cameraProps) {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const { type, close } = props;
  const [{ cameraRef }, { takePicture }] = useCamera(null);
  const [cameraType, setCameraType] = useState(
    type === 'front'
      ? RNCamera.Constants.Type.front
      : RNCamera.Constants.Type.back,
  );
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);

  const handleCameraSwitch = () => {
    if (cameraType === RNCamera.Constants.Type.front) {
      setCameraType(RNCamera.Constants.Type.back);
    } else {
      setCameraType(RNCamera.Constants.Type.front);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#000000'));
      dispatch(setBarStyle('light-content'));
      dispatch(setIsEnableHeader(false));
      return () => {
        dispatch(setIsEnableHeader(true));
        dispatch(showSafeAreaView());
        dispatch(setStatusbarColor('#F2F2EF'));
        dispatch(setBarStyle('dark-content'));
      };
    }, [dispatch]),
  );

  useLayoutEffect(() => {
    dispatch(hideSafeAreaView());
  }, [dispatch]);

  useBackHandler(
    useCallback(() => {
      close();
      return true;
    }, []),
  );

  const captureHandle = async () => {
    setLoader(true);
    try {
      const options = {
        exif: true,
        quality: 0.5,
        width: 1080,
        // base64: true,
        mirrorImage: true,
        forceUpOrientation: true,
        fixOrientation: true,
        orientation: 'portrait',
      };
      const data = await takePicture(options);
      if (data) {
        setLoader(false);
      }
      close(data);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        type={cameraType}
        ratio={'4:3'}
        style={styles.preview}
        captureAudio={false}
        keepAudioSession={false} // its for IOS
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <Box
          style={{
            width: '100%',
            paddingBottom: 50,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={styles.clsButton}
            onPress={() => {
              close();
            }}>
            <Image source={assets.CloseIcon} style={styles.clsButtonIcon} />
          </TouchableHighlight>
          <TouchableHighlight
            disabled={loader}
            style={[styles.captureButton, loader && styles.disableButtonStyle]}
            onPress={captureHandle}>
            <>
              <Image source={assets.Camera} />
              {loader && (
                <Box style={styles.loader}>
                  <MaterialIndicator color="white" size={50} />
                </Box>
              )}
            </>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.switchButton}
            onPress={handleCameraSwitch}>
            <Image style={styles.switchIcon} source={assets.SwapCameraIcon} />
          </TouchableHighlight>
        </Box>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  disableButtonStyle: {
    opacity: 0.5,
  },
  body: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  captureButton: {
    padding: 20,
    borderRadius: 50,
    borderColor: COLORS.white,
    borderWidth: 5,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.black,
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    opacity: 0.7,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 0,
  },
  switchButton: {
    padding: 5,
    borderRadius: 50,
    borderColor: COLORS.white,
    borderWidth: 4,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.black,
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    opacity: 0.7,
  },
  clsButton: {
    padding: 10,
    borderRadius: 50,
    borderColor: COLORS.white,
    borderWidth: 5,
    color: COLORS.white,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.black,
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    opacity: 0.7,
  },
  clsButtonIcon: {
    tintColor: COLORS.white,
    height: 17,
    width: 17,
  },
  switchIcon: {
    tintColor: COLORS.white,
    height: 25,
    width: 25,
  },
  container: {
    // flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: '5%',
  },
  text: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    color: '#1E1E24',
    textAlign: 'left',
  },
  circleCount: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.black,
    transform: [{ scaleX: 1 }],
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  circleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
    color: COLORS.black,
  },

  strikeLine: {
    height: '15%',
    width: 0,
    borderWidth: 0.7,
    borderColor: '#00000',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    height: 30,
  },
  Image: {
    width: 20,
    height: 20,
  },
});
