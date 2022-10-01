import React, { useCallback, useRef, useMemo, Children, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS, SIZES } from '../../constants';
import Box from '../Box';
import { useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { useAppDispatch } from '../../state';
import {
  setBarStyle,
  setHeaderColor,
  setStatusbarColor,
} from '../../state/generalUtil';

interface Props {
  snapPoint?: any;
  children?: any;
  openBSheet: boolean;
  setSheetState?: any;
  backgroundStyle?: any;
  enablePanDownToClose?: boolean;
}

const CustomBottomSheet = (props: Props) => {
  const {
    snapPoint,
    openBSheet,
    setSheetState,
    backgroundStyle,
    enablePanDownToClose,
    children,
  } = props;
  const dispatch = useAppDispatch();

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [snapPoint], []);

  // callbacks
  // const handleSheetChange = useCallback(index => {
  //   console.log('handleSheetChange', index);
  // }, []);

  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setSheetState(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (openBSheet) {
        handleSnapPress(0);
      } else {
        handleClosePress();
      }
    }, [openBSheet]),
  );

  useBackHandler(
    useCallback(() => {
      sheetRef.current?.close();
      setSheetState(false);
      return true;
    }, []),
  );

  return (
    <>
      {openBSheet && (
        <TouchableOpacity
          style={[
            Platform.OS === 'ios' ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
          onPress={handleClosePress}
        />
      )}
      <>
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          // onChange={()=>{setSheetState(false)}}
          enablePanDownToClose={
            enablePanDownToClose ? enablePanDownToClose : false
          }
          backgroundStyle={
            backgroundStyle ? backgroundStyle : styles.backgroundStyle
          }>
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}>
            {children}
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: COLORS.background.primary,
    borderColor: COLORS.gray,
    borderWidth: 2,
  },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: COLORS.background.primary,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
  iOSBackdrop: {
    backgroundColor: COLORS.background.primary,
    opacity: 0.5,
  },
  androidBackdrop: {
    backgroundColor: COLORS.background.primary,
    opacity: 0.52,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContainer: {
    height: SIZES.screen_height,
    width: SIZES.screen_width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomBottomSheet;
