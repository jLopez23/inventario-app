// Importa los matchers de jest-native
import '@testing-library/jest-native/extend-expect';

// Mock para react-native que mantiene los componentes básicos
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    // Mantén los componentes originales que necesitas para las pruebas
    Text: RN.Text,
    View: RN.View,
    TouchableOpacity: RN.TouchableOpacity,
    TextInput: RN.TextInput,
    Image: RN.Image,
    ScrollView: RN.ScrollView,

    // Agrega los mocks para otras funcionalidades
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    AccessibilityInfo: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
    },
    Animated: {
      ...RN.Animated,
      Image: RN.Image,
    },
    LogBox: {
      ignoreLogs: jest.fn(),
      ignoreAllLogs: jest.fn(),
    },
    NativeModules: {
      NativeAnimatedModule: {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
      SettingsManager: {
        settings: {},
      },
    },
    TurboModuleRegistry: {
      get: jest.fn(),
      getEnforcing: jest.fn(() => ({})),
    },
    Settings: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };
});

// Mock para @env
jest.mock('@env', () => ({
  STAGE: 'test',
  API_URL: 'http://test-api.example.com',
  API_URL_IOS: 'http://test-api.example.com',
  API_URL_ANDROID: 'http://test-api.example.com',
}));

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () => {
  let storageCache = {};
  return {
    setItem: jest.fn((key, value) => {
      storageCache[key] = value;
      return Promise.resolve(value);
    }),
    getItem: jest.fn(key => Promise.resolve(storageCache[key] || null)),
    removeItem: jest.fn(key => {
      delete storageCache[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      storageCache = {};
      return Promise.resolve();
    }),
  };
});

jest.mock('@ui-kitten/components', () => {
  const { View, Text } = jest.requireActual('react-native');
  return {
    ApplicationProvider: ({ children }) => <>{children}</>,
    Card: ({ children, onPress, style }) => (
      <View testID="card" style={style} accessible accessibilityLabel="card" onTouchEnd={onPress}>
        {children}
      </View>
    ),
    Text: ({ children, style, numberOfLines }) => (
      <Text
        accessible
        accessibilityLabel={typeof children === 'string' ? children : 'text'}
        style={style}
        numberOfLines={numberOfLines}
      >
        {children}
      </Text>
    ),
    // Otros componentes que podrías necesitar
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock para evitar errores con `call` en animaciones
  Reanimated.default.call = () => { };

  return Reanimated;
});

jest.spyOn(console, 'warn').mockImplementation(() => { });
jest.spyOn(console, 'error').mockImplementation(() => { });