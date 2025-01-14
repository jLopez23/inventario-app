import React, {useState} from 'react';
import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {theme} from '../../theme/theme';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import {userLogin} from '../../../helpers/userLogin';
import TextInput from '../../components/shared/TextInput';
import Background from '../../components/shared/Background';
import {emailValidator} from '../../../helpers/emailValidator';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {setAuthUser} from '../../../redux/slices/authUserSlice';
import {Navigation} from '../../interfaces/navigationsInterface';
import { comparePasswords } from '../../../helpers/encryptPassword';
import {passwordValidator} from '../../../helpers/passwordValidator';

export const LoginScreen = ({navigation}: Navigation) => {
  const dispatch = useDispatch();
  const [emailUser, setEmail] = useState({value: '', error: ''});
  const [passwordUser, setPassword] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLoginPressed = async () => {
    const email = emailUser.value;
    const password = passwordUser.value;

    const emailError = emailValidator(email);
    const passwordError = passwordValidator(passwordUser.value);
    if (emailError || passwordError) {
      setEmail({...emailUser, error: emailError});
      setPassword({...passwordUser, error: passwordError});
      setLoading(false);
      return;
    }

    setError('');
    setLoading(true);
    const user = await userLogin(email);
    if (typeof user === 'string') {
      setError(user);
      setLoading(false);
      return;
    }
    const matchingPasswords = await comparePasswords(password, user.password);

    if (typeof matchingPasswords === 'string') {
      setError(matchingPasswords);
      setLoading(false);
      return;
    }

    dispatch(
      setAuthUser({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    );
    setLoading(false);
    navigation.navigate('Home');
  };

  return (
    <Background>
      <Logo />
      <Header>InventarioApp</Header>
      <TextInput
        label="Correo"
        returnKeyType="next"
        value={emailUser.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!emailUser.error}
        errorText={emailUser.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description=""
      />
      <TextInput
        label="Contraseña"
        returnKeyType="done"
        value={passwordUser.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!passwordUser.error}
        errorText={passwordUser.error}
        secureTextEntry
        description=""
      />
      <View style={styles.row}>
        <Text>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}{' '}
        </Text>
        <Text>{error && <Text style={{color: 'red'}}>{error}</Text>} </Text>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>¿No tiene cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
