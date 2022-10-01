import React from 'react';
import { RootDrawerParamList } from '../DrawerNavigation/types';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { assets, FONTS, SIZES, COLORS } from '../../constants';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DrawerContent from './DrawerContent';
import { routes } from './DrawerRoutes';
import { Background } from 'victory-native';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#B5DFC8',
        drawerHideStatusBarOnOpen: false,
        drawerActiveTintColor: COLORS.black,
        drawerInactiveTintColor: COLORS.black,
        drawerLabelStyle: styles.drawerLabelStyle,
      }}>
      {routes.map(({ name, component, icon, showHeader }) => {
        return (
          <Drawer.Screen
            key={name}
            name={name}
            component={component}
            options={{
              drawerIcon: () => (
                <Image source={icon} style={{ height: 22, width: 22 }} />
              ),
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerLabelStyle: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: '#333333',
  },
});

export default DrawerNavigation;
