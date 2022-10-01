import React, { useContext, useEffect, useState } from 'react';
import { G, Polygon, Circle } from 'react-native-svg';
import Context from './context';

export default function Needle({
  offset = 25,
  baseWidth = 6,
  baseOffset = 20,
  color = 'white',
  circleRadius = 0,
  circleColor,
  strokeLinejoin = 'round',
  children,
}) {
  const { currentFillAngle, radius, accentColor } = useContext(Context);
  const bottom = radius + baseOffset;
  const points = `
    ${radius - baseWidth / 2}, ${50} ${
    radius + baseWidth / 2
  }, ${10} ${radius}, ${offset}
  `;
  const defaultNeedle = (
    <G>
      <Circle
        r={circleRadius}
        cx={radius}
        cy={radius}
        fill={circleColor || accentColor}
      />
      <Polygon
        points={points}
        fill={color}
        strokeWidth="1"
        stroke={color}
        strokeLinejoin={strokeLinejoin}
      />
    </G>
  );
  return (
    <G transform={`rotate(${currentFillAngle}, ${radius}, ${radius})`}>
      {children ? children() : defaultNeedle}
    </G>
  );
}
