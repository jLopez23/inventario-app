export const passwordValidator = password => {
  if (!password) return "La contraseña no puede estar vacía.";
  if (password.length < 5)
    return 'La contraseña debe tener al menos 5 caracteres.';
  return '';
};
