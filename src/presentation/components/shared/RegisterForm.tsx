import React from 'react';
import TextInput from './TextInput';

interface RegisterFormProps {
  nameUser: { value: string; error: string };
  emailUser: { value: string; error: string };
  passwordUser: { value: string; error: string };
  setName: (name: { value: string; error: string }) => void;
  setEmail: (email: { value: string; error: string }) => void;
  setPassword: (password: { value: string; error: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  nameUser,
  emailUser,
  passwordUser,
  setName,
  setEmail,
  setPassword,
}) => (
  <>
    <TextInput
      label="Nombre"
      returnKeyType="next"
      value={nameUser.value}
      onChangeText={(text: string) => setName({value: text, error: ''})}
      error={!!nameUser.error}
      errorText={nameUser.error}
      description=""
    />
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
  </>
);
