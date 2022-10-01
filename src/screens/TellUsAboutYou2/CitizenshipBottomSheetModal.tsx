import { Image, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../components';
import { assets, COLORS, FONTS } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { setCitizenship } from '../../state/onboarding';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { useAppDispatch } from '../../state/index';

const DATA = [
  {
    id: 1,
    name: 'Irish',
  },
  {
    id: 2,
    name: 'American',
  },
  {
    id: 3,
    name: 'British',
  },
  {
    id: 4,
    name: 'Indian',
  },
];

const DATA2 = [
  {
    id: 5,
    name: 'Irish',
  },
  {
    id: 6,
    name: 'American',
  },
  {
    id: 7,
    name: 'British',
  },
  {
    id: 8,
    name: 'Indian',
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

const CitizenshipBottomSheetModal = ({
  route,
  navigation,
  handleClosePress,
}: {
  route: any;
  navigation: any;
  handleClosePress: () => void;
}) => {
  const [countrySearch, setCountrySearch] = useState('');
  const citizenship = useSelector(
    (state: RootState) => state.onboarding.citizenship,
  );
  const [selectedCitizenship, setSelectedCitizenship] = useState(citizenship);

  const dispatch = useAppDispatch();

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.name === selectedCitizenship ? '#EDEDE7' : '#EDEDE7';
    const color = item.name === selectedCitizenship ? '#333333' : '#333333';

    const icon =
      item.name === selectedCitizenship
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;
    return (
      <Item
        item={item}
        icon={icon}
        onPress={() => {
          dispatch(setCitizenship(item.name));
          setSelectedCitizenship(item.name);
        }}
      />
    );
  };
  return (
    <Box style={styles.container}>
      <Box alignSelf="flex-end">
        <TouchableOpacity onPress={() => handleClosePress()}>
          <Text style={styles.closeTextBtn}>Close</Text>
        </TouchableOpacity>
      </Box>
      <Box mt={20} width={'100%'}>
        <Text style={styles.titleText}>Select Citizenship</Text>
      </Box>
      <Box mt={20} ml={5} width="100%">
        <CustomInput
          icon={
            <Box>
              <Image source={assets.SearchIcon} />
            </Box>
          }
          iconPosition="left"
          placeholder={'search citizenship'}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value: string) => {
            setCountrySearch(value);
          }}
          style={styles.textInput}
          inputOutContainer={styles.inputOutContainer}
        />
      </Box>
      <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
        <Text style={styles.titleText2}>POPULAR</Text>
      </Box>
      <FlatList
        style={{ marginHorizontal: 5 }}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
        <Text style={styles.titleText2}>ALL CITIZENSHIP</Text>
      </Box>
      <FlatList
        style={{ marginHorizontal: 5 }}
        data={DATA2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
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

export default CitizenshipBottomSheetModal;
