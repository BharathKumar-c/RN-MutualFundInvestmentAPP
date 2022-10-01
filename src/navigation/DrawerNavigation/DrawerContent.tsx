import React from 'react';
import { assets, FONTS, SIZES, COLORS } from '../../constants';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import UserAvatar from 'react-native-user-avatar';

const DrawerContent = (props: any) => {
  const { firstName, lastName, profilePhoto } = useSelector(
    (state: RootState) => state.onboarding,
  );

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}>
        <View style={{ padding: 20 }}>
          {profilePhoto.url ? (
            <Image
              source={
                profilePhoto.url
                  ? { uri: profilePhoto.url }
                  : assets.DashboardAvatar
              }
              style={styles.avatar}
            />
          ) : (
            <UserAvatar
              bgColor={COLORS.green}
              size={50}
              style={styles.avatar}
              name={firstName ? `${firstName} ${lastName}` : ''}
            />
          )}
          <Text style={styles.avatarText}>{`${firstName} ${lastName}`}</Text>
        </View>
        <View style={styles.drawerItemList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.background.primary,
    color: COLORS.black,
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 40,
    marginBottom: 15,
  },
  avatarText: {
    color: COLORS.black,
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.32,
    textTransform: 'capitalize',
  },
  drawerItemList: {
    flex: 1,
    paddingTop: 10,
  },
});

export default DrawerContent;
