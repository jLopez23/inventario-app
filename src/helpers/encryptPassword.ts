import {sha256} from 'js-sha256';
import { ENCRYP_KEY } from '../constants/app';

export const hashPassword = (password: string) => {
  const saltedPassword = ENCRYP_KEY + password;
  return sha256(saltedPassword);
};

export const comparePasswords = (
  enteredPassword: string,
  storedHashedPassword: string,
) => {
  const hashedEnteredPassword = hashPassword(enteredPassword);
  const isEqual = hashedEnteredPassword === storedHashedPassword;

  return isEqual ? isEqual : 'Correo o contraseña incorrectos';
};
