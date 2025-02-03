import {useState} from 'react';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';

export const useLoginForm = () => {
  const [emailUser, setEmail] = useState({value: '', error: ''});
  const [passwordUser, setPassword] = useState({value: '', error: ''});

  const validateForm = () => {
    const emailError = emailValidator(emailUser.value);
    const passwordError = passwordValidator(passwordUser.value);

    setEmail({...emailUser, error: emailError});
    setPassword({...passwordUser, error: passwordError});

    return !emailError && !passwordError;
  };

  return {
    emailUser,
    passwordUser,
    setEmail,
    setPassword,
    validateForm,
  };
};