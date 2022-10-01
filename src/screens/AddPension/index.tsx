import { StyleSheet, Text, Image } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import {
  AbstractButton,
  Box,
  CustomInput,
  KeyboardAvoidingWrapper,
} from '../../components';
import { assets, COLORS, FONTS } from '../../constants';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../../state';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { addPension, editPension } from '../../service/PensionService';
type PensionDetail = {
  pensionName: string;
  accountNumber: string;
  employer: string;
  potSize: number;
  pensionCompany: string;
};
const Index = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [activePension, setActivePension] = useState(false);
  const [pensionDetails, setPensionDetails] = useState<PensionDetail | null>(
    null,
  );
  const [loader, setLoader] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [accountError, setAccountError] = useState(false);
  const [employeeError, setEmployeeError] = useState(false);
  const [potError, setPotError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  // useFocusEffect hook runs every time page navigates
  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor(COLORS.background.primary));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
      if (route.params?.item) {
        setPensionDetails(route.params.item);
        if (route.params?.item.isActive) {
          setActivePension(true);
        }
      }
    }, []),
  );
  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, []),
  );

  const handleChange = (value: any, name: string) => {
    setPensionDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPension = async () => {
    setLoader(true);
    try {
      if (!pensionDetails?.id) {
        await addPension({
          ...pensionDetails,
          isActive: activePension,
        });
      } else {
        await editPension(
          {
            ...pensionDetails,
            isActive: activePension,
          },
          pensionDetails?.id,
        );
      }
      setLoader(false);
      navigation.navigate('Aggregate');
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      {/* <ScrollView> */}
      <Box style={styles.Container}>
        <Box>
          {route.params?.item ? (
            <Text style={styles.HeaderText}>Edit Pension</Text>
          ) : (
            <Text style={styles.HeaderText}>New Pension</Text>
          )}
        </Box>
        <Box
          style={{
            flex: 1,
            width: '100%',
            paddingVertical: 10,
            marginVertical: 10,
          }}>
          <Box
            style={{
              marginHorizontal: 10,
            }}>
            <CustomInput
              inputOutContainer={{ paddingVertical: 10 }}
              placeholder={'Enter pension name'}
              label={'PENSION NAME'}
              style={styles.textInput}
              maxLength={80}
              labelStyle={styles.labelStyle}
              value={pensionDetails?.pensionName || ''}
              onChangeText={(value: string) => {
                handleChange(value, 'pensionName');
              }}
              onBlur={(value: string) =>
                setNameError(!pensionDetails?.pensionName)
              }
              error={nameError ? 'Please enter your pension name ' : ''}
            />
            <CustomInput
              inputOutContainer={{ paddingVertical: 10 }}
              placeholder={'Enter account number'}
              label={'ACCOUNT NUMBER'}
              maxLength={80}
              style={styles.textInput}
              labelStyle={styles.labelStyle}
              value={pensionDetails?.accountNumber || ''}
              onChangeText={(value: string) => {
                handleChange(value, 'accountNumber');
              }}
              onBlur={(value: string) =>
                setAccountError(!pensionDetails?.accountNumber)
              }
              error={accountError ? 'Please enter your account number' : ''}
            />
            <CustomInput
              inputOutContainer={{ paddingVertical: 10 }}
              placeholder={'Enter employer'}
              label={'EMPLOYER'}
              maxLength={80}
              style={styles.textInput}
              labelStyle={styles.labelStyle}
              value={pensionDetails?.employer || ''}
              onChangeText={(value: string) => {
                handleChange(value, 'employer');
              }}
              onBlur={(value: string) =>
                setEmployeeError(!pensionDetails?.employer)
              }
              error={employeeError ? 'Please enter your employer' : ''}
            />
            <CustomInput
              inputOutContainer={{ paddingVertical: 10 }}
              placeholder={'Enter pot size'}
              label={'POT SIZE'}
              maxLength={10}
              style={styles.textInput}
              labelStyle={styles.labelStyle}
              value={pensionDetails?.potSize?.toString() || ''}
              onChangeText={(value: number) => {
                handleChange(value, 'potSize');
              }}
              autoCapitalize="none"
              keyboardType="numeric"
              autoCorrect={false}
              icon={<Text style={styles.textInput}>{'\u20AC'}</Text>}
              iconPosition="left"
              onBlur={(value: string) =>
                setPotError(!pensionDetails?.potSize?.toString())
              }
              error={potError ? 'Please enter the pot size' : ''}
            />
            <CustomInput
              inputOutContainer={{ paddingVertical: 10 }}
              placeholder={'Enter pension company'}
              label={'PENSION COMPANY'}
              maxLength={80}
              style={styles.textInput}
              labelStyle={styles.labelStyle}
              value={pensionDetails?.pensionCompany || ''}
              onChangeText={(value: string) => {
                handleChange(value, 'pensionCompany');
              }}
              onBlur={(value: string) =>
                setCompanyError(!pensionDetails?.pensionCompany)
              }
              error={companyError ? 'Please enter your pension company' : ''}
            />
            <Box style={styles.CheckBoxContentContainer}>
              <Box flexDirection="row" alignItems="center">
                <CheckBox
                  style={{
                    transform: [{ scaleX: 1 }, { scaleY: 1 }],
                  }}
                  tintColors={{
                    true: '#145650',
                    false: COLORS.green,
                  }}
                  disabled={false}
                  value={activePension}
                  onValueChange={newValue => {
                    setActivePension(newValue);
                  }}
                />
              </Box>
              <Box style={styles.CheckBoxText}>
                <Text style={styles.CheckboxCaption}>Active pension</Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box style={styles.BtnContainer}>
          <AbstractButton
            // textStyle={styles.nextBtn}
            disabled={
              !pensionDetails?.pensionName ||
              !pensionDetails?.accountNumber ||
              !pensionDetails?.employer ||
              !pensionDetails?.potSize ||
              !pensionDetails?.pensionCompany
            }
            loader={loader}
            onPress={() => {
              {
                handleAddPension();
              }
            }}>
            {route.params?.item ? 'Update' : 'Add'}
          </AbstractButton>
        </Box>
      </Box>
      {/* </ScrollView> */}
    </KeyboardAvoidingWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    // alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    height: 50,
  },
  Image: {
    width: 20,
    height: 20,
  },
  HeaderText: {
    textAlign: 'left',
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1,
  },
  textInput: {
    fontFamily: FONTS.RobotoRegular,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 0,
    borderColor: '#e5e5e5',
    fontSize: 16,
    lineHeight: 18,
    color: COLORS.black,
  },
  labelStyle: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  CheckboxCaption: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.lightGray,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },
  CheckBoxContentContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: -8,
    alignItems: 'center',
  },
  CheckBoxText: {
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  BtnContainer: {
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
});
