import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Background from '../../components/shared/Background';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import TextInput from '../../components/shared/TextInput';
import BackButton from '../../components/shared/BackButton';
import {theme} from '../../theme/theme';
import {emailValidator} from '../../../helpers/emailValidator';
import {passwordValidator} from '../../../helpers/passwordValidator';
import {nameValidator} from '../../../helpers/nameValidator';
import { Navigation } from '../../interfaces/navigationsInterface';

export const RegisterScreen = ({navigation} : Navigation) => {
  const [name, setName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({...name, error: nameError});
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
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
        value={name.value}
        onChangeText={text => setName({value: text, error: ''})}
        error={!!name.error}
        errorText={name.error}
        description=""
      />
      <TextInput
        label="Correo"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description=""
      />
      <TextInput
        label="Contraseña"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        description=""
      />
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
