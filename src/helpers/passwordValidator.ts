export const passwordValidator = (password: string ) => {
  if (!password) return "La contraseña no puede estar vacía.";
  if (password.length < 5)
    return 'La contraseña debe tener al menos 5 caracteres.';
  return '';
};
