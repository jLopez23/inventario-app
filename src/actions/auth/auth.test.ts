// auth.test.ts
import {authLogin, authCheckStatus, authRegister} from './auth';
import {tesloApi} from '../../config/api/tesloApi';
import {
  mockAuthResponse,
  expectedUserToken,
} from '../../../__mocks__/mock-data';

// Mock the tesloApi
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock console.log to avoid polluting test output
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  describe('authLogin', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      // Arrange
      const email = 'USER@example.com';
      const password = 'password123';
      (tesloApi.post as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      // Act
      const result = await authLogin(email, password);

      // Assert
      expect(tesloApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com', // Should be lowercase
        password: 'password123',
      });
      expect(result).toEqual(expectedUserToken);
    });

    it('debe devolver null y registrar el error cuando falla la llamada a la API', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'password123';
      const mockError = new Error('Network error');
      (tesloApi.post as jest.Mock).mockRejectedValueOnce(mockError);

      // Act
      const result = await authLogin(email, password);

      // Assert
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('authCheckStatus', () => {
    it('debería verificar el estado de autenticación correctamente', async () => {
      // Arrange
      (tesloApi.get as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      // Act
      const result = await authCheckStatus();

      // Assert
      expect(tesloApi.get).toHaveBeenCalledWith('/auth/check-status');
      expect(result).toEqual(expectedUserToken);
    });

    it('debe devolver null y registrar el error cuando falla la llamada a la API', async () => {
      // Arrange
      const mockError = new Error('Network error');
      (tesloApi.get as jest.Mock).mockRejectedValueOnce(mockError);

      // Act
      const result = await authCheckStatus();

      // Assert
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('authRegister', () => {
    it('debería registrar correctamente un nuevo usuario', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const password = 'newpassword123';
      const fullName = 'New User';
      (tesloApi.post as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      // Act
      const result = await authRegister(email, password, fullName);

      // Assert
      expect(tesloApi.post).toHaveBeenCalledWith('/auth/register', {
        email: 'newuser@example.com',
        password: 'newpassword123',
        fullName: 'New User',
      });
      expect(result).toEqual(expectedUserToken);
      expect(console.log).toHaveBeenCalledWith('Registering user...', {
        email,
        password,
        fullName,
      });
    });

    it('debe devolver null y registrar el error cuando falla la llamada a la API', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const password = 'newpassword123';
      const fullName = 'New User';
      const mockError = new Error('Registration failed');
      (tesloApi.post as jest.Mock).mockRejectedValueOnce(mockError);

      // Act
      const result = await authRegister(email, password, fullName);

      // Assert
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalled();
    });
  });
});
