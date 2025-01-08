export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;
  if (!email) return 'El correo electrónico no puede estar vacío.';
  if (!re.test(email))
    return '¡Ups! Necesitamos una dirección de correo electrónico válida.';
  return '';
};
