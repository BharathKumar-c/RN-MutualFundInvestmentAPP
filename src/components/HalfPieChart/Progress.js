import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Context from './context';
import { getCirclePath } from './utils';
import { Emitter } from 'react-native-particles';
import { Image } from 'react-native';
import { assets } from '../../../src/constants';
import {
  Defs,
  Rect,
  LinearGradient,
  Stop,
  Path,
  Svg,
  G,
} from 'react-native-svg';

const COLOR0 = 'rgb(24,215,108)';
const COLOR1 = 'rgb(24,194,109)';
const COLOR2 = 'rgb(24,182,110)';
const COLOR3 = 'rgb(24,170,111)';
const COLOR4 = 'rgb(24,160,112)';
const COLOR5 = 'rgb(24,150,113)';
const COLOR6 = 'rgb(25,138,114)';
const COLOR7 = 'rgb(25,128,114)';
const COLOR8 = 'rgb(25,121,114)';
const COLOR9 = 'rgb(26,106,115)';

export default function Progress({ color, arcWidth = 5, lineCap, ...rest }) {
  const [isEnableSparkle, setisEnableSparkle] = useState(true);
  const Sprakles = () => {
    var yValue = 115;
    if (value > 50 && value <= 100) {
      yValue = 1.7 * (value - 50) + 30;
    } else if (value > 0 && value <= 50) {
      yValue = 115 - 1.7 * value;
    }
    return (
      <>
        {isEnableSparkle && (
          <Emitter
            numberOfParticles={15}
            emissionRate={6}
            interval={200}
            particleLife={1500}
            direction={-90}
            spread={360}
            fromPosition={{ x: value * 2 + arcWidth / 2, y: yValue }}>
            <Image source={assets.Sparkle1} />
          </Emitter>
        )}
      </>
    );
  };

  useEffect(() => {
    // Unmounted its use to stop the reaptation.
    return () => {
      setisEnableSparkle(false);
    };
  }, []);

  const {
    accentColor,
    radius,
    lineCap: globalLineCap,
    currentFillAngle,
    value,
  } = useContext(Context);
  const progressPath = useMemo(
    () =>
      getCirclePath(radius, radius, radius - arcWidth / 2, 0, currentFillAngle),
    [radius, arcWidth, currentFillAngle],
  );
  return (
    <View>
      {/* <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={ COLOR0 }/>
              <Stop offset="0.1" stopColor={ COLOR1 }/>
              <Stop offset="0.2" stopColor={ COLOR2 }/>
              <Stop offset="0.3" stopColor={ COLOR3 }/>
              <Stop offset="0.4" stopColor={ COLOR4 }/>
              <Stop offset="0.5" stopColor={ COLOR5 }/>
              <Stop offset="0.6" stopColor={ COLOR6 }/>
              <Stop offset="0.7" stopColor={ COLOR7 }/>
              <Stop offset="0.8" stopColor={ COLOR8 }/>
              <Stop offset="0.9" stopColor={ COLOR9 }/>
          </LinearGradient>
      </Defs> */}
      {isEnableSparkle ? <Sprakles /> : null}
      <Path
        d={progressPath}
        stroke={'transparent'}
        strokeWidth={arcWidth}
        strokeLinecap={lineCap || globalLineCap}
        fill="transparent"
        {...rest}
      />
    </View>
  );
}
