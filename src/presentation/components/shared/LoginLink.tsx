import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from '../../theme/theme';
import {View} from 'react-native';
import {Navigation} from '../../interfaces/navigationsInterface';

export const LoginLink = ({navigation}: Navigation) => (
  <View style={styles.row}>
    <Text>¿Ya tiene una cuenta? </Text>
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Text style={styles.link}>Login</Text>
    </TouchableOpacity>
  </View>
);
