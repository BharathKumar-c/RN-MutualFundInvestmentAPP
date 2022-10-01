import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import Box from '../Box';

interface props {
  visible: boolean;
  handleCloseModal: () => void;
  pension?: Pension | null;
}

type Pension = {
  pensionName: string;
  accountNumber: string;
  employer: string;
  potSize: number;
  pensionCompany: string;
  isActive: boolean;
};

const AggregateInfoPopUp = (props: props) => {
  const { visible, pension, handleCloseModal } = props;
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

  const icon = pension?.isActive
    ? assets.GreenCheckedRB
    : assets.GreenUnCheckedRB;

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}>
          <View>
            <View style={styles.header}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.titleContainer}>
                <Text style={styles.titleText}>{pension?.pensionName}</Text>
              </ScrollView>
              <View style={styles.statusContainer}>
                <Image style={styles.statusIcon} source={icon} />
                <Text style={styles.contentHeader}>
                  {pension?.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
          <Box style={styles.contentContainer}>
            <Box style={styles.headerContainer}>
              <Text style={styles.contentHeader}>Account number </Text>

              <Text style={styles.contentHeader}>Employer </Text>

              <Text style={styles.contentHeader}>Pot size </Text>

              <Text style={styles.contentHeader}>Pension company </Text>
            </Box>
            <Box style={{ width: 130, overflow: 'scroll' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.contet}> : {'\t'}</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <Text style={styles.contet}>{pension?.accountNumber}</Text>
                </ScrollView>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.contet}> : {'\t'}</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <Text style={styles.contet}>{pension?.employer}</Text>
                </ScrollView>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.contet}> : {'\t'}</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <Text style={styles.contet}>
                    {'\u20AC'} {pension?.potSize}
                  </Text>
                </ScrollView>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.contet}> : {'\t'}</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <Text style={styles.contet}>{pension?.pensionCompany}</Text>
                </ScrollView>
              </View>
            </Box>
          </Box>
          <Box style={styles.btnContainer}>
            <Text> </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => handleCloseModal()}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </Box>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignSelf: 'center',
    maxWidth: 146,
    overflow: 'scroll',
  },
  titleText: {
    fontFamily: FONTS.RobotoBold,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  headerContainer: {
    paddingVertical: 5,
    maxWidth: 150,
    overflow: 'scroll',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  contentHeader: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body3,
    color: COLORS.black,
    paddingVertical: 5,
  },
  contet: {
    fontFamily: FONTS.RobotoRegular,
    fontSize: SIZES.body3,
    color: COLORS.black,
    textAlign: 'left',
    paddingVertical: 5,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body3,
    color: COLORS.green,
    paddingVertical: 5,
    paddingRight: 15,
  },
});

export default AggregateInfoPopUp;
