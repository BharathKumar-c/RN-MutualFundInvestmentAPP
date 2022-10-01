import React, { useCallback, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  View,
  FlatList,
  Platform,
} from 'react-native';
import { Box, AbstractButton } from '../../components';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState, useAppDispatch } from '../../state';
import { useSelector } from 'react-redux';
import { useBackHandler } from '@react-native-community/hooks';
import { setDocumentType } from '../../state/onboarding/StepThree/index';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  setBarStyle,
  setStatusbarColor,
  setTranslucent,
} from '../../state/generalUtil';
import { getOnfidoSDKToken } from '../../service/OnfidoService';
import PermissionService from '../../service/PermissionService';

const SelectDocumentScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  // Redux state management
  const dispatch = useAppDispatch();
  const { PERMISSIONS_TYPE, checkPermissions, requestPermisssions } =
    PermissionService;
  const { documentType, documentTypeList } = useSelector(
    (state: RootState) => state.onboardingStepThree,
  );
  const { cameraPermissionStatus } = useSelector(
    (state: RootState) => state.permission,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
      dispatch(setTranslucent(false));
    }, []),
  );

  useEffect(() => {
    getOnfidoSDKToken();
  }, []);

  const handleContinue = async () => {
    const pmtStatus = await checkPermissions(PERMISSIONS_TYPE.camera);
    const id = route?.params?.doItLaterFlag;
    if (pmtStatus === 'granted') {
      if (id) {
        navigation.navigate('PrepareYourDocument', { doItLaterFlag: id });
      } else {
        navigation.navigate('PrepareYourDocument');
      }
    } else if (pmtStatus === 'denied') {
      if (cameraPermissionStatus === 'denied') {
        if (id) {
          navigation.navigate('CameraAccessDeniedDocx', { doItLaterFlag: id });
        } else {
          navigation.navigate('CameraAccessDeniedDocx');
        }
      } else {
        if (id) {
          navigation.navigate('CameraAccessIsRequiredDocx', {
            doItLaterFlag: id,
          });
        } else {
          navigation.navigate('CameraAccessIsRequiredDocx');
        }
      }
    }
  };

  useBackHandler(
    useCallback(() => {
      if (route?.params?.doItLaterFlag) {
        navigation.navigate('ThingsToDoScreen');
      } else {
        navigation.goBack();
      }
      return true;
    }, [route]),
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === documentType ? '#EDEDE7' : '#EDEDE7';
    const color = item.id === documentType ? '#333333' : '#333333';

    const icon =
      item.id === documentType
        ? assets.GreenCheckedRB
        : assets.GreenUnCheckedRB;

    return (
      <Item
        item={item}
        onPress={() => {
          dispatch(setDocumentType(item.id));
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
        icon={icon}
      />
    );
  };

  interface Props {
    item?: any;
    onPress?: ((event: any) => void) | undefined;
    backgroundColor?: any;
    textColor?: any;
    icon?: any;
  }

  const Item = (props: Props) => {
    const { item, onPress, backgroundColor, textColor, icon } = props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.item, backgroundColor]}>
        <View style={[styles.display]}>
          <Image source={icon} />
          <Text style={[styles.title, textColor]}>{item.title}</Text>
        </View>
        <Image style={styles.image} source={item.image} />
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <Box flex={1}>
        <Box pt={60} flexDirection={'column'}>
          <Text style={styles.titleText}>
            Select document {'\n'}to verify your address
          </Text>
          <Box pt={35} width="100%">
            <Text style={styles.label}>DOCUMENT TYPE</Text>
          </Box>
        </Box>
        <SafeAreaView>
          <FlatList
            data={documentTypeList}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            extraData={documentType}
          />
        </SafeAreaView>
      </Box>
      <Box style={styles.continueBtn}>
        <AbstractButton onPress={handleContinue}>Continue</AbstractButton>
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
        ? SIZES.screen_height / 1.28
        : SIZES.screen_height / 1.24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.extraLarge,
    textAlign: 'left',
    lineHeight: 28,
  },
  label: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 1,
    color: '#747474',
  },
  item: {
    paddingHorizontal: 15,
    height: 70,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.Merriweather,
    lineHeight: 24,
    color: '#333333',
    justifyContent: 'space-between',
    marginLeft: '7%',
  },
  image: {
    alignItems: 'flex-end',
    width: 55,
    height: 50,
  },
  display: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default SelectDocumentScreen;
