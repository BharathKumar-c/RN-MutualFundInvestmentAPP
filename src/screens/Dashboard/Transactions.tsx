import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AbstractButton } from '../../components';
import { FONTS } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootDrawerParamList } from '../../navigation/DrawerNavigation/types';

const Transactions = ({
  route,
  navigation,
}: NativeStackScreenProps<RootDrawerParamList>) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Transactions</Text>
      <AbstractButton
        buttonStyle={styles.backBtn}
        onPress={() => {
          navigation?.goBack();
        }}
        textStyle={styles.nextBtn}>
        Back
      </AbstractButton>
    </View>
  );
};

const styles = StyleSheet.create({
  nextBtn: {
    fontFamily: FONTS.MerriweatherBold,
    fontSize: 12,
    lineHeight: 14,
  },
  backBtn: {
    marginTop: '4%',
    width: '20%',
    height: '5%',
  },
});
export default Transactions;
