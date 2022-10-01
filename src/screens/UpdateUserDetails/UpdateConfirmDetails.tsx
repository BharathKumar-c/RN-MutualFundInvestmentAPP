import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { assets, COLORS, FONTS } from '../../constants';
import { AbstractButton, Box } from '../../components';
import { useBackHandler } from '@react-native-community/hooks';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { updateCurrentUserData } from '../../service/OnboardingService';

const UpdateConfirmDetails = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const {
    firstName,
    lastName,
    country,
    citizenship,
    phoneNumber,
    email,
    dob,
    callingCode,
    createPassword,
    ppsnNumber,
    employmentStatus,
    emailToken,
    phoneToken,
    address,
    profilePhoto,
  } = useSelector((state: RootState) => state.onboarding);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      // Updata current user data in redux store
      updateCurrentUserData();
    }, []),
  );

  useEffect(() => {
    dispatch(setStatusbarColor(COLORS.background.primary));
    dispatch(setBarStyle('dark-content'));
  }, []);

  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, [navigation]),
  );

  return (
    <Box style={styles.container}>
      <Box flex={1} mt={30}>
        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            <Text style={styles.titleText}>Personal details</Text>
          </Box>
          <Box>
            <Image style={styles.titleImage} source={assets.ConfirmDetail} />
          </Box>
        </Box>
        <Box mt={20} style={{ maxHeight: '75%' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UpdateUserName');
                }}>
                <Text style={styles.label}>LEGAL NAME</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text style={styles.textInput}>
                    {`${firstName} ${lastName}`}
                  </Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UpdateCountryDob');
                }}>
                <Text style={styles.label}>COUNTRY OF BIRTH</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text style={styles.textInput}>{country}</Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <Text style={styles.label}>CITIZENSHIP</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center"
                  style={styles.fieldLine}>
                  <Text style={styles.citizenshipTextInput}>{citizenship}</Text>
                </Box>
              </Box>
            </Box>
            <Box marginTop={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UpdateCountryDob');
                }}>
                <Text style={styles.label}>DATE OF BIRTH</Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Text
                    style={[
                      styles.textInput,
                      { fontFamily: FONTS.RobotoRegular },
                    ]}>
                    {moment(dob).format('DD/MM/YYYY')}
                  </Text>
                  <Image style={styles.imageStyle} source={assets.ArrowRight} />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UpdateContacts');
                  }}>
                  <Text style={styles.label}>MOBILE NUMBER</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center">
                    <Text
                      style={[
                        styles.textInput,
                        { fontFamily: FONTS.RobotoRegular },
                      ]}>
                      {`+(${callingCode})   ${phoneNumber}`}
                    </Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UpdateContacts');
                  }}>
                  <Text style={styles.label}>EMAIL</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center">
                    <Text
                      style={[
                        styles.textInput,
                        { textTransform: 'lowercase' },
                      ]}>
                      {email}
                    </Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box marginTop={10} width="100%">
              <Box width="100%">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UpdateAddress');
                  }}>
                  <Text style={styles.label}>ADDRESS</Text>
                  <Box
                    flexDirection="row"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Text style={styles.textInput}>{address}</Text>
                    <Image
                      style={styles.imageStyle}
                      source={assets.ArrowRight}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            {ppsnNumber != '' && (
              <>
                <Box marginTop={10} width="100%">
                  <Box width="100%">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('UpdateTaxDetails');
                      }}>
                      <Text style={styles.label}>Employment status</Text>
                      <Box
                        flexDirection="row"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <Text style={styles.textInput}>{employmentStatus}</Text>
                        <Image
                          style={styles.imageStyle}
                          source={assets.ArrowRight}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box marginTop={10} width="100%">
                  <Box width="100%">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('UpdateTaxDetails');
                      }}>
                      <Text style={styles.label}>PPSN Number</Text>
                      <Box
                        flexDirection="row"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <Text style={styles.textInputPPSN}>{ppsnNumber}</Text>
                        <Image
                          style={styles.imageStyle}
                          source={assets.ArrowRight}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </>
            )}
          </ScrollView>
        </Box>
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
  },
  titleText: {
    top: 20,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
  },
  titleImage: {
    width: 113,
    height: 94,
    marginRight: 20,
  },
  citizenshipTextInput: {
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 10,
    paddingRight: '5%',
    textTransform: 'capitalize',
  },
  textInputPPSN: {
    flex: 1,
    fontFamily: FONTS.RobotoRegular,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 10,
    paddingRight: '5%',
    textTransform: 'uppercase',
  },
  fieldLine: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 1,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 10,
    borderColor: '#e5e5e5',
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 10,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 20,
  },
  imageStyle: {
    position: 'absolute',
    left: '98%',
  },
});

export default UpdateConfirmDetails;
