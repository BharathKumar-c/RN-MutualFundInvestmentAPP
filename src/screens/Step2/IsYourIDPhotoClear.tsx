import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { AbstractButton, Box, KeyboardAvoidingWrapper } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { setIdPhoto } from '../../state/onboarding/StepTwo';
import { RootState } from '../../state/rootReducer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const IsYourPhotoReadableAndClear = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const { idPhoto, selfiePhoto } = useSelector(
    (state: RootState) => state.onboardingStepTwo,
  );

  useEffect(() => {
    handleTakePhoto();
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

  // Camara functionality.
  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeBase64: true,
      // cropping: true,
    }).then(async image => {
      console.log(image);
      dispatch(setIdPhoto(image));
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
            <Box alignItems="center" mt={70} mb={10} width="100%">
              {idPhoto.url ? (
                <Image style={styles.img} source={{ uri: idPhoto.url }} />
              ) : (
                <Image source={assets.IsYourIDPhotoClear} />
              )}
            </Box>
            <Box mt={20}>
              <Text style={styles.titleText}>
                Is your photo readable and clear?
              </Text>
            </Box>
            <Box mt={10}>
              <Text style={styles.text}>
                Make sure your ID document is physically present and that all
                text is readable with no glare
              </Text>
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
            onPress={() => {
              navigation.navigate('TakeSelfie');
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
    width: 300,
    height: 199,
    borderRadius: 20,
  },
});

export default IsYourPhotoReadableAndClear;
