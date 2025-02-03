import {useState} from 'react';
import {nameValidator} from '../../helpers/nameValidator';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';

export const useRegisterForm = () => {
  const [nameUser, setName] = useState({value: '', error: ''});
  const [emailUser, setEmail] = useState({value: '', error: ''});
  const [passwordUser, setPassword] = useState({value: '', error: ''});

  const validateForm = () => {
    const nameError = nameValidator(nameUser.value);
    const emailError = emailValidator(emailUser.value);
    const passwordError = passwordValidator(passwordUser.value);

    setName({...nameUser, error: nameError});
    setEmail({...emailUser, error: emailError});
    setPassword({...passwordUser, error: passwordError});

    return !nameError && !emailError && !passwordError;
  };

  return {
    nameUser,
    emailUser,
    passwordUser,
    setName,
    setEmail,
    setPassword,
    validateForm,
  };
};