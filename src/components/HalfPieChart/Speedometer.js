import React, { useMemo } from 'react';
import SpeedometerContext from './context';
import {
  Defs,
  Rect,
  LinearGradient,
  Stop,
  Path,
  Svg,
  G,
} from 'react-native-svg';

const FROM_COLOR = 'rgb(255, 255, 255)';
const TO_COLOR = 'rgb(0,102,84)';

export default function Speedometer({
  width = 250,
  height = width,
  angle = 250,
  rotation = -angle / 2,
  value = 0,
  min = 0,
  max = 180,
  lineCap = 'butt',
  accentColor = '#00e0ff',
  fontFamily = 'helvetica',
  children,
}) {
  const radius = width / 2;
  const currentFillAngle = useMemo(() => {
    const clampValue = Math.min(max, Math.max(min, Number(value)));
    return (angle * (clampValue - min)) / (max - min);
  }, [min, max, value, angle]);
  const contextValue = {
    currentFillAngle,
    radius,
    rotation,
    min,
    max,
    angle,
    lineCap,
    accentColor,
    fontFamily,
    value,
  };
  return (
    <SpeedometerContext.Provider value={contextValue}>
      <Svg width={width} height={height} viewBox="-5 0 260 230">
        <G rotation={rotation} originX={radius} originY={radius}>
          {children}
        </G>
      </Svg>
    </SpeedometerContext.Provider>
  );
}
