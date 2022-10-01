import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Box } from '../../components';
import { COLORS, FONTS, assets, SIZES } from '../../constants';
import { MaterialIndicator } from 'react-native-indicators';
import {
  createUserOnboarding,
  getUserDataById,
} from '../../service/OnboardingService';
import { CommonActions } from '@react-navigation/native';

interface Props {
  navigation: any;
  route: any;
}

function DisplayDocument(props: Props) {
  const [loader, setLoader] = useState(false);
  const ONBOARDINGCHECKLISTID = 2;

  const goTocamera = () => {
    props.navigation.goBack();
  };

  const onComplete = async () => {
    setLoader(true);
    const userData: any = await getUserDataById();
    if (userData?.basicInfo?.userId) {
      await createUserOnboarding(
        parseInt(userData.basicInfo?.userId),
        ONBOARDINGCHECKLISTID,
      );

      if (props.route?.params?.doItLaterFlag) {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'ThingsToDoScreen' }],
          }),
        );
      } else {
        props.navigation.navigate('ThirdStepComplete');
      }
    }
  };

  const source = () => ({ uri: `file://${props?.route?.params?.photo?.path}` });

  return (
    <Box style={styles.container}>
      <Box
        flexDirection="row"
        p={10}
        paddingVertical={10}
        paddingHorizontal={15}>
        <TouchableOpacity onPress={goTocamera}>
          <Image source={assets.BackIcon} style={styles.imgStyle} />
        </TouchableOpacity>
        <Box alignSelf="center" flex={1}>
          <Text style={styles.docHeaderText}>Verify Your Document</Text>
        </Box>
      </Box>
      <Box height={'65%'} p={15}>
        <Image
          source={source()}
          resizeMode="stretch"
          style={styles.capturedImage}
        />
      </Box>
      <Box
        position="absolute"
        style={{
          top:
            Platform.OS === 'ios'
              ? SIZES.screen_height / 1.3
              : SIZES.screen_height / 1.28,
        }}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Box width={'80%'} alignSelf="center">
          <TouchableOpacity onPress={goTocamera} style={styles.onfidoButton}>
            <Text style={styles.onfidoButtonText}>Retake photo</Text>
          </TouchableOpacity>
        </Box>
        <Box width={'80%'} alignSelf="center" mt={10}>
          <TouchableOpacity
            onPress={onComplete}
            style={[styles.onfidoButton, styles.onfidoSubmit]}>
            <Text style={[styles.onfidoButtonText, { color: '#3845f2' }]}>
              Submit photo
            </Text>
            {loader && (
              <Box ml={8}>
                <MaterialIndicator color="#3845f2" size={20} />
              </Box>
            )}
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgStyle: {
    width: 22,
    height: 22,
  },
  docHeaderText: {
    fontFamily: FONTS.RobotoMedium,
    fontSize: 18,
    letterSpacing: 0,
    color: COLORS.black,
    textAlign: 'center',
  },
  capturedImage: {
    height: '100%',
    width: '100%',
    padding: 10,
    borderRadius: 10,
  }, //#3845f2
  onfidoButton: {
    backgroundColor: '#3845f2',
    padding: 10,
    alignItems: 'center',
  },
  onfidoButtonText: {
    fontFamily: FONTS.Merriweather,
    fontSize: 16,
    letterSpacing: 0,
    color: COLORS.white,
    textAlign: 'center',
  },
  onfidoSubmit: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#3845f2',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DisplayDocument;
