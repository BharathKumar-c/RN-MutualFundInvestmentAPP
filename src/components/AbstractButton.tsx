import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { MaterialIndicator } from 'react-native-indicators';
import { Box } from '../components';
import { COLORS, FONTS, FONT_WEIGHT } from '../constants';

interface Props {
  children: React.ReactNode;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress(): void;
  disabled?: any;
  loader?: boolean;
}

function AbstractButton(props: Props) {
  const {
    children,
    buttonStyle = {},
    textStyle = {},
    onPress,
    disabled,
    loader = false,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        buttonStyle,
        (disabled || loader) && styles.disableButtonStyle,
      ]}
      onPress={onPress}
      disabled={disabled || loader}>
      <Box>
        <Text style={[styles.textStyle, textStyle]}>{children}</Text>
      </Box>
      {loader && (
        <Box ml={8}>
          <MaterialIndicator color="white" size={20} />
        </Box>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '90%',
    backgroundColor: COLORS.black,
    flexDirection: 'row',
  },
  disableButtonStyle: {
    opacity: 0.5,
  },
  textStyle: {
    color: COLORS.white,
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
  },
});

export default AbstractButton;
