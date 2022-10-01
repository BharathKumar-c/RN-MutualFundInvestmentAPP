import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { AbstractButton, Box } from '../../components';
import { COLORS, FONTS, assets, SIZES } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import {
  hideSafeAreaView,
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
  showSafeAreaView,
} from '../../state/generalUtil';
import { useAppDispatch } from '../../state';

const CAPTURE_BUTTON_SIZE = 50;
const transparentColor = '#00000090';
interface Props {
  navigation: any;
  route: any;
}

function DocumentScanner(props: Props) {
  const { navigation, route } = props;
  const devices = useCameraDevices();
  const dispatch = useAppDispatch();
  let device = devices.back;
  let camera = useRef<Camera>(null);
  const [isActive, setIsActive] = useState(false);
  const doItLaterFlag: any = route?.params?.doItLaterFlag;

  useFocusEffect(() => {
    device = devices.back;
    setIsActive(true);
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(hideSafeAreaView());

      return () => {
        dispatch(showSafeAreaView());
      };
    }, [dispatch]),
  );

  useEffect(() => {
    dispatch(setStatusbarColor('#000000'));
    dispatch(setBarStyle('light-content'));
    dispatch(setTranslucent(false));
  }, [dispatch]);

  if (device == null) {
    return (
      <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No camera available</Text>
        <AbstractButton
          buttonStyle={styles.backBtn}
          onPress={() => {
            navigation?.goBack();
          }}
          textStyle={styles.nextBtn}>
          Back
        </AbstractButton>
      </Box>
    );
  }

  const takePhoto = async () => {
    if (camera?.current) {
      const photo = await camera?.current.takePhoto();
      navigation.navigate('DisplayDocument', { photo, doItLaterFlag });
      setIsActive(false);
    }
  };

  return (
    <Box style={styles.container}>
      <Camera
        ref={camera}
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
        photo
      />
      <Box style={styles.captureContainer}>
        <Box style={styles.top}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={assets.BackWhiteIcon} style={styles.imgStyle} />
          </TouchableOpacity>
        </Box>

        <Box style={styles.bottom}>
          <Box p={10}>
            <Text style={styles.text}>
              Position the photo page of your document in the frame
            </Text>
          </Box>

          <TouchableOpacity style={styles.button} onPress={takePhoto} />
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 14,
  },
  backBtn: { marginTop: '4%', width: '20%', height: '5%' },
  container: {
    flex: 1,
  },
  top: {
    backgroundColor: transparentColor,
    height:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 9.8
        : SIZES.screen_height / 13,
    justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    paddingBottom: Platform.OS === 'ios' ? '4%' : 0,
  },
  captureContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderColor: transparentColor,
  },
  bottom: {
    height:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 5.5
        : SIZES.screen_height / 6.5,
    backgroundColor: transparentColor,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 18,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: 4,
    borderColor: 'white',
  },
  text: {
    fontFamily: FONTS.Merriweather,
    fontSize: 16,
    letterSpacing: 0,
    color: COLORS.white,
    textAlign: 'center',
  },
  imgStyle: {
    width: 22,
    height: 22,
  },
});

export default DocumentScanner;
