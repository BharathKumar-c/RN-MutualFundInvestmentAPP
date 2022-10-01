import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CollapsibleLib from 'react-native-collapsible';
import { COLORS, FONTS } from '../../constants';
import ProgressBar from 'react-native-animated-progress';

interface Props {
  title: string;
  value: any[];
}

function Collapsible({ title, value }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleExpanded = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleExpanded}>
        <View style={styles.header}>
          <Text style={styles.accordianSubHead}>{title}</Text>
        </View>
      </TouchableOpacity>
      <CollapsibleLib collapsed={collapsed}>
        <View style={styles.content}>
          {value?.map((item: any, index: React.Key | null | undefined) => {
            return (
              <View key={index} style={styles.dropDown}>
                <View style={{ flexGrow: 1 }}>
                  <View style={styles.percentage}>
                    <Text style={styles.percentageText}>{item.name}</Text>
                    <Text style={styles.percentageText}>
                      {item.weight.toFixed(2)} %
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      height={4}
                      progress={item.weight}
                      trackColor="#D6D6D6"
                      backgroundColor="#1A6A73"
                      animated={true}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </CollapsibleLib>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingLeft: 10,
    marginBottom: 2,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
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
  dropDown: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
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
  progressContainer: {
    width: '100%',
    paddingVertical: 5,
  },
});

export default React.memo(Collapsible);
