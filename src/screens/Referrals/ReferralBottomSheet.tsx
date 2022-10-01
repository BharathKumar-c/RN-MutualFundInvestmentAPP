import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box } from '../../components';
import { COLORS, FONTS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReferralBottomSheet = ({
  handleClosePress,
}: {
  route: any;
  navigation: any;
  handleClosePress: () => void;
}) => {
  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Text style={styles.titleText}>Share!</Text>
        <TouchableOpacity onPress={() => handleClosePress()}>
          <Icon name="close-circle" style={styles.closeCircleIcon} />
        </TouchableOpacity>
      </Box>
      <Box style={styles.socialMediaWrapper}>
        <TouchableOpacity onPress={() => {}}>
          <Box style={styles.navItem}>
            <Icon name="whatsapp" size={50} color={'#1fc243'} />
            <Text style={styles.navItemText}>Whatsapp</Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Box style={styles.navItem}>
            <Icon name="facebook" size={50} color={'#126be8'} />
            <Text style={styles.navItemText}>Facebook</Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Box style={styles.navItem}>
            <Icon name="twitter" size={50} color={'#1da1f6'} />
            <Text style={styles.navItemText}>Twitter</Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Box style={styles.navItem}>
            <Icon
              name="dots-horizontal-circle-outline"
              size={50}
              color={COLORS.lightGray}
            />
            <Text style={styles.navItemText}>More</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default ReferralBottomSheet;

const styles = StyleSheet.create({
  closeCircleIcon: {
    fontSize: 24,
    color: COLORS.background.primayGreen,
    opacity: 0.8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  navItemText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 14,
    color: COLORS.green,
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.green,
    elevation: 4,
    shadowColor: '#52006A',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  closeTextBtn: {
    color: '#1A6A73',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
  },
  socialMediaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '70%',
    marginVertical: 10,
  },
  container: {
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.background.primayGreen,
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
