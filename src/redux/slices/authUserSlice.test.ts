import {setAuthUser, authUserSlice} from './authUserSlice';
import {AuthUserState} from '../types/authUserTypes';
import {User} from '../../domain/entities/user';

describe('authUserSlice', () => {
  // Prueba para el estado inicial
  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      // Arrange
      const expectedInitialState: AuthUserState = {
        status: 'checking',
        token: undefined,
        user: undefined,
      };

      // Act
      const initialState = authUserSlice.getInitialState();

      // Assert
      expect(initialState).toEqual(expectedInitialState);
    });
  });

  // Pruebas para el reducer setAuthUser
  describe('setAuthUser reducer', () => {
    it('debería actualizar el estado con la información del usuario autenticado', () => {
      // Arrange
      const initialState: AuthUserState = {
        status: 'checking',
        token: undefined,
        user: undefined,
      };

      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        isActive: true,
        roles: ['user'],
      };

      const mockToken = 'test-token-123';
      const expectedState: AuthUserState = {
        status: 'authenticated',
        token: mockToken,
        user: mockUser,
      };

      // Act
      const action = setAuthUser({
        status: 'authenticated',
        token: mockToken,
        user: mockUser,
      });
      const newState = authUserSlice.reducer(initialState, action);

      // Assert
      expect(newState).toEqual(expectedState);
    });

    it('debería actualizar el estado para marcar usuario como no autenticado', () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        isActive: true,
        roles: ['user'],
      };

      const initialState: AuthUserState = {
        status: 'authenticated',
        token: 'existing-token',
        user: mockUser,
      };

      const expectedState: AuthUserState = {
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      };

      // Act
      const action = setAuthUser({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });
      const newState = authUserSlice.reducer(initialState, action);

      // Assert
      expect(newState).toEqual(expectedState);
    });

    it('debería actualizar el estado para marcar el proceso de verificación', () => {
      // Arrange
      const initialState: AuthUserState = {
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      };

      const expectedState: AuthUserState = {
        status: 'checking',
        token: undefined,
        user: undefined,
      };

      // Act
      const action = setAuthUser({
        status: 'checking',
        token: undefined,
        user: undefined,
      });
      const newState = authUserSlice.reducer(initialState, action);

      // Assert
      expect(newState).toEqual(expectedState);
    });

    it('debería manejar cambios parciales en el estado correctamente', () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        isActive: true,
        roles: ['user'],
      };

      const initialState: AuthUserState = {
        status: 'authenticated',
        token: 'existing-token',
        user: mockUser,
      };

      const newMockUser: User = {
        id: '123',
        email: 'updated@example.com',
        fullName: 'Updated User',
        isActive: true,
        roles: ['user', 'admin'],
      };

      const expectedState: AuthUserState = {
        status: 'authenticated', // mismo estado
        token: 'existing-token', // mismo token
        user: newMockUser, // usuario actualizado
      };

      // Act
      const action = setAuthUser({
        status: 'authenticated',
        token: 'existing-token',
        user: newMockUser,
      });
      const newState = authUserSlice.reducer(initialState, action);

      // Assert
      expect(newState).toEqual(expectedState);
      // Verificamos que el usuario ha cambiado pero mantiene el mismo ID
      expect(newState.user?.id).toBe(initialState.user?.id);
      expect(newState.user).not.toBe(initialState.user);
    });
  });
});
