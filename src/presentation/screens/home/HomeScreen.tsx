import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export const HomeScreen = () => {
  const {id, name, email, password} = useSelector(
    ({authUser}: RootState) => authUser,
  );
  console.log('ValorUser', id, name, email, password);
  return (
    <View>
      <Text>Hola {name}</Text>
    </View>
  );
};
