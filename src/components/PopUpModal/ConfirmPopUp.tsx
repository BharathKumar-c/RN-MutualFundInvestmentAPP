import React from 'react';
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

interface props {
  visible: boolean;
  handleCloseModal: () => void;
  children?: React.ReactNode;
}

const InfoPopUp = (props: props) => {
  const { visible, children, handleCloseModal } = props;
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
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
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.header}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.MerriweatherRegular,
                    fontSize: SIZES.extraLarge,
                    color: COLORS.black,
                  }}>
                  Info :
                </Text>
                <TouchableOpacity onPress={() => handleCloseModal()}>
                  <Image
                    source={assets.CloseX}
                    style={{ height: 20, width: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

export default InfoPopUp;
