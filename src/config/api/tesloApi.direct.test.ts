// tesloApi.direct.test.ts
import {API_URL, createTesloApiMock} from './tesloApi.mock';

// Mock para StorageAdapter
const mockStorageAdapter = {
  getItem: jest.fn(),
};

describe('tesloApi', () => {
  let apiMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Crear una instancia del tesloApi simulado
    apiMock = createTesloApiMock({}, mockStorageAdapter);
  });

  it('debe configurar api con los parámetros correctos', () => {
    // Verificar que API_URL tiene el valor esperado
    expect(API_URL).toBe('http://mocked-url.com');

    // Verificar que la configuración tiene los valores correctos
    expect(apiMock.baseURL).toBe('http://mocked-url.com');
    expect(apiMock.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('debe añadir el token al header cuando existe', async () => {
    // Crear una configuración de prueba
    const mockConfig = {headers: {}};

    // Ejecutar la función que simula añadir el token
    const result = await apiMock.addTokenWithAuth(mockConfig);

    // Verificar que se añadió el token
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('no debe añadir el token al header cuando no existe', async () => {
    // Crear una configuración de prueba
    const mockConfig = {headers: {}};

    // Ejecutar la función que simula no añadir el token
    const result = await apiMock.addTokenWithoutAuth(mockConfig);

    // Verificar que no se añadió Authorization al header
    expect(result.headers.Authorization).toBeUndefined();
  });

  // Prueba adicional para casos donde no hay headers inicialmente
  it('debe manejar configuraciones sin objeto headers', async () => {
    // Crear una configuración sin headers
    const mockConfig = {};

    // Verificar que no falla cuando no hay headers
    const resultWithAuth = await apiMock.addTokenWithAuth(mockConfig);
    expect(resultWithAuth.headers.Authorization).toBe('Bearer test-token');

    const resultWithoutAuth = await apiMock.addTokenWithoutAuth({});
    expect(resultWithoutAuth.headers.Authorization).toBeUndefined();
  });
});
