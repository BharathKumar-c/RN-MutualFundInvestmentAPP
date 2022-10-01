import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import { useAppDispatch } from '../../state';
import {
  setBarStyle,
  setIsEnableHeader,
  setStatusbarColor,
} from '../../state/generalUtil';

interface props {
  visible: boolean;
  handleCloseModal: () => void;
  children?: React.ReactNode;
}

const InfoPopUp = (props: props) => {
  const dispatch = useAppDispatch();
  const { visible, children, handleCloseModal } = props;
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        dispatch(setStatusbarColor('#00000085'));
        dispatch(setBarStyle('dark-content'));
        dispatch(setIsEnableHeader(false));
      } else {
        dispatch(setStatusbarColor('#F2F2EF'));
        dispatch(setBarStyle('dark-content'));
        dispatch(setIsEnableHeader(true));
      }
    }, [visible, dispatch]),
  );

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal} onRequestClose={handleCloseModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.header}>
              <View style={styles.headerContainer}>
                <Text />
                <TouchableOpacity onPress={() => handleCloseModal()}>
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* here goes the children components */}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
  },
  btnText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body3,
    color: COLORS.green,
    paddingVertical: 5,
    paddingRight: 15,
  },
});

export default InfoPopUp;
