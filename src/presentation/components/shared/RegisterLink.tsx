import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from '../../theme/theme';
import {View} from 'react-native';
import {Navigation} from '../../interfaces/navigationsInterface';

export const RegisterLink = ({navigation}: Navigation) => (
  <View style={styles.row}>
    <Text>¿No tienes cuenta? </Text>
    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
      <Text style={styles.link}>Regístrate</Text>
    </TouchableOpacity>
  </View>
);
