import React, { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import { Box } from '../../components';
import { COLORS, assets } from '../../constants';
import ProgressBar from 'react-native-animated-progress';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { CommonActions, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../state';
import {
  setIsEnableHeader,
  setIsHeaderNavigation,
} from '../../state/generalUtil';

interface Props {
  navigation?: any;
  progressBarValue?: any;
  progressBarStep?: any;
  isEnableProgressBar?: boolean;
  headerProps?: any;
  backIcon?: any;
  isHeaderNavigation?: string;
}

const Header = (props: Props) => {
  const {
    navigation,
    progressBarValue,
    progressBarStep,
    isEnableProgressBar,
    headerProps,
    backIcon,
  } = props;

  const {
    isBottomSheetOpened,
    statusbarColor,
    isEnableHeader,
    isHeaderNavigation,
    isEnableHeaderProgress,
    headerColor,
  } = useSelector((state: RootState) => state.generalUtil);

  const [progressBarStep1, setProgressBarStep1] = useState(false);
  const [progressBarStep2, setProgressBarStep2] = useState(false);
  const [progressBarStep3, setProgressBarStep3] = useState(false);
  const [progressBarIsEnable, setProgressBarIsEnable] = useState(true);
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (progressBarStep === 1) {
      setProgressBarStep1(true);
      setProgressBarStep2(false);
      setProgressBarStep3(false);
    } else if (progressBarStep === 2) {
      setProgressBarStep1(true);
      setProgressBarStep2(true);
      setProgressBarStep3(false);
    } else if (progressBarStep === 3) {
      setProgressBarStep1(true);
      setProgressBarStep2(true);
      setProgressBarStep3(true);
    }
  }, [progressBarStep, isEnableProgressBar]);

  return (
    <>
      {isEnableHeader && (
        <Box
          style={{
            backgroundColor: headerColor
              ? headerColor
              : COLORS.background.primary,
            paddingRight: 10,
            height: Platform.OS === 'ios' ? 40 : 40,
          }}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={Platform.OS === 'ios' ? 'center' : 'center'}>
          <TouchableOpacity
            style={{
              paddingVertical: Platform.OS === 'ios' ? 10 : 10,
              paddingHorizontal: 20,
            }}
            onPress={() => {
              if (route.name === 'ThingsToDoScreen') {
                navigation?.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  }),
                );
              } else {
                if (isHeaderNavigation) {
                  navigation.navigation.navigate(isHeaderNavigation);
                  dispatch(setIsHeaderNavigation(''));
                } else {
                  navigation?.navigation?.goBack();
                }
              }
            }}>
            {headerProps?.showBackButton && (
              <Image
                style={backIcon ? styles.backIcon : styles.defaultbackIcon}
                source={backIcon ? backIcon : assets.BackIcon}
              />
            )}
          </TouchableOpacity>
          {/* ProgressBar */}
          {isEnableProgressBar && !isBottomSheetOpened && (
            <Box
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              style={{ width: '60%' }}>
              {progressBarStep1 ? (
                progressBarStep1 && progressBarStep2 ? (
                  <Image
                    source={assets.ProgressCompletedIcon}
                    style={styles.ProgressCompletedIconStyle}
                  />
                ) : (
                  <Image
                    source={assets.InProgressIcon}
                    style={styles.InProgressIconStyle}
                  />
                )
              ) : (
                <Image
                  style={styles.ProgressInCompletedIconStyle}
                  source={assets.ProgressInCompletedIcon}
                />
              )}
              <Box style={styles.progress}>
                <ProgressBar
                  height={4}
                  progress={progressBarStep2 ? 100 : progressBarValue}
                  trackColor="#bdbdbd"
                  backgroundColor="#1A6A73"
                  animated={progressBarStep2 ? false : true}
                />
              </Box>
              {progressBarStep2 ? (
                progressBarStep2 && progressBarStep3 ? (
                  <Image
                    source={assets.ProgressCompletedIcon}
                    style={styles.ProgressCompletedIconStyle}
                  />
                ) : (
                  <Image
                    source={assets.InProgressIcon}
                    style={styles.InProgressIconStyle}
                  />
                )
              ) : (
                <Image
                  source={assets.ProgressInCompletedIcon}
                  style={styles.ProgressInCompletedIconStyle}
                />
              )}
              <Box style={styles.progress}>
                <ProgressBar
                  height={4}
                  progress={
                    progressBarStep3
                      ? 100
                      : progressBarStep2
                      ? progressBarValue
                      : 0
                  }
                  trackColor="#bdbdbd"
                  backgroundColor="#1A6A73"
                  animated={progressBarStep3 ? false : true}
                />
              </Box>
              {progressBarStep3 ? (
                <Image
                  source={assets.InProgressIcon}
                  style={styles.InProgressIconStyle}
                />
              ) : progressBarStep2 && progressBarStep3 ? (
                <Image
                  source={assets.ProgressCompletedIcon}
                  style={styles.ProgressCompletedIconStyle}
                />
              ) : (
                <Image
                  source={assets.ProgressInCompletedIcon}
                  style={styles.ProgressInCompletedIconStyle}
                />
              )}
              <Box style={styles.progress}>
                <ProgressBar
                  height={4}
                  progress={progressBarStep3 ? progressBarValue : 0}
                  trackColor="#bdbdbd"
                  backgroundColor="#1A6A73"
                  animated={true}
                />
              </Box>
              <Image
                style={styles.ProgressInCompletedIconStyle}
                source={assets.ProgressInCompletedIcon}
              />
            </Box>
          )}
          {/* <Image source={assets.ProgressBar} /> */}
          <TouchableOpacity>
            {/* <Image style={styles.backIcon} source={assets.CloseIcon} /> */}
            <Text>{''}</Text>
          </TouchableOpacity>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  progress: {
    width: '22%',
  },
  ProgressCompletedIconStyle: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
  },
  ProgressInCompletedIconStyle: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
  },
  InProgressIconStyle: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
  },
  backIcon: {
    width: 9,
    height: 16,
  },
  defaultbackIcon: {
    width: 16,
    height: 16,
  },
});

export default Header;
