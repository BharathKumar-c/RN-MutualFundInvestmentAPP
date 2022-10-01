import React, { useContext, useMemo } from 'react';
import GradientPath from 'react-native-svg-path-gradient';
import Context from './context';
import { getCirclePath } from './utils';

const COLOR9 = 'rgb(24,215,108)';
const COLOR8 = 'rgb(24,194,109)';
const COLOR7 = 'rgb(24,182,110)';
const COLOR6 = 'rgb(24,170,111)';
const COLOR5 = 'rgb(24,160,112)';
const COLOR4 = 'rgb(24,150,113)';
const COLOR3 = 'rgb(25,138,114)';
const COLOR2 = 'rgb(25,128,114)';
const COLOR1 = 'rgb(25,121,114)';
const COLOR0 = 'rgb(26,106,115)';

export default function Arc({
  color = '#1A6A73',
  opacity = 0.3,
  arcWidth = 4,
  lineCap,
  ...rest
}) {
  const { radius, lineCap: globalLineCap, angle } = useContext(Context);
  const secondaryPath = useMemo(
    () => getCirclePath(radius, radius, radius - arcWidth / 2, 0, angle),
    [radius, arcWidth, angle],
  );
  return (
    <GradientPath
      d={secondaryPath}
      colors={[
        COLOR0,
        COLOR1,
        COLOR2,
        COLOR3,
        COLOR4,
        COLOR5,
        COLOR6,
        COLOR7,
        COLOR8,
        COLOR9,
      ]}
      strokeWidth={arcWidth}
      strokeOpacity={opacity}
      strokeLinecap={lineCap || globalLineCap}
      {...rest}
    />
  );
}
