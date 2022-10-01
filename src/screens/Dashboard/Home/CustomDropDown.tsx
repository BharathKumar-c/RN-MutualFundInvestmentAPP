import { CommonActions } from '@react-navigation/native';
import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, FONTS } from '../../../constants';
import { clearUserData, removeAccessToken } from '../../../service/AuthService';

interface Props {
  label: string;
  data: Array<{ label: string; value: string }>;
  onSelect: (item: { label: string; value: string }) => void;
  children: any;
  navigation: any;
}

const CustomDropDown: FC<Props> = ({
  label,
  data,
  onSelect,
  children,
  navigation,
}) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    setVisible(true);
  };

  const handleLogout = async () => {
    await removeAccessToken();
    clearUserData();
    navigation.replace('Splash');
  };

  const onItemPress = (item: any): void => {
    if (item.label === 'Logout') {
      startAnimate();
      handleLogout();
      setVisible(false);
    } else {
      navigation.navigate(item.route);
      setVisible(false);
    }
  };
  const moveAnim = useRef(new Animated.Value(0)).current;
  const startAnimate = () => {
    Animated.spring(moveAnim, {
      toValue: 190,
      duration: 1000,
      friction: 4,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={{ color: COLORS.lightGray }}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}>
          <Animated.View style={[styles.dropdown, { translateY: moveAnim }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity ref={DropdownButton} onPress={toggleDropdown}>
      {renderDropdown()}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 50,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: '25%',
    right: '5%',
    top: Platform.OS === 'ios' ? '15%' : '12%',
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    backgroundColor: '#F2F2EF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 4,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.black,
  },

  itemText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: '#333333',
  },
});

export default CustomDropDown;
