import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  StatusBar,
  Linking,
  Platform,
  AppState,
} from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { useFocusEffect } from '@react-navigation/native';
import PermissionService from '../../service/PermissionService';
import { useBackHandler } from '@react-native-community/hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CameraAccessDeniedDocx = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { checkMultiplePermission, PERMISSIONS_TYPE } = PermissionService;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
    }, []),
  );

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, [navigation]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkPermissions();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermissions = () => {
    checkMultiplePermission([
      PERMISSIONS_TYPE.camera,
      // PERMISSIONS_TYPE.storage,
    ]).then(result => {
      const camAccess = result[`${Platform.OS}.permission.CAMERA`];
      if (camAccess === 'granted') {
        navigation.navigate('PrepareYourDocument');
      }
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box flex={1} width={'100%'}>
          <Box pt={70}>
            <Text style={styles.titleText}>
              Access denied. We can’t verify you without your camera
            </Text>

            <Box alignItems="center" mt={50} mb={20} width="100%">
              <Image source={assets.ErrorAlert} />
            </Box>

            <Box alignItems="flex-start" flexDirection="column" mr={80}>
              <Box flexDirection="row" alignItems="center">
                <Box style={styles.circleCount}>
                  <Text style={styles.circleText}>01</Text>
                </Box>
                <Text style={styles.text}>
                  You can recover camera access through your device settings
                </Text>
              </Box>
              <Box style={styles.strikeLine} ml={30} />
              <Box flexDirection="row" alignItems="center">
                <Box style={styles.circleCount}>
                  <Text style={styles.circleText}>02</Text>
                </Box>
                <Text style={styles.text}>
                  Go to app settings and enable camera access for this app
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          mb={SCREEN_HEIGHT / 25}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%">
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => Linking.openSettings()}>
            Enable in settings
          </AbstractButton>
          <View style={{ paddingTop: '5%' }}>
            <Image source={assets.OnfidoIcon} />
          </View>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default CameraAccessDeniedDocx;
