import { Image, StyleSheet, Text, Platform } from 'react-native';
import React, { useState } from 'react';
import { Box, AbstractButton, CustomInput } from '../../../components';
import { assets, COLORS, FONTS, SIZES } from '../../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { RootState, useAppDispatch } from '../../../state';
import { useSelector } from 'react-redux';
import { setNationality } from '../../../state/onboarding/StepTwo/index';

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

const NationalityBottomSheetModal = ({
  route,
  navigation,
  handleClosePress,
}: {
  route: any;
  navigation: any;
  handleClosePress: () => void;
}) => {
  // Redux state management
  const dispatch = useAppDispatch();
  const { allNationalityList, popularNationalityList, nationality } =
    useSelector((state: RootState) => state.onboardingStepTwo);

  const [popularNationality, setPopularNationality] = useState(
    nationality ? nationality : 1,
  );
  const [allNationality, setAllNationality] = useState(
    nationality ? nationality : 1,
  );
  const [countrySearch, setCountrySearch] = useState(null);
  const [nationalityLists, setNationalityLists] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.id === popularNationality ? '#EDEDE7' : '#EDEDE7';
    const color = item.id === popularNationality ? '#333333' : '#333333';

    const icon =
      item.id === popularNationality
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;
    return (
      <Item
        item={item}
        icon={icon}
        onPress={() => {
          setPopularNationality(item.id);
          setAllNationality(null);
          dispatch(setNationality(item.id));
          // handleClosePress();
        }}
      />
    );
  };

  const renderItem2 = ({ item }) => {
    const backgroundColor = item.id === allNationality ? '#EDEDE7' : '#EDEDE7';
    const color = item.id === allNationality ? '#333333' : '#333333';

    const icon =
      item.id === allNationality
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;

    return (
      <Item2
        item={item}
        icon={icon}
        onPress={() => {
          setAllNationality(item.id);
          setPopularNationality(null);
          dispatch(setNationality(item.id));
          // handleClosePress();
        }}
      />
    );
  };

  // Search functionality
  const searchNationality = (nameKey: string, myArray: any) => {
    let data = myArray;
    data = data
      .filter(function (item) {
        return item.name.toLowerCase().includes(nameKey.toLowerCase());
      })
      .map(function ({ id, name }) {
        return { id, name };
      });
    setNationalityLists(data);
  };

  return (
    <Box style={styles.container}>
      <Box alignSelf="flex-end">
        <TouchableOpacity onPress={() => handleClosePress()}>
          <Text style={styles.closeTextBtn}>Close</Text>
        </TouchableOpacity>
      </Box>
      <Box mt={20} width={'100%'}>
        <Text style={styles.titleText}>Select nationality</Text>
      </Box>
      <Box mt={20} ml={5} width="100%">
        <CustomInput
          icon={
            <Box>
              <Image source={assets.SearchIcon} />
            </Box>
          }
          iconPosition="left"
          placeholder={'Search nationality'}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value: string) => {
            setCountrySearch(value);
            searchNationality(value, allNationalityList);
          }}
          style={styles.textInput}
          inputOutContainer={styles.inputOutContainer}
        />
      </Box>
      {!countrySearch ? (
        <>
          <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
            <Text style={styles.titleText2}>POPULAR</Text>
          </Box>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: 5 }}
            data={popularNationalityList}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            extraData={popularNationality}
          />
          <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
            <Text style={styles.titleText2}>ALL NATIONALITIES</Text>
          </Box>
          <Box style={styles.allNationalStyle}>
            <FlatList
              style={{ marginHorizontal: 5 }}
              showsVerticalScrollIndicator={false}
              data={allNationalityList}
              renderItem={renderItem2}
              keyExtractor={(item: any) => item.id}
              extraData={allNationality}
            />
          </Box>
        </>
      ) : (
        <>
          <Box alignSelf="flex-start" marginVertical={10} marginHorizontal={5}>
            <Text style={styles.titleText2}>ALL NATIONALITIES</Text>
          </Box>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: 5 }}
            data={nationalityLists}
            renderItem={renderItem2}
            keyExtractor={(item: any) => item.id}
            extraData={allNationality}
          />
        </>
      )}
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
  allNationalStyle: {
    height: SIZES.screen_height / 4.5,
  },
  continueBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    top:
      Platform.OS === 'ios'
        ? SIZES.screen_height / 1.4
        : SIZES.screen_height / 1.36,
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
    fontFamily: FONTS.RobotoRegular,
    fontSize: 16,
    width: '100%',
    marginLeft: 8,
  },
  inputOutContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default NationalityBottomSheetModal;
