import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, assets, FONTS, SIZES } from '../constants';
import Clipboard from '@react-native-clipboard/clipboard';

interface Props {
  setPinReady: any;
  code: any;
  setCode: any;
  maxLength: any;
  editable: any;
}

const OTPInputFields = (Props: Props) => {
  const { setPinReady, code, setCode, maxLength, editable } = Props;
  const codeDigitsArray = new Array(maxLength).fill(0);

  // Monitering input focus
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);
  const [IsEnableTootTip, setIsEnableTootTip] = useState(false);

  // Ref for the text input
  const textInputRef = useRef<any>(null);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();

    /* Check the clipboard have copy content */
    Clipboard.getString()
      .then(content => {
        if (content && content.length > 0) {
          setIsEnableTootTip(!IsEnableTootTip);
        }
      })
      .catch(e => {
        console.log('incorrect code');
      });
  };

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

  const handlePaste = async () => {
    Clipboard.getString()
      .then(content => {
        if (content && content.length > 0) {
          setCode(content);
          Clipboard.setString('');
        }
      })
      .catch(e => {
        console.log('incorrect code');
      });
    setIsEnableTootTip(false);
  };

  useEffect(() => {
    // update pin ready value
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  const toCodeDigitInput = (_value: any, index: any) => {
    const emptyInputChar = '';
    const digit = code[index] || emptyInputChar;

    // Formatting
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocussed = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <View
        style={
          inputContainerIsFocused && isDigitFocussed
            ? styles.OtpInputFocussed
            : styles.OtpInput
        }
        key={index}>
        <Text style={styles.OtpInputText}>{digit}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.OtpInputSection}>
        {IsEnableTootTip && (
          <>
            {/* Start: Tooltip */}
            <View style={styles.talkBubble}>
              <TouchableOpacity onPress={handlePaste}>
                <View style={styles.talkBubbleSquare}>
                  <Text style={styles.talkBubbleMessage}>Paste</Text>
                </View>
                <View style={styles.talkBubbleTriangle} />
              </TouchableOpacity>
            </View>
            {/* End: Tooltip */}
          </>
        )}
        {/* <Text style={styles.titleText}>Enter email OTP</Text> */}
        <Pressable style={styles.OtpInputContainer} onPress={handleOnPress}>
          {codeDigitsArray.map(toCodeDigitInput)}
        </Pressable>
        {/* Hidden Text Field but its main reference TextInput Field */}
        <TextInput
          style={styles.HiddenTextInput}
          editable={editable}
          value={code}
          onChangeText={setCode}
          maxLength={maxLength}
          keyboardType="number-pad"
          returnKeyType="done"
          textContentType="oneTimeCode"
          ref={textInputRef}
          onBlur={handleOnBlur}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  talkBubble: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 2, // <- zIndex here
    flex: 1,
    left: 2,
    bottom: 60,
  },
  talkBubbleSquare: {
    backgroundColor: COLORS.black,
    borderRadius: 10,
  },
  talkBubbleTriangle: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.black,
  },
  talkBubbleMessage: {
    color: '#FFFFFF',
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.padding2,
  },
  OtpInputContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  OtpInput: {
    borderBottomWidth: 1,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  OtpInputFocussed: {
    borderBottomWidth: 1,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomColor: '#1A6A73',
  },
  OtpInputText: {
    fontFamily: FONTS.RobotoBold,
    color: COLORS.black,
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'left',
    letterSpacing: 0,
  },
  OtpInputSection: {
    marginTop: 40,
  },
  HiddenTextInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
export default OTPInputFields;
