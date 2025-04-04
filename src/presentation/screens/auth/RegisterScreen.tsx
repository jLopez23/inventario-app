import React from 'react';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import {useRegisterForm} from '../../hooks/useRegisterForm';
import Background from '../../components/shared/Background';
import BackButton from '../../components/shared/BackButton';
import {LoginLink} from '../../components/shared/LoginLink';
import {RegisterForm} from '../../components/shared/RegisterForm';
import {LoadingError} from '../../components/shared/LoadingError';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {useAuth} from '../../hooks/useAuth';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {
    nameUser,
    emailUser,
    passwordUser,
    setName,
    setEmail,
    setPassword,
    validateForm,
  } = useRegisterForm();
  const {loading, error, register} = useAuth();

  const handleRegister = async () => {
    if (!validateForm()) return;
    await register({
      name: nameUser.value,
      email: emailUser.value,
      password: passwordUser.value,
    });
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Crear Cuenta</Header>
      <RegisterForm
        nameUser={nameUser}
        emailUser={emailUser}
        passwordUser={passwordUser}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <LoadingError loading={loading} error={error} />
      <Button mode="contained" onPress={handleRegister} style={{marginTop: 24}}>
        Registrarme
      </Button>
      <LoginLink navigation={navigation} />
    </Background>
  );
};
