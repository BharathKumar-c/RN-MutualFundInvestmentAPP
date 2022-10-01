import { Image, Platform, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setAddress } from '../../state/onboarding';
import { RootState, useAppDispatch } from '../../state';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import InputScrollView from 'react-native-input-scroll-view';

const DATA = [
  {
    id: '1',
    title: 'Riverbank House Glenbrook, Co  Cork',
    icon: assets.LocationIcon,
    image: assets.ArrowRight,
  },
  {
    id: '2',
    title: 'Riverbank House Glenbrook, Co  Cork',
    icon: assets.LocationIcon,
    image: assets.ArrowRight,
  },
  {
    id: '3',
    title: 'Riverbank House Glenbrook, Co  Cork',
    icon: assets.LocationIcon,
    image: assets.ArrowRight,
  },
  {
    id: '4',
    title: 'Riverbank House Glenbrook, Co  Cork',
    icon: assets.LocationIcon,
    image: assets.ArrowRight,
  },
];

const Item = ({ item, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Box style={styles.item}>
      <Box style={styles.renderBox}>
        <Box width={'100%'} flexDirection="row" alignItems="center">
          <Image source={icon} />
          <Text style={styles.title}>{item.name}</Text>
        </Box>
        <Box>
          <Image source={item.image} />
        </Box>
      </Box>
    </Box>
  </TouchableOpacity>
);

const AddressBottomSheet = ({
  route,
  navigation,
  data,
  handleClosePress,
  setUserAddress,
}: {
  route: any;
  navigation: any;
  data: any;
  setUserAddress: any;

  handleClosePress: () => void;
}) => {
  const [selectedId, setSelectedId] = useState('1');
  const dispatch = useAppDispatch();
  const { address } = useSelector((state: RootState) => state.onboarding);
  const [customAddress, setCustomAddress] = useState('');

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#EDEDE7' : '#EDEDE7';
    const color = item.id === selectedId ? '#333333' : '#333333';

    const icon =
      item.id === selectedId ? assets.GreenCheckedRB : assets.GreenUnCheckedRB;
    return (
      <Item item={item} icon={icon} onPress={() => setSelectedId(item.id)} />
    );
  };

  const updateAddress = (val: string) => {
    setCustomAddress(val);
    setUserAddress(val);
  };

  return (
    <Box style={styles.container}>
      <Box alignSelf="flex-end">
        <TouchableOpacity onPress={() => handleClosePress()}>
          <Text style={styles.closeTextBtn}>Close</Text>
        </TouchableOpacity>
      </Box>
      <Box mt={50} width={'100%'}>
        <Text style={styles.titleText}>Can’t find your address?</Text>
        <Text style={styles.titleText}>Enter manually</Text>
      </Box>
      <Box mt={20} ml={5} width="100%">
        <CustomInput
          horizontalScroll={true}
          placeholder={'Enter your address'}
          autoCapitalize="none"
          value={customAddress}
          autoCorrect={false}
          multiline={true}
          label={'MY ADDRESS'}
          labelStyle={styles.titleText2}
          onChangeText={(value: string) => {
            updateAddress(value);
          }}
          style={styles.textInput}
          inputOutContainer={styles.inputOutContainer}
        />
      </Box>
      <Box style={styles.continueBtn}>
        <AbstractButton
          onPress={() => {
            handleClosePress();
          }}>
          Continue
        </AbstractButton>
      </Box>
    </Box>
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
        ? SIZES.screen_height / 1.48
        : SIZES.screen_height / 1.46,
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.background.primary,
  },
  renderBox: {
    paddingVertical: '2%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeTextBtn: {
    color: '#1A6A73',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  title: {
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    fontFamily: FONTS.MerriweatherRegular,
    color: '#333333',
    fontSize: 13,
  },
  titleText2: {
    color: '#1A6A73',
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  textInput: {
    fontFamily: FONTS.MerriweatherRegular,
    width: '100%',
    borderRadius: 5,
    // borderBottomWidth: 1,
    borderColor: '#0000001a',
    color: COLORS.black,
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default AddressBottomSheet;
