import { Image, StyleSheet, Text } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../../components';
import { assets, COLORS, FONTS } from '../../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { setCountry } from '../../../state/onboarding';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { useAppDispatch } from '../../../state/index';
import { useBackHandler } from '@react-native-community/hooks';

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

const Item2 = ({ item, icon, onPress }) => (
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

const CountryBottomSheetModal = ({
  route,
  navigation,
  handleClosePress,
  getCountryName,
  value,
}: {
  route: any;
  navigation: any;
  value: any;
  handleClosePress: () => void;
  getCountryName: (name: any) => any;
}) => {
  const dispatch = useAppDispatch();
  const { country, allCountryList, popularCountryList } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const [popularCountry, setPopularCountry] = useState(value);
  const [allCountry, setAllCountry] = useState(value);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryLists, setCountryLists] = useState(null);

  useBackHandler(
    useCallback(() => {
      handleClosePress();
      return true;
    }, []),
  );

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.name === popularCountry ? '#EDEDE7' : '#EDEDE7';
    const color = item.name === popularCountry ? '#333333' : '#333333';

    const icon =
      item.name === popularCountry
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;
    return (
      <Item
        item={item}
        icon={icon}
        onPress={() => {
          setPopularCountry(item.name);
          setAllCountry(null);
          getCountryName(item.name);
        }}
      />
    );
  };

  const renderItem2 = ({ item }) => {
    const backgroundColor =
      item.name === allCountryList ? '#EDEDE7' : '#EDEDE7';
    const color = item.name === allCountryList ? '#333333' : '#333333';

    const icon =
      item.name === allCountry
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;

    return (
      <Item2
        item={item}
        icon={icon}
        onPress={() => {
          setAllCountry(item.name);
          setPopularCountry(null);
          getCountryName(item.name);
        }}
      />
    );
  };

  // Search functionality
  const searchCountry = (nameKey: string, myArray: any) => {
    let data = myArray;
    data = data
      .filter(function (item) {
        return item.name.toLowerCase().includes(nameKey.toLowerCase());
      })
      .map(function ({ id, name }) {
        return { id, name };
      });
    setCountryLists(data);
  };

  return (
    <Box style={styles.container}>
      <Box alignSelf="flex-end">
        <TouchableOpacity onPress={() => handleClosePress()}>
          <Text style={styles.closeTextBtn}>Close</Text>
        </TouchableOpacity>
      </Box>
      <Box mt={20} width={'100%'}>
        <Text style={styles.titleText}>Select country</Text>
      </Box>
      <Box mt={20} ml={5} width="100%">
        <CustomInput
          icon={
            <Box>
              <Image source={assets.SearchIcon} />
            </Box>
          }
          iconPosition="left"
          placeholder={'Search country'}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value: string) => {
            setCountrySearch(value);
            searchCountry(value, allCountryList);
          }}
          style={styles.textInput}
          inputOutContainer={styles.inputOutContainer}
        />
      </Box>
      {!countrySearch ? (
        <>
          <Box alignSelf="flex-start" marginVertical={15} marginHorizontal={5}>
            <Text style={styles.titleText2}>POPULAR</Text>
          </Box>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: 5 }}
            data={popularCountryList}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            extraData={popularCountry}
          />
          <Box alignSelf="flex-start" mt={40} mb={20} marginHorizontal={5}>
            <Text style={styles.titleText2}>ALL COUNTRIES</Text>
          </Box>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: 5 }}
            data={allCountryList}
            renderItem={renderItem2}
            keyExtractor={(item: any) => item.id}
            extraData={allCountry}
          />
        </>
      ) : (
        <>
          <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
            <Text style={styles.titleText2}>ALL COUNTRIES</Text>
          </Box>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: 5 }}
            data={countryLists}
            renderItem={renderItem2}
            keyExtractor={(item: any) => item.id}
            extraData={allCountry}
          />
        </>
      )}
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
    marginLeft: 8,
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default CountryBottomSheetModal;
