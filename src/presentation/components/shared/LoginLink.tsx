import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from '../../theme/theme';
import {View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParams} from '../../routes/StackNavigator';

interface Props {
  navigation: NavigationProp<RootStackParams>;
}

export const LoginLink = ({navigation}: Props) => (
  <View style={styles.row}>
    <Text>¿Ya tiene una cuenta? </Text>
    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
      <Text style={styles.link}>Login</Text>
    </TouchableOpacity>
  </View>
);
