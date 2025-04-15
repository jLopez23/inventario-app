import {hashPassword, comparePasswords} from './encryptPassword';
import {sha256} from 'js-sha256';

// Mock de los módulos externos para controlar el entorno de prueba
jest.mock('js-sha256', () => ({
  sha256: jest.fn().mockImplementation(input => `mocked-hash-${input}`),
}));

// Mock de la constante ENCRYP_KEY
jest.mock('../constants/app', () => ({
  ENCRYP_KEY: 'test-encryption-key',
}));

describe('encryptPassword', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    test('debería utilizar sha256 para cifrar la contraseña con la clave de encriptación', () => {
      // Arrange
      const password = 'mySecurePassword123';

      // Act
      const result = hashPassword(password);

      // Assert
      expect(sha256).toHaveBeenCalledWith('test-encryption-key' + password);
      expect(result).toBe(`mocked-hash-test-encryption-key${password}`);
    });

    test('debería generar hashes diferentes para contraseñas diferentes', () => {
      // Arrange
      const password1 = 'password1';
      const password2 = 'password2';

      // Act
      const hash1 = hashPassword(password1);
      const hash2 = hashPassword(password2);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePasswords', () => {
    test('debería devolver true cuando las contraseñas coinciden', () => {
      // Arrange
      const password = 'correctPassword';
      const hashedPassword = `mocked-hash-test-encryption-key${password}`;

      // Act
      const result = comparePasswords(password, hashedPassword);

      // Assert
      expect(result).toBe(true);
    });

    test('debería devolver un mensaje de error cuando las contraseñas no coinciden', () => {
      // Arrange
      const enteredPassword = 'wrongPassword';
      const storedPassword = `mocked-hash-test-encryption-keycorrectPassword`;

      // Act
      const result = comparePasswords(enteredPassword, storedPassword);

      // Assert
      expect(result).toBe('Correo o contraseña incorrectos');
    });
  });
});
