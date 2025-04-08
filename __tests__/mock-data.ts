import { AuthResponse } from '../src/infrastructure/interfaces/auth.responses';
// Datos comunes para las pruebas
export const mockAuthResponse: AuthResponse = {
  id: 'user-123',
  email: 'test@example.com',
  fullName: 'Test User',
  isActive: true,
  roles: ['user'],
  token: 'jwt-token-123',
};

export const expectedUserToken = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    fullName: 'Test User',
    isActive: true,
    roles: ['user'],
  },
  token: 'jwt-token-123',
};
