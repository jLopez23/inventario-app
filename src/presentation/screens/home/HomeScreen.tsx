import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useAuth} from '../../hooks/useAuth';
import {Button, Icon, Layout, Text} from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../routes/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation}: Props) => {
  const {id, name, email, password} = useSelector(
    ({authUser}: RootState) => authUser,
  );
  const {logout} = useAuth();

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hola {name}</Text>
      <Button
        accessoryLeft={<Icon name="log-out-outline" />}
        onPress={logout}>
        Logout
      </Button>
    </Layout>
  );
};
