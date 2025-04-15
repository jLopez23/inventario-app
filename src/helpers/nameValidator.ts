export const nameValidator = (name: string) => {
  // Verifica si el nombre está vacío o solo contiene espacios
  if (!name || name.trim() === '') return 'El nombre no puede estar vacío.';
  return '';
};
