import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Logo from '../../components/shared/Logo';
import Header from '../../components/shared/Header';
import Button from '../../components/shared/Button';
import {useRegisterForm} from '../../hooks/useRegisterForm';
import Background from '../../components/shared/Background';
import BackButton from '../../components/shared/BackButton';
import {LoginLink} from '../../components/shared/LoginLink';
import {setAuthUser} from '../../../redux/slices/authUserSlice';
import {Navigation} from '../../interfaces/navigationsInterface';
import {RegisterForm} from '../../components/shared/RegisterForm';
import {LoadingError} from '../../components/shared/LoadingError';
import {AuthService} from '../../../infrastructure/services/authService';

export const RegisterScreen = ({navigation}: Navigation) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    nameUser,
    emailUser,
    passwordUser,
    setName,
    setEmail,
    setPassword,
    validateForm,
  } = useRegisterForm();

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const result = await AuthService.register({
        name: nameUser.value,
        email: emailUser.value,
        password: passwordUser.value,
      });

      if (typeof result === 'string') {
        setError(result);
        return;
      }

      dispatch(setAuthUser(result));
      navigation.navigate('Home');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
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
