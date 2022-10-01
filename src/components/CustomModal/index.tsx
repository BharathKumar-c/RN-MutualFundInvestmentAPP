import React, { useCallback, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Box } from '../../components';
import { COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../../state';
import {
  setBarStyle,
  setIsEnableHeader,
  setStatusbarColor,
} from '../../state/generalUtil';

interface Props {
  modalVisible?: boolean;
  setModalVisible?: any;
  children?: any;
  navigation?: any;
  backDropClickClose?: any;
  backHandlerMethod?: any;
}

const CustomModal = (props: Props) => {
  const {
    modalVisible,
    setModalVisible,
    navigation,
    backDropClickClose,
    backHandlerMethod,
    children,
  } = props;
  const dispatch = useAppDispatch();

  useBackHandler(
    useCallback(() => {
      console.log('backpress');

      navigation.goBack();
      return true;
    }, [navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      if (modalVisible) {
        dispatch(setStatusbarColor('#00000047'));
        dispatch(setBarStyle('dark-content'));
      } else {
        dispatch(setStatusbarColor('#F2F2EF'));
        dispatch(setBarStyle('dark-content'));
      }
    }, [modalVisible, dispatch]),
  );

  const handleModalClose = () => {
    if (setModalVisible && backDropClickClose) {
      setModalVisible(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        if (backHandlerMethod) {
          setModalVisible(!modalVisible);
          backHandlerMethod();
        } else {
          setModalVisible(!modalVisible);
        }
      }}>
      <Box style={styles.popupContainer}>
        <TouchableOpacity
          style={[
            Platform.OS === 'ios' ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
          onPress={handleModalClose}
        />
        <Box style={styles.popupInnerContainer}>{children}</Box>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeCircleIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    fontSize: 24,
    color: COLORS.green,
    opacity: 0.8,
    right: -4,
    top: -4,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupInnerContainer: {
    position: 'absolute',
    paddingVertical: SIZES.padding * 1.05,
    paddingHorizontal: SIZES.padding * 1.1,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#EDEAE7',
    position: 'absolute',
    shadowColor: '#52006A',
    elevation: 5,
  },
  iOSBackdrop: {
    backgroundColor: COLORS.black,
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: '#232f34',
    opacity: 0.32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CustomModal;
