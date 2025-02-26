import {PropsWithChildren, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../routes/StackNavigator';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

export const AuthProvider = ({children}: PropsWithChildren) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const {id} = useSelector(({authUser}: RootState) => authUser);

  useEffect(() => {
    if (id !== 0) {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    }
  }, [id, navigation]);

  return <>{children}</>;
};
