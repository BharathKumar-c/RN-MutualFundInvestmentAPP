import { Image, Platform, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { setEmploymentStatus } from '../../state/onboarding';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useAppDispatch } from '../../state/index';

const DATA = [
  {
    id: 1,
    name: 'Student',
  },
  {
    id: 2,
    name: 'Unemployed',
  },
  {
    id: 3,
    name: 'Working',
  },
  {
    id: 4,
    name: 'Retiree',
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

const EmploymentStatus = ({
  route,
  navigation,
  handleClosePress,
  setEmploymentStatusName,
  selectedName,
  setempStatusId,
  selectedId,
}: {
  route: any;
  navigation: any;
  handleClosePress: () => void;
  setEmploymentStatusName: any;
  setempStatusId: any;
  selectedName: string;
  selectedId: number;
}) => {
  const [itemName, setItemName] = useState(selectedName);
  const [itemId, setItemId] = useState(selectedId);

  const dispatch = useAppDispatch();
  const renderItem = ({ item }) => {
    const backgroundColor = item.name === itemName ? '#EDEDE7' : '#EDEDE7';
    const color = item.name === itemName ? '#333333' : '#333333';

    const icon =
      item.name === itemName ? assets.GreenCheckedRB : assets.GreenUnCheckedRB;
    return (
      <Item
        item={item}
        icon={icon}
        onPress={() => {
          setItemName(item.name);
          setItemId(item.id);
          setempStatusId(item.id);
          setEmploymentStatusName(item.name);
        }}
      />
    );
  };
  return (
    <Box style={styles.container}>
      <Box marginVertical={20} width={'100%'}>
        <Text style={styles.titleText}>Employment status</Text>
      </Box>
      <FlatList
        style={{ marginHorizontal: 5 }}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item, index) => 'key' + index}
      />
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
        ? SIZES.screen_height / 2.5
        : SIZES.screen_height / 2.3,
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

export default EmploymentStatus;
