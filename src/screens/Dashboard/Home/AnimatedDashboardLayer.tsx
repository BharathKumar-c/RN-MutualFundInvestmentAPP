import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 0;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
};

const AnimatedDashboardLayer = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(({ children }, AnimatedRef) => {
  const translateY = useSharedValue(0);
  //   const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(-SCREEN_HEIGHT / destination, {
      damping: 50,
    });
  }, []);

  useImperativeHandle(AnimatedRef, () => ({ scrollTo }), [scrollTo]);

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan().onStart(() => {
    context.value = { y: translateY.value };
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [24, 24],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          rBottomSheetStyle,
          styles.shadowProp,
        ]}>
        <View />
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH / 1.011,
    backgroundColor: '#F2F2EF',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default AnimatedDashboardLayer;
