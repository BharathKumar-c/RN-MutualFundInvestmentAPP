import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import { AbstractButton, Box, KeyboardAvoidingWrapper } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';

const TakeSelfie = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, [dispatch]);
  return (
    <KeyboardAvoidingWrapper>
      <Box style={styles.container}>
        {/* <StatusBar
          backgroundColor={COLORS.background.primary}
          barStyle="dark-content"
        /> */}
        <Box flex={1} width={'100%'}>
          <Box pt={20}>
            <Box alignItems="center" mt={40} width="100%">
              <Image source={assets.TakeSelfie} style={styles.img} />
            </Box>
            <Text style={styles.titleText}>Take a selfie</Text>
            <Box alignItems="flex-start" flexDirection="column" mt={20} mr={80}>
              <Box flexDirection="row" alignItems="center">
                <Box style={styles.box}>
                  <Image
                    source={assets.TickInTakeSelfie}
                    style={styles.tickIcon}
                  />
                </Box>
                <Box style={styles.box}>
                  <Text style={styles.text}>
                    Face forward and make sure your eyes are clearly visible
                  </Text>
                </Box>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Box style={styles.box}>
                  <Image
                    source={assets.TickInTakeSelfie}
                    style={styles.tickIcon}
                  />
                </Box>
                <Box style={styles.box}>
                  <Text style={styles.text}>
                    Remove your glasses, if necessary
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box style={styles.continueBtn}>
          <AbstractButton
            textStyle={styles.nextBtn}
            onPress={() => {
              navigation.navigate('IsYourProfilePhotoClear');
            }}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </KeyboardAvoidingWrapper>
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
        : SIZES.screen_height / 1.22,
  },
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
    lineHeight: 28,
  },
  box: {
    padding: '5%',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
  },
  img: {
    width: 330,
    height: 240,
  },
  tickIcon: {
    width: 28,
    height: 28,
  },
});

export default TakeSelfie;
