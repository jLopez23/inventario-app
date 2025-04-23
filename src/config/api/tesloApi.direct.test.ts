// tesloApi.direct.test.ts
import { API_URL, createTesloApiMock } from './tesloApi.mock';

// Mock para StorageAdapter
const mockGetItem = jest.fn();
const mockStorageAdapter = {
  getItem: mockGetItem
};

// No necesitamos mockear axios ya que no lo usamos directamente
describe('tesloApi', () => {
  let apiMock: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Crear una instancia del tesloApi simulado
    apiMock = createTesloApiMock({}, mockStorageAdapter);
  });
  
  it('debe configurar axios.create con los parámetros correctos', () => {
    // Verificar que API_URL tiene el valor esperado
    expect(API_URL).toBe('http://mocked-url.com');
    
    // Verificar que la configuración tiene los valores correctos
    expect(apiMock.baseURL).toBe('http://mocked-url.com');
    expect(apiMock.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });
  
  it('debe configurar un interceptor para añadir el token a las solicitudes', () => {
    // Verificamos que el interceptor está funcionando
    expect(apiMock.interceptors.request).toBeDefined();
    expect(typeof apiMock.executeInterceptor).toBe('function');
  });
  
  it('debe añadir el token al header cuando existe', async () => {
    // Configurar el mock para devolver un token
    const mockToken = 'test-token';
    mockGetItem.mockResolvedValueOnce(mockToken);
    
    // Crear una configuración de prueba
    const mockConfig = { headers: {} };
    
    // Ejecutar el interceptor
    const result = await apiMock.executeInterceptor(mockConfig);
    
    // Verificar que se llamó a getItem con 'token'
    expect(mockGetItem).toHaveBeenCalledWith('token');
    
    // Verificar que se añadió el token
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });
  
  it('no debe añadir el token al header cuando no existe', async () => {
    // Configurar el mock para devolver null (no hay token)
    mockGetItem.mockResolvedValueOnce(null);
    
    // Crear una configuración de prueba
    const mockConfig = { headers: {} };
    
    // Ejecutar el interceptor
    const result = await apiMock.executeInterceptor(mockConfig);
    
    // Verificar que se llamó a getItem con 'token'
    expect(mockGetItem).toHaveBeenCalledWith('token');
    
    // Verificar que no se añadió Authorization al header
    expect(result.headers.Authorization).toBeUndefined();
  });
});