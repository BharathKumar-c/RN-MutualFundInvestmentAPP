import { transform } from '@babel/core';
import { Platform, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
export default StyleSheet.create({
  inputOutContainer: {
    paddingVertical: 20,
  },

  inputInsideContainer: {
    height: Platform.OS === 'ios?'? 45: 42,
    width: '100%',
    borderRadius: 1,
    borderBottomWidth: 2,
    marginTop: 5,
  },

  textInput: {
    flex: 1,
    width: '100%',
    color: COLORS.black,
    fontFamily: FONTS.Merriweather,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlignVertical:'center',
    justifyContent:'center',
    // height:Platform.OS === 'ios?'&& 30,
  },

  error: {
    color: COLORS.danger,
    paddingTop: 4,
    fontSize: 10,
    fontFamily: FONTS.Merriweather,
    lineHeight: 16,
  },

  label: {
    fontFamily: FONTS.MerriweatherRegular,
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
});
