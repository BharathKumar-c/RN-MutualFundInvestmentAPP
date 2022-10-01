// In App.js in a new project

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import Navigation from './navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { checkAndUpdateBiometricAvailability } from './service/UtilService';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useSelector } from 'react-redux';
import { RootState } from './state';
import FlashMessage from 'react-native-flash-message';
import { COLORS } from './constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  useEffect(() => {
    checkAndUpdateBiometricAvailability();
  }, []);

  const { statusbarColor, translucent, barStyle, safeAreaViewEdges } =
    useSelector((state: RootState) => state.generalUtil);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            {
              backgroundColor: statusbarColor
                ? statusbarColor
                : COLORS.background.primary,
            },
            styles.container,
          ]}
          edges={safeAreaViewEdges}>
          <StatusBar
            backgroundColor={
              statusbarColor ? statusbarColor : COLORS.background.primary
            }
            barStyle={barStyle ? barStyle : 'dark-content'}
            translucent={translucent ? true : false}
          />
          <RootSiblingParent>
            <Navigation />
          </RootSiblingParent>
          <FlashMessage position="top" />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
