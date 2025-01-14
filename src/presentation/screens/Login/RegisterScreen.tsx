import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {theme} from '../../theme/theme';
import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import {userLogin} from '../../../helpers/userLogin';
import TextInput from '../../components/shared/TextInput';
import Background from '../../components/shared/Background';
import BackButton from '../../components/shared/BackButton';
import {nameValidator} from '../../../helpers/nameValidator';
import {hashPassword} from '../../../helpers/encryptPassword';
import {emailValidator} from '../../../helpers/emailValidator';
import {setAuthUser} from '../../../redux/slices/authUserSlice';
import {Navigation} from '../../interfaces/navigationsInterface';
import {userRegistration} from '../../../helpers/userRegistration';
import {passwordValidator} from '../../../helpers/passwordValidator';

export const RegisterScreen = ({navigation}: Navigation) => {
  const dispatch = useDispatch();
  const [nameUser, setName] = useState({value: '', error: ''});
  const [emailUserR, setEmail] = useState({value: '', error: ''});
  const [passwordUserR, setPassword] = useState({value: '', error: ''});
  const [loadingR, setLoadingR] = useState(false);
  const [errorR, setErrorR] = useState('');

  const onSignUpPressed = async () => {
    const name = nameUser.value;
    const email = emailUserR.value;
    let password = passwordUserR.value;
    const nameError = nameValidator(name);
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    if (emailError || passwordError || nameError) {
      setName({...nameUser, error: nameError});
      setEmail({...emailUserR, error: emailError});
      setPassword({...passwordUserR, error: passwordError});
      return;
    }
    setErrorR('');
    setLoadingR(true);
    const user = await userLogin(email);
    if (typeof user !== 'string') {
      setErrorR('El usuario ya existe');
      setLoadingR(false);
      return;
    }
    password = hashPassword(password);
    const createUser = await userRegistration({
      name,
      email,
      password,
    });
    if (typeof createUser === 'string') {
      setErrorR(createUser);
      setLoadingR(false);
      return;
    }

    const userCreated = await userLogin(email);
    dispatch(
      setAuthUser({
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        password: userCreated.password,
      }),
    );
    setLoadingR(false);
    navigation.navigate('Home');
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Crear Cuenta</Header>
      <TextInput
        label="Nombre"
        returnKeyType="next"
        value={nameUser.value}
        onChangeText={text => setName({value: text, error: ''})}
        error={!!nameUser.error}
        errorText={nameUser.error}
        description=""
      />
      <TextInput
        label="Correo"
        returnKeyType="next"
        value={emailUserR.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!emailUserR.error}
        errorText={emailUserR.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description=""
      />
      <TextInput
        label="Contraseña"
        returnKeyType="done"
        value={passwordUserR.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!passwordUserR.error}
        errorText={passwordUserR.error}
        secureTextEntry
        description=""
      />
      <View style={styles.row}>
        <Text>
          {loadingR && <ActivityIndicator size="large" color="#0000ff" />}{' '}
        </Text>
        <Text>{errorR && <Text style={{color: 'red'}}>{errorR}</Text>} </Text>
      </View>
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{marginTop: 24}}>
        Registrarme
      </Button>
      <View style={styles.row}>
        <Text>¿Ya tiene una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
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
