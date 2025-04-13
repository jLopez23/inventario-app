import {StorageAdapter} from './storage-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock de console.log para evitar ruido en los tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('StorageAdapter', () => {
  // Limpiar todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('debería recuperar un valor correctamente cuando existe', async () => {
      // Arrange
      const testKey = 'test-key';
      const expectedValue = 'test-value';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(expectedValue);

      // Act
      const result = await StorageAdapter.getItem(testKey);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toBe(expectedValue);
    });

    it('debería retornar null cuando AsyncStorage retorna null', async () => {
      // Arrange
      const testKey = 'non-existent-key';
      const expectedValue = null;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await StorageAdapter.getItem(testKey);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toBe(expectedValue);
    });

    it('debería manejar errores y retornar null cuando falla AsyncStorage.getItem', async () => {
      // Arrange
      const testKey = 'error-key';
      const expectedValue = null;
      const mockError = new Error('Test error');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(mockError);

      // Act
      const result = await StorageAdapter.getItem(testKey);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toBe(expectedValue);
    });
  });

  describe('setItem', () => {
    it('debería almacenar un valor correctamente', async () => {
      // Arrange
      const testKey = 'test-key';
      const testValue = 'test-value';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await StorageAdapter.setItem(testKey, testValue);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
    });

    it('debería lanzar un error cuando falla AsyncStorage.setItem', async () => {
      // Arrange
      const testKey = 'error-key';
      const testValue = 'error-value';
      const mockError = new Error('Test error');
      const expectedErrorMessage = `Error setting item in storage: ${testKey} ${testValue}`;
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(StorageAdapter.setItem(testKey, testValue)).rejects.toThrow(
        expectedErrorMessage,
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
    });
  });

  describe('removeItem', () => {
    it('debería eliminar un valor correctamente', async () => {
      // Arrange
      const testKey = 'test-key-to-remove';
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await StorageAdapter.removeItem(testKey);

      // Assert
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(testKey);
    });

    it('debería lanzar un error cuando falla AsyncStorage.removeItem', async () => {
      // Arrange
      const testKey = 'error-key-to-remove';
      const mockError = new Error('Test error');
      const expectedErrorMessage = `Error removing item from storage: ${testKey}`;
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(StorageAdapter.removeItem(testKey)).rejects.toThrow(
        expectedErrorMessage,
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(testKey);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Casos de borde', () => {
    it('debería manejar valores largos en setItem', async () => {
      // Arrange
      const testKey = 'large-value-key';
      // Crear un string muy largo (10KB)
      const testValue = 'a'.repeat(10 * 1024);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await StorageAdapter.setItem(testKey, testValue);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
    });

    it('debería manejar caracteres especiales en las claves', async () => {
      // Arrange
      const specialKey = 'special@key#with$chars!';
      const testValue = 'value for special key';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(testValue);

      // Act
      const result = await StorageAdapter.getItem(specialKey);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(specialKey);
      expect(result).toBe(testValue);
    });

    it('debería manejar caracteres especiales en los valores', async () => {
      // Arrange
      const testKey = 'key-for-special-value';
      const specialValue = 'value@with#special$chars!';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await StorageAdapter.setItem(testKey, specialValue);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(testKey, specialValue);
    });

    it('debería manejar objetos JSON serializados como strings', async () => {
      // Arrange
      const testKey = 'json-key';
      const testObject = {id: 1, name: 'Test', active: true};
      const serializedValue = JSON.stringify(testObject);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(serializedValue);

      // Act
      await StorageAdapter.setItem(testKey, serializedValue);
      const result = await StorageAdapter.getItem(testKey);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        testKey,
        serializedValue,
      );
      expect(result).toBe(serializedValue);

      // Verificar que podemos deserializar el resultado
      const deserializedResult = JSON.parse(result as string);
      expect(deserializedResult).toEqual(testObject);
    });
  });
});
