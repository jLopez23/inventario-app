import {Alert} from 'react-native';

export const printAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};
