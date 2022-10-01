import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';
import React from 'react';
import Box from '../Box';
import { COLORS } from '../../constants';

const Paginator = ({ data, scrollX, dotColor }) => {
  const { width } = useWindowDimensions();
  return (
    <Box style={styles.dotContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [6, 30, 6],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.2],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[
              styles.dot,
              { width: dotWidth, opacity, backgroundColor: dotColor },
            ]}
            key={i.toString()}
          />
        );
      })}
    </Box>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    height: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 10,
    marginHorizontal: 8,
  },
});
