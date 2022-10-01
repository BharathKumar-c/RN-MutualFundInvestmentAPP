import {
  View,
  Text,
  TextInput,
  ColorValue,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { Box } from '../index';
import { COLORS, assets, FONTS, SIZES } from '../../constants';
import styles from './style';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  value?: string;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: string;
  error?: string;
  style?: any;
  onChangeText?: Function;
  onBlur?: (value: any) => any;
  onFocus?: (value: any) => any;
  placeholder?: string;
  placeholderTextColor?: any;
  labelStyle?: any;
  inputOutContainer?: any;
  inputInsideContainer?: any;
  secureTextEntry?: any;
  autoCorrect?: any;
  autoCapitalize?: any;
  keyboardType?: any;
  editable?: any;
  showSoftInputOnFocus?: any;
  ref?: any;
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  horizontalScroll?: boolean;
}

const CustomInput = (props: Props) => {
  const {
    style,
    onChangeText,
    value,
    label,
    icon,
    iconPosition,
    error,
    placeholder,
    placeholderTextColor,
    labelStyle,
    inputOutContainer,
    inputInsideContainer,
    secureTextEntry,
    autoCorrect,
    autoCapitalize,
    keyboardType,
    onFocus,
    onBlur,
    editable,
    showSoftInputOnFocus,
    ref,
    autoFocus,
    multiline,
    numberOfLines,
    horizontalScroll,
    ...rest
  } = props;

  const [isSecureEntry, setIsSecureEntry] = useState(secureTextEntry);

  const getFlexDirection = () => {
    if (secureTextEntry) {
      return 'row-reverse';
    } else if (icon && iconPosition) {
      if (iconPosition === 'left') {
        return 'row';
      } else if (iconPosition === 'right') {
        return 'row-reverse';
      }
    }
  };

  const getBorderColor = () => {
    if (error) {
      return COLORS.danger;
    } else {
      return COLORS.gray;
    }
  };

  return (
    <View style={[styles.inputOutContainer, inputOutContainer]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <ScrollView
        contentContainerStyle={
          horizontalScroll ? { minWidth: '100%' } : { width: '100%' }
        }
        scrollEnabled={horizontalScroll}
        horizontal={horizontalScroll}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={false}>
        <Box
          style={[
            {
              flexDirection: getFlexDirection(),
              borderColor: getBorderColor(),
              alignItems: secureTextEntry
                ? 'center'
                : icon
                ? 'center'
                : 'baseline',
            },
            styles.inputInsideContainer,
            inputInsideContainer,
          ]}>
          <Box style={secureTextEntry && { width: '10%' }}>
            {secureTextEntry ? (
              <TouchableOpacity
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setIsSecureEntry(!isSecureEntry);
                }}>
                <Image
                  source={isSecureEntry ? assets.EyeOpen : assets.EyeClose}
                />
              </TouchableOpacity>
            ) : (
              icon && icon
            )}
          </Box>
          <TextInput
            style={[styles.textInput, style]}
            multiline={multiline}
            numberOfLines={numberOfLines ? numberOfLines : 5}
            onChangeText={onChangeText}
            ref={ref}
            onBlur={onBlur}
            editable={editable}
            showSoftInputOnFocus={showSoftInputOnFocus}
            onFocus={onFocus}
            value={value}
            secureTextEntry={isSecureEntry}
            placeholder={placeholder}
            autoCorrect={autoCorrect}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : 'rgba(0,0,0,0.4)'
            }
            autoFocus={autoFocus}
            {...rest}
          />
        </Box>
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;
