import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { openSettings } from 'react-native-permissions';
import { AbstractButton, Box } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
interface cameraProps {
  handleCloseModal: (data?: any) => void;
  handleSnapPress: (data?: any) => void;
}
const CameraInfoPopup = ({
  handleCloseModal,
  handleSnapPress,
}: cameraProps) => {
  return (
    <>
      <Box>
        <Text style={styles.titleText}>Camera access denied!</Text>
        <Box style={styles.imageContainer}>
          <Image source={assets.ErrorAlert} />
        </Box>
        <Box style={styles.contentContainer}>
          <Box flexDirection="row" alignItems="center">
            <Box style={styles.circleCount}>
              <Text style={styles.circleText}>01</Text>
            </Box>
            <Text style={styles.promptText}>
              You can recover camera access through your device settings
            </Text>
          </Box>
          <Box style={styles.strikeLine} ml={26} />
          <Box flexDirection="row" alignItems="center">
            <Box style={styles.circleCount}>
              <Text style={styles.circleText}>02</Text>
            </Box>
            <Text style={styles.promptText}>
              Go to app settings and enable camera access for this app
            </Text>
          </Box>
        </Box>
      </Box>

      <Box style={styles.btnContainer}>
        <AbstractButton
          textStyle={styles.nextBtn}
          onPress={() => {
            openSettings();
            handleSnapPress(1);
            handleCloseModal();
          }}>
          Enable in settings
        </AbstractButton>
      </Box>
    </>
  );
};

export default CameraInfoPopup;

const styles = StyleSheet.create({
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.h2,
    textAlign: 'center',
    lineHeight: 34,
    paddingHorizontal: '5%',
  },
  contentContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 80,
  },
  promptText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body4,
    color: '#1E1E24',
    textAlign: 'left',
  },
  circleCount: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.black,
    transform: [{ scaleX: 1 }],
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  circleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.body3,
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
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: SIZES.font,
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
  imageContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
  },
  Image: {
    width: 20,
    height: 20,
  },
});
