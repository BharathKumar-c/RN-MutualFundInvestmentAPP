import React, { useCallback, useMemo } from 'react';
import { useWindowDimensions, Image, StyleSheet } from 'react-native';
import { Svg, Text } from 'react-native-svg';

import {
  VictoryGroup,
  Box,
  VictoryBar,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';
import { assets, COLORS, FONTS } from '../../constants';

interface Props {
  barClick: (arg: string) => void;
  age: number;
}

function BarChart(props: Props) {
  const { barClick, age } = props;

  const WIDTH = useWindowDimensions().width;
  const HEIGHT = useWindowDimensions().height;

  const calculateAge = useCallback(age => {
    let countAge = age;
    const arr = [age];
    const linear = (80 - age) / 4;
    while (countAge < 80) {
      countAge = Math.round(countAge + linear);
      if (countAge < 80) {
        arr.push(countAge);
      } else {
        arr.push(80);
      }
    }
    return arr;
  }, []);

  const ageArr = useMemo(
    () => (age ? calculateAge(age) : [18, 60, 64, 72, 80]),
    [age],
  );

  const graphData = {
    age: [
      { x: 'Age 18', y: 4 },
      { x: '60', y: 3 },
      { x: '64', y: 2 },
      { x: '72', y: 1 },
      { x: '72', y: 0 },
    ],
  };
  const getBarColors = useCallback((y: number) => {
    switch (y) {
      case 4:
        return '#2B7972';
      case 2:
        return '#83B9B4';
      case 3:
        return '#479A93';
      case 1:
        return '#9dc8c4';
      default:
        return 'grey';
    }
  }, []);

  return (
    <>
      {/* <VictoryChart> */}
      <Svg width={WIDTH} height={HEIGHT / 2.5}>
        <VictoryGroup>
          <VictoryBar
            // domain={{ x: [0.5, 4.5] }}
            domainPadding={{ x: 50 }}
            alignment="middle"
            barWidth={WIDTH / 5.5}
            height={HEIGHT / 2.5}
            // labels={datum => `${datum.datum.y}`}
            data={graphData.age}
            animate={{
              duration: 200,
              onLoad: { duration: 800 },
            }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryLabel dy={30} />}
            style={{
              data: {
                fill: ({ datum }) => getBarColors(datum.y),
              },
              labels: {
                fontFamily: FONTS.MerriweatherBold,
                fontSize: 16,
                lineHeight: 18,
                fill: COLORS.white,
              },
            }}
          
            events={[
              {
                target: 'data',
                eventHandlers: {
                
                  onPressIn: props => {
                    return [
                      {
                        mutation: props => {
                    
                          barClick(props);
                        },
                      },
                    ];
                  },
                },
              
              },
            ]}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={50}
            y={270}
            style={styles.xLabels}
            text={`Age ${ageArr[0]}`}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={WIDTH / 3}
            y={270}
            style={styles.xLabels}
            text={`${ageArr[1]}`}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={WIDTH / 2}
            y={270}
            style={styles.xLabels}
            text={`${ageArr[2]}`}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={WIDTH / 1.5}
            y={270}
            style={styles.xLabels}
            text={`${ageArr[3]}`}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={WIDTH / 1.17}
            y={270}
            style={styles.xLabels}
            text={`${ageArr[4]}`}
            
          />
          {/* <VictoryAxis
            label="Age"
            // width={WIDTH}
            style={{
              tickLabels: {
                fontSize: 22,
                stroke: 'red',
              },
            }}
            tickValues={[18, 60, 64, 80]}
            domain={[10, 80]}
            // style={{ axis: { stroke: 'red' } }}
            crossAxis={false}
            // tickValues={[0, 45, 90, 135, 180]}
            // tickFormat={() => ''}
          /> */}
        </VictoryGroup>
      </Svg>
      {/* </VictoryChart> */}
    </>
  );
}

const styles = StyleSheet.create({
  xLabels: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 10,
    lineHeight: 18,
    color: COLORS.green,
    fill: COLORS.green,
  },
  insideBar: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 16,
    lineHeight: 18,
    color: COLORS.white,
    fill: COLORS.white,
  },
});

export default React.memo(BarChart);
