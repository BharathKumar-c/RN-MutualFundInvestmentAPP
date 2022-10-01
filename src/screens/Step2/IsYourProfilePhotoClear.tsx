import React, { useCallback, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../../components';
import { COLORS, assets, FONTS, FONT_WEIGHT, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { useAppDispatch } from '../../state';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { setSelfiePhoto } from '../../state/onboarding/StepTwo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const IsYourProfilePhotoClear = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { selfiePhoto } = useSelector(
    (state: RootState) => state.onboardingStepTwo,
  );

  useEffect(() => {
    if (selfiePhoto?.url === '') {
      handleTakePhoto();
    }
    // dispatch(setStatusbarColor(COLORS.background.primary));
    // dispatch(setBarStyle('dark-content'));
  }, []);

  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
    }, []),
  );

  // Camara functionality.
  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeBase64: true,
      // cropping: true,
    }).then(async image => {
      dispatch(setSelfiePhoto(image));
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        {/* <StatusBar
          backgroundColor={COLORS.background.primary}
          barStyle="dark-content"
        /> */}
        <Box flex={1} width={'100%'}>
          <Box>
            <Box alignItems="center" mt={50} mb={10} width="100%">
              <Box paddingVertical={30} mb={10}>
                {selfiePhoto.url ? (
                  <Image style={styles.img} source={{ uri: selfiePhoto.url }} />
                ) : (
                  <Image
                    style={styles.img}
                    source={assets.IsYourProfilePhotoClear}
                  />
                )}
              </Box>
            </Box>
            <Box mt={20}>
              <Text style={styles.titleText}>Is your photo clear?</Text>
            </Box>
            <Box mt={10}>
              <Text style={styles.text}>
                Make sure your photo is physically present and is clear with no
                glare
              </Text>
            </Box>
          </Box>
        </Box>
        <Box
          mb={SCREEN_HEIGHT / 30}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%">
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => {
              navigation.navigate('SecondStepComplete');
            }}>
            Looks good
          </AbstractButton>

          <View style={{ paddingTop: '5%', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                handleTakePhoto();
              }}>
              <Text style={styles.text1}>Try again</Text>
            </TouchableOpacity>
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
    paddingHorizontal: '15%',
  },
  text: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    color: '#2B2928',
    textAlign: 'center',
    paddingHorizontal: '15%',
    lineHeight: 24,
  },
  text1: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    color: '#2B2928',
    textAlign: 'center',
    lineHeight: 21,
    paddingBottom: '5%',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    transform: [{ scaleY: 1.5 }],
  },
});

export default IsYourProfilePhotoClear;
