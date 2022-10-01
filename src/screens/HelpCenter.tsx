import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Box } from '../components';
import { assets, COLORS, FONTS, SIZES } from '../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../navigation/DrawerNavigation/types';
import { setBarStyle, setStatusbarColor } from '../state/generalUtil';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../state';
import { TextInput } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';

const HelpCenter = ({
  navigation,
}: NativeStackScreenProps<RootDrawerParamList>) => {
  const [input, setInput] = useState('');

  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
    }, [dispatch]),
  );

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, [navigation]),
  );

  return (
    <Box style={styles.container}>
      <Text style={styles.title}>Help center</Text>
      <TextInput
        style={styles.searchBox}
        value={input}
        placeholder="How can we help?"
        onChangeText={setInput}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
      <Text style={styles.subHeading}>Browse topics</Text>
      <View>
        <View style={styles.layout}>
          <TouchableOpacity
            style={styles.topic}
            onPress={() => {
              /*navigate*/
            }}>
            <Image source={assets.Activities_HelpCenter} />
            <Text style={styles.topicText}>Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topic}
            onPress={() => {
              /*navigate*/
            }}>
            <Image source={assets.Account_HelpCenter} />
            <Text style={styles.topicText}>Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.layout}>
          <TouchableOpacity
            style={styles.topic}
            onPress={() => {
              /*navigate*/
            }}>
            <Image source={assets.Referral_HelpCenter} />
            <Text style={styles.topicText}>Referral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topic}
            onPress={() => {
              /*navigate*/
            }}>
            <Image source={assets.Settings_HelpCenter} />
            <Text style={styles.topicText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subHeading}>Popular questions</Text>
      <Box>
        <TouchableOpacity
          style={styles.question}
          onPress={() => {
            /*Answer*/
          }}>
          <Text style={styles.questionContent}>
            How does payment and subscription renewal work?
          </Text>
          <Image style={styles.dropDown} source={assets.ArrowDown} />
        </TouchableOpacity>
        <Image style={styles.divider} source={assets.SectionDivider} />
      </Box>
      <Box>
        <TouchableOpacity
          style={styles.question}
          onPress={() => {
            /*Answer*/
          }}>
          <Text style={styles.questionContent}>
            Is there a free trial available?
          </Text>
          <Image style={styles.dropDown} source={assets.ArrowDown} />
        </TouchableOpacity>
        <Image style={styles.divider} source={assets.SectionDivider} />
      </Box>
      <Box>
        <TouchableOpacity
          style={styles.question}
          onPress={() => {
            /*Answer*/
          }}>
          <Text style={styles.questionContent}>
            How to connect new bank account
          </Text>
          <Image style={styles.dropDown} source={assets.ArrowDown} />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
    marginTop: 30,
  },
  title: {
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayExBold,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 60,
    marginTop: 30,
    paddingHorizontal: 15,
    fontFamily: FONTS.MerriweatherRegular,
  },
  subHeading: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    marginTop: 30,
  },
  topic: {
    backgroundColor: '#EDEAE7',
    height: 100,
    paddingLeft: 20,
    paddingTop: 20,
    marginVertical: 10,
    paddingRight: 10,
    borderRadius: 16,
    marginBottom: 5,
    // flex: 1,
    maxWidth: 180,
    width: '100%',
  },
  topicText: {
    fontFamily: FONTS.MerriweatherRegular,
    color: COLORS.black,
    fontSize: SIZES.small,
    marginTop: 10,
  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  questionContent: {
    fontFamily: FONTS.MerriweatherRegular,
    color: COLORS.black,
    lineHeight: 24,
    marginVertical: 15,
    maxWidth: '70%',
  },
  dropDown: {
    alignSelf: 'center',
    height: 8,
    width: 12,
  },
  divider: {
    alignSelf: 'center',
  },
});

export default HelpCenter;
