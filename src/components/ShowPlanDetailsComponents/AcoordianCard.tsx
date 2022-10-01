import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import Svg from 'react-native-svg';
import { VictoryLabel, VictoryPie } from 'victory-native';
import { assets, COLORS, FONTS } from '../../constants';
import Collapsible from './Collapsible';

interface Props {
  splitUp: any;
  riskLevel: number;
}

function AccordianCard(props: Props) {
  const { splitUp, riskLevel } = props;
 

  return (
    <>
      <View>
        <View style={styles.displayCard}>
          <View style={styles.accordianContainer}>
            <View style={styles.circle}>
              <Svg
                width={200}
                height={200}
                style={{ marginLeft: 10, marginTop: -20 }}>
                <VictoryPie
                  standalone={false}
                  width={200}
                  height={200}
                  innerRadius={45}
                  labels={() => null}
                  padAngle={2}
                  data={splitUp?.pie}
                  cornerRadius={2}
                  animate={{
                    duration: 300,
                    onLoad: { duration: 1000 },
                    // easing: 'linear',
                  }}
                  colorScale={splitUp?.colors}
                  // data={sampleData}
                />
                <VictoryLabel
                  textAnchor="middle"
                  verticalAnchor="middle"
                  x={100}
                  y={100}
                  text={riskLevel}
                  style={styles.insideCircle}
                />
              </Svg>
            </View>
            <View style={styles.cardHeader}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.accordianTitle}>Level {riskLevel}</Text>
                <Image
                  style={{ width: 11, height: 11, marginLeft: 7 }}
                  source={assets.StarGreen}
                />
              </View>
              <Text style={styles.accordianSubHead}>age 18-59</Text>
              <View style={{ paddingTop: 10 }}>
                {splitUp?.category?.map(
                  (item: any, index: React.Key | null | undefined) => {
                    return (
                      <View key={index} style={styles.subCategoryContainer}>
                        <Text
                          style={[
                            { backgroundColor: item.color },
                            styles.categoryDots,
                          ]}
                        />
                        <Text
                          style={styles.categoryText}>{`${item.value.toFixed(
                          2,
                        )}% ${item.name}`}</Text>
                      </View>
                    );
                  },
                )}
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.accordianDescription}>
              It aims to grow your pension savings early and reduce risk as you
              near retirement.
            </Text>
          </View>

          <Collapsible
            value={splitUp?.majorMarketSectors || []}
            title="INDUSTRIES"
          />
          <Collapsible
            value={splitUp?.topHoldings || []}
            title={`TOP HOLDINGS (${
              splitUp?.topHoldings &&
              Array.isArray(splitUp?.topHoldings) &&
              splitUp?.topHoldings.length
            })`}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  displayCard: {
    flexGrow: 1,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    borderStyle: 'solid',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  accordianContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  circle: {
    width: 190,
    height: 160,
    // paddingLeft: 30,
    right: 20,
    textAlign: 'center',
    color: COLORS.black,
    // backgroundColor: 'green',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  accordianTitle: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black,
  },
  accordianSubHead: {
    fontFamily: FONTS.MerriweatherBold,
    textTransform: 'uppercase',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    color: COLORS.green,
    paddingTop: 5,
  },
  subCategoryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  categoryDots: {
    width: 10,
    height: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  categoryText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    color: COLORS.black,
  },
  accordianDescription: {
    width: 300,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'left',
    color: COLORS.black,
    padding: 10,
    marginBottom: 10,
    marginLeft: 25,
  },
  dropDown: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  categoryIcon: {
    width: 18,
    height: 20,
    marginRight: 20,
  },
  percentage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  percentageText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    color: COLORS.black,
  },
  insideCircle: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.black,
  },
});

export default React.memo(AccordianCard);
