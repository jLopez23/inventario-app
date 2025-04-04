export const passwordValidator = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!password) return 'La contraseña no puede estar vacía.';
  if (password.length < 5)
    return 'La contraseña debe tener al menos 5 caracteres.';
  if (!regex.test(password))
    return 'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.';
  return '';
};
