import React from 'react';
import { useWindowDimensions } from 'react-native';

import {
  VictoryBrushContainer,
  VictoryArea,
  VictoryLine,
  VictoryGroup,
} from 'victory-native';

interface Props {
  setAge: (arg: string) => void;
  retireAge: string;
}

function Chart(props: Props) {
  const { setAge, retireAge } = props;

  const WIDTH = useWindowDimensions().width;
  const HEIGHT = useWindowDimensions().height;

  return (
    <VictoryGroup
      width={WIDTH + 80}
      height={HEIGHT / 1.8}
      containerComponent={
        <VictoryBrushContainer
          // handleWidth={50}
          allowDrag
          allowResize={false}
          // defaultBrushArea="disable"
          brushDomain={{
            x: [parseInt(retireAge), parseInt(retireAge) + 1],
          }}
          onBrushDomainChange={domain => {
            if (domain.x[1]) {
              setAge(Math.round(domain.x[1]).toString());
            }
          }}
          brushStyle={{
            stroke: '#1A6A73',
            fill: '#1A6A73',
          }}
        />
      }>
      {/* <VictoryAxis
          tickValues={[1, 5]}
          tickFormat={['AGE ', 'AGE 80']}
        /> */}
      <VictoryArea
        interpolation="natural"
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 15 },
          { x: 40, y: 27 },
          { x: 45, y: 44 },
          { x: 50, y: 64 },
          { x: 55, y: 90 },
          { x: 60, y: 120 },
          { x: 65, y: 155 },
          { x: 70, y: 192 },
          { x: 75, y: 232 },
          { x: 80, y: 269 },
        ]}
        style={{ data: { fill: '#FADE93' } }}
        //animate={ANIMATE}
      />
      <VictoryLine
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 15 },
          { x: 40, y: 27 },
          { x: 45, y: 44 },
          { x: 50, y: 64 },
          { x: 55, y: 90 },
          { x: 60, y: 120 },
          { x: 65, y: 155 },
          { x: 70, y: 192 },
          { x: 75, y: 232 },
          { x: 80, y: 269 },
        ]}
        interpolation="natural"
        //animate={ANIMATE}
        style={{
          data: { stroke: '#FADE93' },
        }}
      />
      <VictoryArea
        interpolation="natural"
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 10 },
          { x: 40, y: 18 },
          { x: 45, y: 28 },
          { x: 50, y: 41 },
          { x: 55, y: 59 },
          { x: 60, y: 80 },
          { x: 65, y: 107 },
          { x: 70, y: 136 },
          { x: 75, y: 166 },
          { x: 80, y: 202 },
        ]}
        style={{ data: { fill: '#E15B2D' } }}
        //animate={ANIMATE}
      />
      <VictoryLine
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 10 },
          { x: 40, y: 18 },
          { x: 45, y: 28 },
          { x: 50, y: 41 },
          { x: 55, y: 59 },
          { x: 60, y: 80 },
          { x: 65, y: 107 },
          { x: 70, y: 136 },
          { x: 75, y: 166 },
          { x: 80, y: 202 },
        ]}
        interpolation="natural"
        //animate={ANIMATE}
        style={{
          data: { stroke: '#E15B2D' },
        }}
      />
      <VictoryArea
        interpolation="natural"
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 8 },
          { x: 40, y: 11 },
          { x: 45, y: 15 },
          { x: 50, y: 22 },
          { x: 55, y: 30 },
          { x: 60, y: 42 },
          { x: 65, y: 57 },
          { x: 70, y: 76 },
          { x: 75, y: 102 },
          { x: 80, y: 130 },
        ]}
        //animate={ANIMATE}
        style={{ data: { fill: '#78B894' } }}
      />

      <VictoryLine
        data={[
          { x: 30, y: 4 },
          { x: 35, y: 8 },
          { x: 40, y: 11 },
          { x: 45, y: 15 },
          { x: 50, y: 22 },
          { x: 55, y: 30 },
          { x: 60, y: 42 },
          { x: 65, y: 57 },
          { x: 70, y: 76 },
          { x: 75, y: 102 },
          { x: 80, y: 130 },
        ]}
        interpolation="natural"
        //animate={ANIMATE}
        style={{
          data: { stroke: '#78B894' },
        }}
      />
    </VictoryGroup>
  );
}

export default React.memo(Chart);
