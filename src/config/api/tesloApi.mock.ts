// tesloApi.mock.ts
// Este archivo simula tesloApi.ts sin depender de @env

// URL simulada para pruebas
export const API_URL = 'http://mocked-url.com';

// Versión completamente plana sin ramas condicionales
export const createTesloApiMock = () => {
  return {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    // Función que simula añadir el token (caso exitoso)
    async addTokenWithAuth(config: any) {
      // Implementación sin ramas condicionales
      config.headers = config.headers || {};
      config.headers['Authorization'] = 'Bearer test-token';
      return config;
    },
    // Función que simula el caso sin token
    async addTokenWithoutAuth(config: any) {
      // Implementación sin ramas condicionales
      config.headers = config.headers || {};
      // No agregamos el token a propósito
      return config;
    },
  };
};
