import '@testing-library/jest-native/extend-expect';

// Configuración básica sin mockear NativeAnimatedHelper
jest.useFakeTimers();

// Mock para AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});