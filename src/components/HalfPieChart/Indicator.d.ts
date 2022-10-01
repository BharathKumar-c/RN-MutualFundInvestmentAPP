/// <reference types="react" />
import { TextProps } from 'react-native-svg';
interface IndicatorProps extends TextProps {
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  textAnchor?: TextProps['textAnchor'];
  children?: (
    fixedValue: string,
    textProps: {
      transform: string;
    },
  ) => JSX.Element;
}
export default function Indicator({
  fontSize,
  color,
  fontFamily,
  textAnchor,
  children,
  ...rest
}: IndicatorProps): JSX.Element;
export {};
