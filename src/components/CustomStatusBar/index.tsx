import React, { useState } from 'react';
import { Image, StatusBar, TouchableOpacity } from 'react-native';
import { Box } from '../../components';
import { assets } from '../../constants';

interface Props {
  backgroundColor?: any;
  barStyle?: any;
  isProgressBar?: any;
  navigation?: any;
  isEnableNavBtn?: any;
  translucent?: any;
  step?: any;
}

const CustomStatusBar = (props: Props) => {
  const {
    backgroundColor,
    barStyle,
    isProgressBar,
    navigation,
    isEnableNavBtn,
    translucent,
    step,
  } = props;

  const [isEnableNavBtns, setIsEnableNavBtns] = useState(
    isEnableNavBtn ? isEnableNavBtn : true,
  );

  return (
    <>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={translucent ? true : false}
      />
      {isProgressBar && (
        <Box
          mt={10}
          flexDirection={'row'}
          justifyContent={isEnableNavBtns ? 'space-between' : 'center'}>
          {isEnableNavBtns && (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image source={assets.LeftArrowIcon} />
            </TouchableOpacity>
          )}
          {step === 1 ? (
            <Image source={assets.ProgressBar} />
          ) : (
            <Image source={assets.ProgressBar2} />
          )}
          {isEnableNavBtns && (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image source={assets.CloseIcon} />
            </TouchableOpacity>
          )}
        </Box>
      )}
    </>
  );
};

export default CustomStatusBar;
