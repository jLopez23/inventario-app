import {authLogin, authCheckStatus, authRegister} from './auth';
import {tesloApi} from '../../config/api/tesloApi';
import type {AuthResponse} from '../../infrastructure/interfaces/auth.responses';
import {
  expectedUserToken,
  mockAuthResponse,
} from '../../../__tests__/mock-data';

// Mockear el módulo tesloApi
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mockear la función console.log para evitar logs durante las pruebas
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Auth Actions', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('authLogin', () => {
    it('debería convertir el email a minúsculas y retornar usuario y token cuando la autenticación es exitosa', async () => {
      // Arrange
      const email = 'TEST@EXAMPLE.COM';
      const password = 'password123';
      const expectedEmailLowercase = 'test@example.com';
      const expectedResult = expectedUserToken;

      const mockPost = tesloApi.post as jest.MockedFunction<
        typeof tesloApi.post
      >;
      mockPost.mockResolvedValueOnce({data: mockAuthResponse});

      // Act
      const result = await authLogin(email, password);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: expectedEmailLowercase,
        password: password,
      });
      expect(result).toEqual(expectedResult);
    });

    it('debería retornar null cuando ocurre un error en la API', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'invalid-password';
      const expectedResult = null;

      const mockPost = tesloApi.post as jest.MockedFunction<
        typeof tesloApi.post
      >;
      mockPost.mockRejectedValueOnce(new Error('Authentication failed'));

      // Act
      const result = await authLogin(email, password);

      // Assert
      expect(result).toBe(expectedResult);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('authCheckStatus', () => {
    it('debería retornar usuario y token cuando la verificación de estado es exitosa', async () => {
      // Arrange
      const expectedResult = expectedUserToken;

      const mockGet = tesloApi.get as jest.MockedFunction<typeof tesloApi.get>;
      mockGet.mockResolvedValueOnce({data: mockAuthResponse});

      // Act
      const result = await authCheckStatus();

      // Assert
      expect(mockGet).toHaveBeenCalledWith('/auth/check-status');
      expect(result).toEqual(expectedResult);
    });

    it('debería retornar null cuando ocurre un error al verificar el estado', async () => {
      // Arrange
      const expectedResult = null;

      const mockGet = tesloApi.get as jest.MockedFunction<typeof tesloApi.get>;
      mockGet.mockRejectedValueOnce(new Error('Token expired'));

      // Act
      const result = await authCheckStatus();

      // Assert
      expect(result).toBe(expectedResult);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('authRegister', () => {
    it('debería registrar un nuevo usuario y retornar usuario y token cuando el registro es exitoso', async () => {
      // Arrange
      const email = 'new@example.com';
      const password = 'newpassword123';
      const fullName = 'New User';

      const mockRegisterResponse: AuthResponse = {
        ...mockAuthResponse,
        email: email,
        fullName: fullName,
      };

      const expectedResult = {
        user: {
          ...expectedUserToken.user,
          email: email,
          fullName: fullName,
        },
        token: expectedUserToken.token,
      };

      const mockPost = tesloApi.post as jest.MockedFunction<
        typeof tesloApi.post
      >;
      mockPost.mockResolvedValueOnce({data: mockRegisterResponse});

      // Act
      const result = await authRegister(email, password, fullName);

      // Assert
      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        email: email,
        password: password,
        fullName: fullName,
      });
      expect(result).toEqual(expectedResult);
      expect(console.log).toHaveBeenCalledWith('Registering user...', {
        email,
        password,
        fullName,
      });
    });

    it('debería retornar null cuando ocurre un error en el registro', async () => {
      // Arrange
      const email = 'existing@example.com';
      const password = 'existingpassword';
      const fullName = 'Existing User';
      const expectedResult = null;

      const mockPost = tesloApi.post as jest.MockedFunction<
        typeof tesloApi.post
      >;
      mockPost.mockRejectedValueOnce(new Error('User already exists'));

      // Act
      const result = await authRegister(email, password, fullName);

      // Assert
      expect(result).toBe(expectedResult);
      expect(console.log).toHaveBeenCalled();
    });
  });
});
