import {sha256} from 'js-sha256';

export const hashPassword = (password: string, key: string) => {
  const saltedPassword = key + password;
  return sha256(saltedPassword);
};

export const comparePasswords = (
  enteredPassword: string,
  storedHashedPassword: string,
  key: string,
) => {
  const hashedEnteredPassword = hashPassword(enteredPassword, key);
  const isEqual = hashedEnteredPassword === storedHashedPassword;

  return isEqual ? isEqual : 'Correo o contraseña incorrectos';
};
