import Toast from 'react-native-root-toast';
import {
  showMessage,
  hideMessage,
  MessageType,
} from 'react-native-flash-message';

export const showToast = (message: string) => {
  return Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    },
  });
};

interface Args {
  message: string;
  description?: string;
  type: MessageType;
}
export const showAlert = ({ message, description, type }: Args) => {
  const obj: Args = {
    message,
    type,
  };
  if (description) {
    obj.description = description;
  }
  return showMessage(obj);
};
