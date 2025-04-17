import {renderHook, act} from '@testing-library/react-native';
import {useAuth} from './useAuth';
import {useDispatch} from 'react-redux';
import {setAuthUser} from '../../redux/slices/authUserSlice';
import {
  authCheckStatus,
  authLogin,
  authRegister,
} from '../../actions/auth/auth';
import {StorageAdapter} from '../../config/adapters/storage-adapter';

// Mocks para las dependencias
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../redux/slices/authUserSlice', () => ({
  setAuthUser: jest.fn(),
}));

jest.mock('../../actions/auth/auth', () => ({
  authLogin: jest.fn(),
  authCheckStatus: jest.fn(),
  authRegister: jest.fn(),
}));

jest.mock('../../config/adapters/storage-adapter', () => ({
  StorageAdapter: {
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  // Setup común para los tests
  const mockDispatch = jest.fn();
  const mockSetAuthUser = setAuthUser as jest.MockedFunction<
    typeof setAuthUser
  >;
  const mockAuthLogin = authLogin as jest.MockedFunction<typeof authLogin>;
  const mockAuthCheckStatus = authCheckStatus as jest.MockedFunction<
    typeof authCheckStatus
  >;
  const mockAuthRegister = authRegister as jest.MockedFunction<
    typeof authRegister
  >;
  const mockStorageSetItem = StorageAdapter.setItem as jest.MockedFunction<
    typeof StorageAdapter.setItem
  >;
  const mockStorageRemoveItem =
    StorageAdapter.removeItem as jest.MockedFunction<
      typeof StorageAdapter.removeItem
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  describe('useAnimation Hook', () => {
    describe('login', () => {
      it('debería realizar login exitoso', async () => {
        // Arrange
        const loginCredentials = {
          email: 'test@example.com',
          password: 'password123',
        };
        const mockLoginResponse = {
          token: 'mocked-token',
          user: {id: '1', name: 'Test User', email: 'test@example.com'},
        };
        const expectedAuthState = {
          status: 'authenticated',
          token: mockLoginResponse.token,
          user: mockLoginResponse.user,
        };

        mockAuthLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const {result} = renderHook(() => useAuth());
        let loginResult;

        await act(async () => {
          loginResult = await result.current.login(loginCredentials);
        });

        // Assert
        expect(mockAuthLogin).toHaveBeenCalledWith(
          loginCredentials.email,
          loginCredentials.password,
        );
        expect(mockStorageSetItem).toHaveBeenCalledWith(
          'token',
          mockLoginResponse.token,
        );
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
        expect(loginResult).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('');
      });

      it('debería manejar error de login cuando la respuesta es null', async () => {
        // Arrange
        const loginCredentials = {
          email: 'test@example.com',
          password: 'wrong-password',
        };
        const expectedErrorMessage = 'Usuario o contraseña incorrectos';
        const expectedAuthState = {
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        };

        mockAuthLogin.mockResolvedValue(null);

        // Act
        const {result} = renderHook(() => useAuth());
        let loginResult;

        await act(async () => {
          loginResult = await result.current.login(loginCredentials);
        });

        // Assert
        expect(mockAuthLogin).toHaveBeenCalledWith(
          loginCredentials.email,
          loginCredentials.password,
        );
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
        expect(loginResult).toBe(false);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(expectedErrorMessage);
      });

      it('debería manejar excepciones durante el login', async () => {
        // Arrange
        const loginCredentials = {
          email: 'test@example.com',
          password: 'password123',
        };
        const expectedError = new Error('Network error');

        mockAuthLogin.mockRejectedValue(expectedError);

        // Act
        const {result} = renderHook(() => useAuth());
        let loginResult;

        await act(async () => {
          loginResult = await result.current.login(loginCredentials);
        });

        // Assert
        expect(mockAuthLogin).toHaveBeenCalledWith(
          loginCredentials.email,
          loginCredentials.password,
        );
        expect(loginResult).toBe(false);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(expectedError.message);
      });
    });

    describe('checkStatus', () => {
      it('debería configurar estado autenticado si hay token válido', async () => {
        // Arrange
        const mockCheckStatusResponse = {
          token: 'valid-token',
          user: {id: '1', name: 'Test User', email: 'test@example.com'},
        };
        const expectedAuthState = {
          status: 'authenticated',
          token: mockCheckStatusResponse.token,
          user: mockCheckStatusResponse.user,
        };

        mockAuthCheckStatus.mockResolvedValue(mockCheckStatusResponse);

        // Act
        const {result} = renderHook(() => useAuth());

        await act(async () => {
          await result.current.checkStatus();
        });

        // Assert
        expect(mockAuthCheckStatus).toHaveBeenCalled();
        expect(mockStorageSetItem).toHaveBeenCalledWith(
          'token',
          mockCheckStatusResponse.token,
        );
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
      });

      it('debería configurar estado no autenticado si no hay token válido', async () => {
        // Arrange
        const expectedAuthState = {
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        };

        mockAuthCheckStatus.mockResolvedValue(null);

        // Act
        const {result} = renderHook(() => useAuth());

        await act(async () => {
          await result.current.checkStatus();
        });

        // Assert
        expect(mockAuthCheckStatus).toHaveBeenCalled();
        expect(mockStorageSetItem).not.toHaveBeenCalled();
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
      });
    });

    describe('logout', () => {
      it('debería realizar logout correctamente', async () => {
        // Arrange
        const expectedAuthState = {
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        };

        // Act
        const {result} = renderHook(() => useAuth());
        let logoutResult;

        await act(async () => {
          logoutResult = await result.current.logout();
        });

        // Assert
        expect(mockStorageRemoveItem).toHaveBeenCalledWith('token');
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
        expect(logoutResult).toBe(true);
      });
    });

    describe('register', () => {
      it('debería registrar correctamente un nuevo usuario', async () => {
        // Arrange
        const registerData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        };
        const mockRegisterResponse = {
          token: 'new-user-token',
          user: {id: '2', name: registerData.name, email: registerData.email},
        };
        const expectedAuthState = {
          status: 'authenticated',
          token: mockRegisterResponse.token,
          user: mockRegisterResponse.user,
        };

        mockAuthRegister.mockResolvedValue(mockRegisterResponse);

        // Act
        const {result} = renderHook(() => useAuth());
        let registerResult;

        await act(async () => {
          registerResult = await result.current.register(registerData);
        });

        // Assert
        expect(mockAuthRegister).toHaveBeenCalledWith(
          registerData.email,
          registerData.password,
          registerData.name,
        );
        expect(mockStorageSetItem).toHaveBeenCalledWith(
          'token',
          mockRegisterResponse.token,
        );
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
        expect(registerResult).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('');
      });

      it('debería manejar error de registro cuando la respuesta es null', async () => {
        // Arrange
        const registerData = {
          name: 'New User',
          email: 'existing@example.com', // Email que ya existe
          password: 'password123',
        };
        const expectedErrorMessage = 'Error al intentar crear el nuevo usuario';
        const expectedAuthState = {
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        };

        mockAuthRegister.mockResolvedValue(null);

        // Act
        const {result} = renderHook(() => useAuth());
        let registerResult;

        await act(async () => {
          registerResult = await result.current.register(registerData);
        });

        // Assert
        expect(mockAuthRegister).toHaveBeenCalledWith(
          registerData.email,
          registerData.password,
          registerData.name,
        );
        expect(mockSetAuthUser).toHaveBeenCalledWith(expectedAuthState);
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetAuthUser.mock.results[0].value,
        );
        expect(registerResult).toBe(false);
        expect(result.current.loading).toBe(false);

        // Verificamos que el mensaje de error contenga el texto esperado
        if (result.current.error instanceof Error) {
          expect(result.current.error.message).toBe(expectedErrorMessage);
        } else {
          expect(result.current.error).toContain(expectedErrorMessage);
        }
      });

      it('debería manejar excepciones durante el registro', async () => {
        // Arrange
        const registerData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        };
        const expectedError = 'El email ya está en uso';

        mockAuthRegister.mockRejectedValue(expectedError);

        // Act
        const {result} = renderHook(() => useAuth());
        let registerResult;

        await act(async () => {
          registerResult = await result.current.register(registerData);
        });

        // Assert
        expect(mockAuthRegister).toHaveBeenCalledWith(
          registerData.email,
          registerData.password,
          registerData.name,
        );
        expect(registerResult).toBe(false);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(expectedError);
      });
    });
  });
});
