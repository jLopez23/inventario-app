// tesloApi.mock.ts
// Este archivo simula tesloApi.ts sin depender de @env

// URL simulada para pruebas
export const API_URL = 'http://mocked-url.com';

// Simulamos la estructura básica del cliente axios sin usar axios directamente
export const createTesloApiMock = (axiosImpl: any, storageAdapter: any) => {
  const interceptors: any[] = [];
  
  // Creamos un modelo simplificado de lo que hace axios.create
  const apiMock = {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    interceptors: {
      request: {
        use: (fn: any) => {
          interceptors.push(fn);
          return fn;
        }
      }
    },
    // Función para simular la ejecución del interceptor
    async executeInterceptor(config: any = { headers: {} }) {
      let currentConfig = { ...config };
      
      // Aplicar todos los interceptores registrados
      for (const interceptor of interceptors) {
        currentConfig = await interceptor(currentConfig);
      }
      
      return currentConfig;
    }
  };

  // Definimos el interceptor que añade el token
  apiMock.interceptors.request.use(async (config: any) => {
    const token = await storageAdapter.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  return apiMock;
};