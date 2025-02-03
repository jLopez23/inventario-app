import React from 'react';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import TextInput from '../../components/shared/TextInput';
import Background from '../../components/shared/Background';
import {Navigation} from '../../interfaces/navigationsInterface';
import {useAuth} from '../../hooks/useAuth';
import {useLoginForm} from '../../hooks/useLoginForm';
import {LoadingError} from '../../components/shared/LoadingError';
import {RegisterLink} from '../../components/shared/RegisterLink';

export const LoginScreen = ({navigation}: Navigation) => {
  const {emailUser, passwordUser, setEmail, setPassword, validateForm} =
    useLoginForm();
  const {loading, error, login} = useAuth();

  const handleLogin = async () => {
    if (!validateForm()) return;

    const success = await login({
      email: emailUser.value,
      password: passwordUser.value,
    });

    if (success) {
      navigation.navigate('Home');
    }
  };

  return (
    <Background>
      <Logo />
      <Header>InventarioApp</Header>
      <TextInput
        label="Correo"
        returnKeyType="next"
        value={emailUser.value}
        onChangeText={(text: string) => setEmail({value: text, error: ''})}
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
        onChangeText={(text: string) => setPassword({value: text, error: ''})}
        error={!!passwordUser.error}
        errorText={passwordUser.error}
        secureTextEntry
        description=""
      />
      <LoadingError loading={loading} error={error} />
      <Button mode="contained" onPress={handleLogin} style={{}}>
        Login
      </Button>
      <RegisterLink navigation={navigation} />
    </Background>
  );
};
