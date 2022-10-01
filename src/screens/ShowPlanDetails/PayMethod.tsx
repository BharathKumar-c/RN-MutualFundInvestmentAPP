import { Image, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { setEmploymentStatus, setPayMethod } from '../../state/onboarding';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useAppDispatch } from '../../state/index';
import { InfoPopUp } from '../../components/PopUpModal';

const DATA = [
  {
    id: 1,
    name: 'Annuity',
    info: 'This is the info about the Annutiy',
  },
  {
    id: 2,
    name: 'Lump Sum',
    info: 'This is the info about the Lump sum',
  },
  {
    id: 3,
    name: 'Payments',
    info: 'This is the info about the Payments',
  },
  {
    id: 4,
    name: 'Combination',
    info: 'This is the info about the Combination',
  },
];

const Item = ({ item, icon, onPress, handleOpenModal }) => (
  <TouchableOpacity onPress={onPress}>
    <Box style={styles.item}>
      <Box style={styles.renderBox}>
        <Box width={'100%'} flexDirection="row" alignItems="center">
          <Image source={icon} />
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '85%',
            }}>
            <Text style={styles.title}>{item.name}</Text>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => handleOpenModal(item.info)}>
              <Image
                source={assets.InfoIcon}
                style={{ width: 17, height: 17 }}
              />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Box>
  </TouchableOpacity>
);

const PayMethod = ({
  route,
  navigation,
  handleClosePress,
  handlePayMethod,
}: {
  route: any;
  navigation: any;
  handleClosePress: () => void;
  handlePayMethod: (value: string) => void;
}) => {
  const payMethod = useSelector(
    (state: RootState) => state.onboarding.payMethod,
  );
  const [method, setMethod] = useState(payMethod);
  const [visible, setVisible] = useState(false);
  const [displayInfo, setDisplayInfo] = useState('');
  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleOpenModal = (info: string) => {
    setVisible(true);
    setDisplayInfo(info);
  };

  const dispatch = useAppDispatch();
  const renderItem = ({ item }) => {
    const icon =
      item.name === method ? assets.GreenCheckedRB : assets.GreenUnCheckedRB;
    return (
      <Item
        item={item}
        icon={icon}
        onPress={() => {
          dispatch(setPayMethod(item.name));
          setMethod(item.name);
        }}
        handleOpenModal={handleOpenModal}
      />
    );
  };
  return (
    <>
      {visible && (
        <Box
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <InfoPopUp visible={visible} handleCloseModal={handleCloseModal}>
            <Text
              style={{
                padding: 10,
                marginTop: 20,
                fontFamily: FONTS.PlayfairDisplayBold,
                fontSize: 16,
                color: COLORS.lightGray,
              }}>
              {displayInfo}
            </Text>
          </InfoPopUp>
        </Box>
      )}
      <Box style={styles.container}>
        <Box marginVertical={20} width={'100%'}>
          <Text style={styles.titleText}>
            On Retirement, how would you like your pension to be paid out?
          </Text>
        </Box>
        <FlatList
          style={{ marginHorizontal: 5 }}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Box style={styles.continueBtn}>
          <AbstractButton
            disabled={!payMethod}
            onPress={() => {
              handleClosePress();
              handlePayMethod(method);
            }}>
            Continue
          </AbstractButton>
        </Box>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    top: SIZES.screen_height / 2.3,
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
    fontSize: 20,
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
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#00000010',
    marginLeft: 8,
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default PayMethod;
