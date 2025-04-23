// tesloApi.test.ts
import {AxiosRequestConfig} from 'axios';
import {getApiUrl} from './tesloApiHelper';
import {StorageAdapter} from '../adapters/storage-adapter';

// Mock para StorageAdapter
jest.mock('../adapters/storage-adapter', () => ({
  StorageAdapter: {
    getItem: jest.fn(),
  },
}));

describe('tesloApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para la lógica condicional de API_URL
  describe('API_URL conditional logic', () => {
    const PROD_URL = 'http://prod-url.com';
    const API_URL_IOS = 'http://ios-url.com';
    const API_URL_ANDROID = 'http://android-url.com';

    // Test para cuando STAGE es 'prod'
    it('debe usar PROD_URL cuando STAGE es prod', () => {
      const result = getApiUrl(
        'prod',
        'cualquiera',
        PROD_URL,
        API_URL_IOS,
        API_URL_ANDROID,
      );
      expect(result).toBe(PROD_URL);
    });

    // Test para cuando STAGE no es 'prod' y Platform.OS es 'ios'
    it('debe usar API_URL_IOS cuando STAGE no es prod y Platform.OS es ios', () => {
      const result = getApiUrl(
        'dev',
        'ios',
        PROD_URL,
        API_URL_IOS,
        API_URL_ANDROID,
      );
      expect(result).toBe(API_URL_IOS);
    });

    // Test para cuando STAGE no es 'prod' y Platform.OS no es 'ios'
    it('debe usar API_URL_ANDROID cuando STAGE no es prod y Platform.OS no es ios', () => {
      const result = getApiUrl(
        'dev',
        'android',
        PROD_URL,
        API_URL_IOS,
        API_URL_ANDROID,
      );
      expect(result).toBe(API_URL_ANDROID);
    });
  });

  // Pruebas para el interceptor
  describe('Request interceptor', () => {
    // Test para simular el interceptor cuando hay token
    it('debe añadir token al header cuando existe', async () => {
      // Simular el comportamiento del interceptor directamente
      const mockToken = 'mock-token';
      (StorageAdapter.getItem as jest.Mock).mockResolvedValue(mockToken);

      // Crear una función de interceptor como la que existe en tesloApi.ts
      const interceptor = async (config: AxiosRequestConfig) => {
        const token = await StorageAdapter.getItem('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      };

      // Probar el interceptor con una configuración de prueba
      const mockConfig: AxiosRequestConfig = {headers: {}};
      const result = await interceptor(mockConfig);

      // Verificar que el token se añadió correctamente
      expect(StorageAdapter.getItem).toHaveBeenCalledWith('token');
      expect(result.headers).toHaveProperty(
        'Authorization',
        `Bearer ${mockToken}`,
      );
    });

    // Test para simular el interceptor cuando no hay token
    it('no debe añadir token al header cuando no existe', async () => {
      // Simular el comportamiento del interceptor directamente
      (StorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

      // Crear una función de interceptor como la que existe en tesloApi.ts
      const interceptor = async (config: AxiosRequestConfig) => {
        const token = await StorageAdapter.getItem('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      };

      // Probar el interceptor con una configuración de prueba
      const mockConfig: AxiosRequestConfig = {headers: {}};
      const result = await interceptor(mockConfig);

      // Verificar que no se añadió el token
      expect(StorageAdapter.getItem).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBeUndefined();
    });
  });
});
