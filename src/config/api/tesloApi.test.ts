// __tests__/tesloApi.test.ts

import { AxiosRequestConfig } from 'axios';
import { tesloApi, API_URL } from './tesloApi';
import { StorageAdapter } from '../adapters/storage-adapter';

// Mocks configurados
jest.mock('../adapters/storage-adapter');

describe('tesloApi configuration', () => {
  const TEST_API_URL = 'http://localhost:3000/api';

  // 🧪 Test 1: API_URL should be correct based on Platform and STAGE
  it('debe establecer API_URL en API_URL_IOS cuando STAGE no es prod y Platform.OS es ios', () => {
    // Arrange
    const expectedURL = TEST_API_URL;

    // Act
    const actualURL = API_URL;

    // Assert
    expect(actualURL).toBe(expectedURL);
  });

  // 🧪 Test 2: tesloApi should be initialized with correct baseURL and headers
  it('debe crear una instancia de axios con baseURL y encabezados predeterminados', () => {
    // Arrange
    const expectedBaseURL = TEST_API_URL;
    const expectedContentType = 'application/json';

    // Act
    const axiosInstance = tesloApi;

    // Assert
    expect(axiosInstance.defaults.baseURL).toBe(expectedBaseURL);
    expect(axiosInstance.defaults.headers['Content-Type']).toBe(expectedContentType);
  });

  // 🧪 Test 3: Interceptor should attach Authorization header if token exists
  it('debe agregar el encabezado Authorization cuando el token está presente', async () => {
    // Arrange
    const mockToken = 'mocked-token';
    const expectedAuthHeader = `Bearer ${mockToken}`;
    (StorageAdapter.getItem as jest.Mock).mockResolvedValue(mockToken);

    const mockConfig: AxiosRequestConfig = {
      headers: {},
    };

    // Act
    const result = await (tesloApi.interceptors.request as any).handlers[0].fulfilled!(mockConfig);

    // Assert
    expect(result.headers).toHaveProperty('Authorization', expectedAuthHeader);
    expect(StorageAdapter.getItem).toHaveBeenCalledWith('token');
  });

  // 🧪 Test 4: Interceptor should NOT attach Authorization header when token is null
  it('debe no agregar el encabezado Authorization cuando el token es nulo', async () => {
    // Arrange
    (StorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

    const mockConfig: AxiosRequestConfig = {
      headers: {},
    };

    // Act
    const result = await (tesloApi.interceptors.request as any).handlers[0].fulfilled!(mockConfig);

    // Assert
    expect(result.headers?.Authorization).toBeUndefined();
    expect(StorageAdapter.getItem).toHaveBeenCalledWith('token');
  });
});
