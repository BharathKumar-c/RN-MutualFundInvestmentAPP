import React, { useCallback, useEffect, useRef,useState } from 'react';
import { Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { Box } from '../../components';
import { assets, COLORS, FONTS } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  children: any;
  updateAddress: Function;
  userAddress: any;
  setUserAddress: any;
}

function AutoComplete(props: Props) {
  const ref = useRef();
  const { address } = useSelector((state: RootState) => state.onboarding);


  const GOOGLE_PLACES_API_KEY = 'AIzaSyDOXGc7mfWLVog4SLLlIbtbN0nWrvbZ7AY';


 

  useFocusEffect(
    useCallback(() => {
      ref.current?.setAddressText(props?.userAddress);
      // props?.setUserAddress( address)
    }, [props?.userAddress]),
  );


  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Search"
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: 'en',
        components: 'country:ie',
      }}
      onPress={(data, details = null) => {
        console.log({ data, details });
        props.updateAddress(data?.description);
    
      }}
   
      onFail={error => console.error(error)}
      enablePoweredByContainer={false}
      textInputProps={{
        onChangeText: e => {
          if (e && props?.userAddress) {
            e.length <= 1 ? props.setUserAddress('') : props.setUserAddress(e);
          }
        },
        placeholderTextColor: COLORS.gray,
      }}
      renderLeftButton={() => (
        <Box justifyContent="center">
          <Image source={assets.SearchIcon} />
        </Box>
      )}
      styles={{
        container: {},
        textInputContainer: {
          backgroundColor: COLORS.background.primary,
        },
        textInput: {
          fontFamily: FONTS.RobotoRegular,
          fontSize: 16,
          width: '100%',
          borderBottomWidth: 1,
          borderColor: '#0000001a',
          height: 40,
          borderRadius: 5,
          color: COLORS.black,
          padding: 0,
          backgroundColor: COLORS.background.primary,
        },
        row: {
          backgroundColor: '#FFFFFF',
          padding: 13,
          height: 44,
          flexDirection: 'row',
          color: COLORS.black,
        },
        separator: {
          height: 0.5,
          backgroundColor: '#c8c7cc',
        },
        description: {
          color: COLORS.black,
        },
        poweredContainer: {
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          borderColor: '#c8c7cc',
          borderTopWidth: 0,
        },
      }}>
      {props.children}
    </GooglePlacesAutocomplete>
  );
}

export default AutoComplete;
