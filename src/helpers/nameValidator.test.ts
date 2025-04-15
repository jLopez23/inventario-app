import {nameValidator} from './nameValidator';

describe('nameValidator', () => {
  describe('Validación de nombre vacío', () => {
    test('debería devolver un error cuando el nombre está vacío', () => {
      // Arrange
      const name = '';

      // Act
      const resultado = nameValidator(name);

      // Assert
      expect(resultado).toBe('El nombre no puede estar vacío.');
    });

    test('debería devolver un error cuando el nombre solo contiene espacios', () => {
      // Arrange
      const name = '   ';

      // Act
      const resultado = nameValidator(name);

      // Assert
      expect(resultado).toBe('El nombre no puede estar vacío.');
    });
  });

  describe('Nombres válidos', () => {
    test('debería aceptar nombres simples', () => {
      // Arrange
      const name = 'Juan';

      // Act
      const resultado = nameValidator(name);

      // Assert
      expect(resultado).toBe('');
    });

    test('debería aceptar nombres compuestos', () => {
      // Arrange
      const name = 'Juan Pérez';

      // Act
      const resultado = nameValidator(name);

      // Assert
      expect(resultado).toBe('');
    });

    test('debería aceptar nombres con caracteres especiales', () => {
      // Arrange
      const name = "María-José O'Connor";

      // Act
      const resultado = nameValidator(name);

      // Assert
      expect(resultado).toBe('');
    });
  });
});
