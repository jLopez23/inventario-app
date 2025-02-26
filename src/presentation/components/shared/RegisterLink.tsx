import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from '../../theme/theme';
import {View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParams} from '../../routes/StackNavigator';

interface Props {
  navigation: NavigationProp<RootStackParams>;
}

export const RegisterLink = ({navigation}: Props) => (
  <View style={styles.row}>
    <Text>¿No tienes cuenta? </Text>
    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
      <Text style={styles.link}>Regístrate</Text>
    </TouchableOpacity>
  </View>
);
