import React from 'react';
import Slider from 'react-native-slider';
import { COLORS } from '../../constants';

interface Props {
  value: any;
  onValueChange: (a: any) => void;
}

function RetirementSlider(props: Props) {
  const { onValueChange, value } = props;

  return (
    <Slider
      height={100}
      value={value}
      minimumValue={0}
      maximumValue={200000}
      step={10000}
      maximumTrackTintColor={'#D8D6D5'}
      minimumTrackTintColor={COLORS.green}
      thumbTintColor={'#ffff'}
      thumbTouchSize={{ width: 40, height: 40 }}
      thumbStyle={{ width: 30, height: 30, borderRadius: 50 }}
      trackStyle={{ height: 4, borderRadius: 3 }}
      onValueChange={onValueChange}
    />
  );
}

export default React.memo(RetirementSlider);
