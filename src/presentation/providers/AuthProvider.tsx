import {PropsWithChildren, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../routes/StackNavigator';
import {useAuth} from '../hooks/useAuth';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

export const AuthProvider = ({children}: PropsWithChildren) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const {checkStatus} = useAuth();
  const {status} = useSelector(({authUser}: RootState) => authUser);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (status !== 'checking') {
      if (status === 'authenticated') {
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
    }
  }, [status, navigation]);

  return <>{children}</>;
};
