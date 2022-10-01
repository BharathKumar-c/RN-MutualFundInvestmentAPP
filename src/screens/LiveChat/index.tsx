import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { setBarStyle, setStatusbarColor } from '../../state/generalUtil';
import { useAppDispatch } from '../../state';
import { Box } from '../../components';
import { assets, COLORS, FONTS, SIZES } from '../../constants';
import {
  GiftedChat,
  Bubble,
  Time,
  Message,
  Send,
} from 'react-native-gifted-chat';

type messageType = {
  _id: number;
  text: string;
  createdAt: Date;
  user: user;
};
type user = {
  _id: number;
  name: string;
  avatar: string;
};
const LiveChat = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<messageType[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello we’re happy to help. However, encourage you to first explore the following list of frequently asked questions. Search on help center',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: assets.ChatM,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderBubble = useCallback(props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.msgContainer,
          left: styles.msgContainer,
        }}
        textStyle={{
          right: styles.msgText,
          left: styles.msgText,
        }}
      />
    );
  }, []);

  const renderTime = useCallback(props => {
    return (
      <Time
        {...props}
        // containerStyle={{ left: { alignSelf: 'flex-end', flex: 1 } }}
        timeTextStyle={{
          left: styles.timeText,
          right: styles.timeText,
        }}
      />
    );
  }, []);

  const renderSend = useCallback(props => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Image source={assets.SendButton} resizeMode="contain" />
        </View>
      </Send>
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(setStatusbarColor('#F2F2EF'));
      dispatch(setBarStyle('dark-content'));
    }, [dispatch]),
  );
  useBackHandler(
    useCallback(() => {
      navigation.goBack();
      return true;
    }, []),
  );
  return (
    <Box style={styles.body}>
      <Box style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={assets.BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Box style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Live Chat</Text>
        </Box>
      </Box>
      <Box style={styles.infoBox}>
        <Box style={styles.infoContainer}>
          <Text style={styles.infoTitle}> Chat with us</Text>
          <Text style={styles.infoDescription}>
            typically replies in 5 mins
          </Text>
        </Box>
        <Box style={styles.imageContainer}>
          <Image source={assets.Chat1} style={styles.chatIcon} />
          <Image source={assets.Chat2} style={styles.chatIcon} />
          <Image source={assets.Chat3} style={styles.chatIcon} />
          <Image source={assets.Chat4} style={styles.chatIcon} />
          <Text style={styles.remainingChats}>+2</Text>
        </Box>
      </Box>
      <GiftedChat
        messages={messages}
        alignTop={true}
        onSend={messages => onSend(messages)}
        renderBubble={props => renderBubble(props)}
        renderTime={props => renderTime(props)}
        renderSend={props => renderSend(props)}
        placeholder={'type your message..'}
        textInputStyle={styles.textInput}
        renderAvatarOnTop={true}
        // renderSend(props) {
        //     return (
        //         <Send
        //             {...props}
        //         >
        //             <View style={{marginRight: 10, marginBottom: 5}}>
        //                 <Image source={require('../../assets/send.png')} resizeMode={'center'}/>
        //             </View>
        //         </Send>
        //     );
        // }
        parsePatterns={linkStyle => [
          { type: 'phone', style: linkStyle, onPress: () => {} },
          {
            pattern: /#(\w+)/,
            style: { ...styles.hashtag },
            onPress: () => {},
          },
          {
            pattern: /Search on help center/,
            style: styles.helpCenterText,
            onPress: () => {
              navigation.navigate('HelpCenter');
            },
          },
        ]}
        user={{
          _id: 1,
        }}
      />
    </Box>
  );
};

export default LiveChat;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 20,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    width: '80%',
  },
  screenTitle: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.h2,
    color: COLORS.black,
  },
  infoBox: {
    height: 100,
    padding: 10,
    margin: 20,
    borderRadius: 15,
    backgroundColor: '#D1D8D1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    left: 20,
  },
  chatIcon: {
    width: 45,
    height: 45,
    marginLeft: -10,
  },
  remainingChats: {
    color: COLORS.green,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body3,
    right: 35,
  },
  infoTitle: {
    fontFamily: FONTS.PlayfairDisplayBold,
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  infoDescription: {
    color: COLORS.black,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body5,
    opacity: 0.7,
    marginLeft: 5,
    padding: 2,
  },
  msgContainer: {
    maxWidth: 250,
    borderRadius: 10,
    backgroundColor: '#EDEAE7',
  },
  msgText: {
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body4,
    color: COLORS.black,
  },
  textInput: {
    margin: 10,
    borderRadius: 5,
    fontFamily: FONTS.MerriweatherRegular,
    fontSize: SIZES.body4,
    color: COLORS.black,
  },
  hashtag: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.danger,
    fontSize: SIZES.body4,
  },
  helpCenterText: {
    fontFamily: FONTS.MerriweatherBold,
    color: COLORS.green,
    fontSize: SIZES.body4,
    lineHeight: SIZES.h2,
  },
  timeText: {
    color: COLORS.green,
    fontSize: SIZES.body5,
    fontFamily: FONTS.RobotoRegular,
  },
});
