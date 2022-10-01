///slider modules/index
import { StyleSheet, Image, Text, Dimensions } from 'react-native';
import { COLORS, assets, FONTS } from '../../../constants';
import React, { useState } from 'react';
import Box from '../../../components/Box';
import { useAppDispatch } from '../../../state';
import { RootState } from '../../../state/rootReducer';
import { setSelectedPlan } from '../../../state/onboarding';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  item: any;
  navigation: any;
  route: any;
};

const SliderItems = ({ item, navigation, route }: Props) => {
  const { selectedPlan } = useSelector(
    (state: RootState) => state.onboarding.selectPlan,
  );
  const [selectPlan, setSelectPlan] = useState(selectedPlan);
  const dispatch = useAppDispatch();
  const { width } = Dimensions.get('window');
  return (
    <Box style={[styles.container]}>
      <Box
        style={[
          {
            backgroundColor: `${item.color}`,
            flex: 0.2,
            width: width - 75,
          },

          item.planId === 2
            ? styles.cardCenter
            : item.planId === 1
            ? styles.cardContainer
            : styles.cardCorner,
        ]}>
        <Box style={styles.cardContent}>
          <Box style={styles.imageContainer}>
            <Text style={styles.id}>{''}</Text>
            <Image source={assets.ChooseYourPlan} style={styles.image} />
          </Box>
          <Box style={styles.OfferContainer}>
            <Image source={assets.OfferCheck} style={styles.offerBg} />
            <Text style={styles.offerText}>{item.offerText}</Text>
          </Box>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.cardText}>{item.description}</Text>
          <Box style={styles.detailContainer}>
            <Box>
              <Text style={styles.heading}>Manage by</Text>
              <Text style={styles.textChild}>{item.manage}</Text>
            </Box>
            <Box>
              <Text style={styles.heading}>Annual by</Text>
              <Text
                style={[styles.textChild, { fontFamily: FONTS.RobotoMedium }]}>
                {item.annual}
              </Text>
            </Box>
          </Box>
        </Box>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectPlan(item.planId);
            dispatch(setSelectedPlan(item.planId));
            if (route?.params?.doItLaterFlag) {
              navigation.navigate('ShowPlanDetails', {
                doItLaterFlag: route?.params?.doItLaterFlag,
              });
            } else {
              navigation.navigate('ShowPlanDetails');
            }
          }}>
          <Box style={styles.goContainer}>
            <Text style={styles.goText}>Select plan</Text>
            <Image source={assets.GoArrow} />
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default SliderItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
    paddingTop: 10,
    maxHeight: 570,
    // backgroundColor: 'aquamarine',
  },
  cardContainer: {
    flex: 1,
    // display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 4,
    // marginBottom: 60,
    width: '110%',
    marginLeft: 30,
    // backgroundColor: 'teal',
  },
  cardCenter: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 4,
    // marginBottom: 60,
    width: '102%',
    // paddingLeft: 10,
    // paddingRight: 10,
    marginLeft: 30,
    marginRight: 20,
    // backgroundColor: 'pink',
  },
  cardCorner: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 4,
    // marginBottom: 60,
    width: '105%',
    marginLeft: 10,
    marginRight: 30,
  },
  image: {
    bottom: 25,
  },
  id: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.green,
    paddingTop: 20,
  },
  imageContainer: {
    width: '100%',
    // backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  OfferContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -20,
  },
  offerText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 24,
    paddingLeft: 10,
    color: COLORS.green,
  },
  offerBg: {
    width: 16,
    height: 16,
  },
  cardContent: {
    marginLeft: 30,
    // backgroundColor: 'pink',
  },
  titleText: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.black,
    paddingTop: 15,
  },
  cardText: {
    width: 250,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 20,
    color: COLORS.black,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 40,
    marginTop: 30,
    marginBottom: 20,
  },
  heading: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  textChild: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black,
  },
  goContainer: {
    // marginTop: 24,
    height: 60,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomEndRadius: 4,
    backgroundColor: COLORS.black,
  },
  goText: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.white,
  },
});
