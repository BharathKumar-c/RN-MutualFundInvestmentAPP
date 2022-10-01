import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-svg';
import Context from './context';
export default function Indicator({
  fontSize = 45,
  color = 'white',
  fontFamily,
  textAnchor = 'middle',
  children,
  ...rest
}) {
  const {
    value,
    radius,
    rotation,
    fontFamily: globalFontFamily,
  } = useContext(Context);
  const textProps = {
    transform: `rotate(${360 - rotation}, ${radius}, ${radius})`,
  };
  const fixedValue = Number(value).toFixed();
  if (children) {
    return <View>{children(fixedValue, textProps)}</View>;
  }
  return (
    <Text
      {...textProps}
      x={radius}
      y={radius + radius / 2 + 10}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontFamily={fontFamily || globalFontFamily}
      fill={color}
      {...rest}>
      {fixedValue}
    </Text>
  );
}
