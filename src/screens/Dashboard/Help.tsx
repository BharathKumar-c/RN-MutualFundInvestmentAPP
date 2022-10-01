import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useCallback } from 'react';
import { AbstractButton, Box } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../../navigation/DrawerNavigation/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { useBackHandler } from '@react-native-community/hooks';

const Help = ({ navigation }: NativeStackScreenProps<RootDrawerParamList>) => {
  const dispatch = useAppDispatch();

  // useFocusEffect hook runs every time page navigates/renders
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#A4B9AB'));
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
      <TouchableOpacity onPress={() => navigation?.goBack()}>
        <Image source={assets.BackBtnIcon} />
      </TouchableOpacity>
      <Image style={styles.titleImage} source={assets.PrepareYourDocument} />
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.helpText}>
        We're here to help. Our support team are{'\n'}available between 9-5:30pm
        Monday-Friday.
      </Text>
      <Box style={styles.response}>
        <Image style={styles.streak} source={assets.StreakDark} />
        <Text style={styles.subText}>We aim to reply within few mins</Text>
      </Box>
      <AbstractButton
        buttonStyle={styles.backBtn}
        onPress={() => {
          navigation.navigate('LiveChat');
        }}
        textStyle={styles.liveChatBtn}>
        Live Chat
      </AbstractButton>
      <Box style={styles.divider}>
        <Image source={assets.SectionDivider} />
      </Box>

      <Box style={styles.helpBox}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HelpCenter');
          }}>
          <Box style={styles.helpContents}>
            <View>
              <Text style={styles.helpTitle}>Help Center</Text>
              <Text style={styles.helpText}>
                There’s a pretty good chance your question is among them, and
                it’s the fastest way to get answers.
              </Text>
            </View>
            <View>
              <Image source={assets.ForwardArrow} />
            </View>
          </Box>
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
    marginTop: 40,
  },
  title: {
    marginTop: 30,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayExBold,
  },
  titleImage: {
    width: 200,
    height: 200,
    alignSelf: 'flex-end',
  },
  response: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  streak: {
    width: 10,
    height: 20,
    marginRight: 12,
    marginLeft: 8,
  },
  subText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.small,
    lineHeight: SIZES.semiLarge,
    color: '#000000',
  },
  liveChatBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 14,
  },
  backBtn: {
    marginTop: '4%',
    width: '40%',
    height: '7%',
  },
  divider: {
    marginTop: 30,
    alignSelf: 'center',
  },
  helpBox: {
    marginVertical: 40,
    backgroundColor: '#D1D8D1',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 23,
  },
  helpContents: {
    flexDirection: 'row',
  },
  helpTitle: {
    fontWeight: '700',
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.PlayfairDisplayBold,
  },
  helpText: {
    fontFamily: FONTS.MerriweatherRegular,
    color: COLORS.black,
    lineHeight: 24,
    marginVertical: 15,
  },
});

export default Help;
