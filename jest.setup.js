// Importa los matchers de jest-native
import '@testing-library/jest-native/extend-expect';

// Enfoque más genérico para mockear módulos de React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    ...RN,
    // Mocks para Animated
    Animated: {
      ...RN.Animated,
      timing: jest.fn().mockReturnValue({
        start: jest.fn(),
      }),
      loop: jest.fn(),
      spring: jest.fn(),
    },
    // Mocks para LogBox
    LogBox: {
      ignoreLogs: jest.fn(),
      ignoreAllLogs: jest.fn(),
    },
    // Mocks para NativeModules
    NativeModules: {
      ...RN.NativeModules,
      NativeAnimatedModule: {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
    },
    // Otros mocks que podrían ser necesarios
  };
});

// Para mocks adicionales específicos para tus tests
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
