import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  background: {
    primary: '#F2F2EF',
    secondary: '#4D626C',
    primayGreen: '#C9DCC7',
    primaryDrakGreen: '#1C3E41',
  },
  white: '#FFF',
  black: '#000000',
  lightGray: '#747474',
  green: '#1A6A73',
  danger: '#F20000',
  gray: 'rgba(0, 0, 0, 0.1)',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  semiLarge: 20,
  extraLarge: 24,

  // global sizes
  radius: 30,
  radiusSm: 8,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  screen_width: width,
  screen_height: height,
};

type fontWeights =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;

type fontWeightObj = {
  bold: fontWeights;
};

export const FONT_WEIGHT: fontWeightObj = {
  bold: '700',
};

export const FONTS = {
  Merriweather: 'Merriweather Sans',
  MerriweatherRegular: 'Merriweather-Regular', // font regular 400
  MerriweatherBold: 'Merriweather-Bold', // font regular 700
  MerriweatherBlack: 'Merriweather-Black', // font regular 900
  PlayfairDisplay: 'PlayfairDisplay', // font regular 400
  PlayfairDisplayBold: 'PlayfairDisplay-Bold', //font-width 700
  PlayfairDisplayExBold: 'PlayfairDisplay-ExtraBold', //font-widht 800
  AbrilFatfaceRegular: 'AbrilFatface-Regular',
  RobotoBlack: 'Roboto-Black',
  RobotoBold: 'Roboto-Bold',
  RobotoMedium: 'Roboto-Medium',
  RobotoRegular: 'Roboto-Regular',
  OpenSansBold: 'OpenSans-Bold',
  OpenSans: 'OpenSans-Regular',
  OpenSansSemiBold: 'OpenSans-SemiBold',

  largeTitle: {
    fontFamily: 'Roboto-regular',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: { fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22 },
  body1: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};
