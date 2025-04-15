import {passwordValidator} from './passwordValidator';

describe('passwordValidator', () => {
  // Casos de validación para requisitos de contraseña
  describe('Validación de contraseña vacía', () => {
    test('debería devolver un error cuando la contraseña está vacía', () => {
      // Arrange
      const password = '';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe('La contraseña no puede estar vacía.');
    });
  });

  describe('Validación de longitud', () => {
    test('debería devolver un error cuando la contraseña tiene menos de 5 caracteres', () => {
      // Arrange
      const password = 'Abc1';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe('La contraseña debe tener al menos 5 caracteres.');
    });

    test('debería aceptar contraseñas con exactamente 5 caracteres si cumplen otros requisitos', () => {
      // Arrange
      const password = 'Abc12';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe('');
    });
  });

  describe('Validación de complejidad', () => {
    test('debería devolver un error cuando la contraseña no tiene una letra mayúscula', () => {
      // Arrange
      const password = 'abcde123';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe(
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.',
      );
    });

    test('debería devolver un error cuando la contraseña no tiene una letra minúscula', () => {
      // Arrange
      const password = 'ABCDE123';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe(
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.',
      );
    });

    test('debería devolver un error cuando la contraseña no tiene un número', () => {
      // Arrange
      const password = 'ABCDEabcde';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe(
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.',
      );
    });
  });

  describe('Contraseñas válidas', () => {
    test('debería devolver una cadena vacía cuando la contraseña cumple todos los requisitos', () => {
      // Arrange
      const password = 'Abc123';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe('');
    });

    test('debería aceptar contraseñas complejas', () => {
      // Arrange
      const password = 'P@ssw0rd123!';

      // Act
      const resultado = passwordValidator(password);

      // Assert
      expect(resultado).toBe('');
    });
  });
});
