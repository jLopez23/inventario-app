import {emailValidator} from './emailValidator';

describe('emailValidator', () => {
  describe('Validación de correo vacío', () => {
    test('debería devolver un error cuando el correo electrónico está vacío', () => {
      // Arrange
      const email = '';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe('El correo electrónico no puede estar vacío.');
    });
  });

  describe('Validación de formato', () => {
    test('debería devolver un error cuando falta el dominio', () => {
      // Arrange
      const email = 'correo@invalido';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe(
        '¡Ups! Necesitamos una dirección de correo electrónico válida.',
      );
    });

    test('debería devolver un error cuando falta el símbolo @', () => {
      // Arrange
      const email = 'correo.invalido.com';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe(
        '¡Ups! Necesitamos una dirección de correo electrónico válida.',
      );
    });

    test('debería devolver un error cuando falta el nombre de usuario', () => {
      // Arrange
      const email = '@dominio.com';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe(
        '¡Ups! Necesitamos una dirección de correo electrónico válida.',
      );
    });

    test('debería devolver un error para formatos no estándar', () => {
      // Arrange
      const email = 'usuario@dominio';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe(
        '¡Ups! Necesitamos una dirección de correo electrónico válida.',
      );
    });
  });

  describe('Correos válidos', () => {
    test('debería devolver una cadena vacía para correos con formato básico válido', () => {
      // Arrange
      const email = 'usuario@dominio.com';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe('');
    });

    test('debería aceptar correos con subdominios', () => {
      // Arrange
      const email = 'usuario@sub.dominio.com';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe('');
    });

    test('debería aceptar correos con caracteres especiales permitidos', () => {
      // Arrange
      const email = 'usuario.nombre+etiqueta@dominio.com';

      // Act
      const resultado = emailValidator(email);

      // Assert
      expect(resultado).toBe('');
    });
  });
});
