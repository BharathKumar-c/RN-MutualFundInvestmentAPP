import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions, Image } from 'react-native';
import { Box, AbstractButton, KeyboardAvoidingWrapper } from '../../components';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import ImagePicker from 'react-native-image-crop-picker';
import { useAppDispatch } from '../../state';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { setDocumentPhoto } from '../../state/onboarding/StepThree';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const IsYourDocumentReadable = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { documentPhoto } = useSelector(
    (state: RootState) => state.onboardingStepThree,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (documentPhoto.url === '') {
      handleTakePhoto();
    }
    // dispatch(setStatusbarColor(COLORS.background.primary));
    // dispatch(setBarStyle('dark-content'));
  }, []);

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
      dispatch(setDocumentPhoto(image));
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        <Box flex={1} width={'100%'}>
          <Box>
            <Box alignItems="center" mt={10} mb={10} width="100%">
              {documentPhoto.url ? (
                <Image style={styles.img} source={{ uri: documentPhoto.url }} />
              ) : null}
            </Box>
            <Box mt={20}>
              <Text style={styles.titleText}>Is your document readable?</Text>
            </Box>
            <Box mt={10}>
              <Text style={styles.text}>
                Make sure all the text in your ID document is readable with no
                glare.
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
              navigation.navigate('ThirdStepComplete');
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
    width: 165,
    height: 225,
  },
});

export default IsYourDocumentReadable;
