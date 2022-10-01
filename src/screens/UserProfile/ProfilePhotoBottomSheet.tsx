import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box } from '../../components';
import { assets, COLORS, FONTS } from '../../constants';

const ProfilePhotoBottomSheet = ({
  handleTakePhoto,
  handleSelectPhoto,
  handleClosePress,
}: {
  route: any;
  navigation: any;
  handleTakePhoto: () => void;
  handleSelectPhoto: () => void;
  handleClosePress: () => void;
}) => {
  return (
    <Box style={styles.container}>
      <Text style={styles.titleText}>Choose an option</Text>
      <Box
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingVertical: 30,
        }}>
        <Box style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              handleTakePhoto();
              handleClosePress();
            }}>
            <Image source={assets.TakePhoto} />
          </TouchableOpacity>
          <Text style={styles.BtnIconText}>Take photo</Text>
        </Box>
        <Box style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              handleSelectPhoto();
              handleClosePress();
            }}>
            <Image source={assets.SelectPhoto} />
          </TouchableOpacity>
          <Text style={styles.BtnIconText}>Select photo</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePhotoBottomSheet;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: COLORS.black,
  },
  BtnIconText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: -0.16,
    color: COLORS.black,
    marginTop: 8,
  },
});
