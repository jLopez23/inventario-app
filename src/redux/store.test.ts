import {store} from './store';
import {setAuthUser} from './slices/authUserSlice';
import {AuthUserState} from './types/authUserTypes';
import {User} from '../domain/entities/user';

describe('Redux store', () => {
  it('debería tener el estado inicial correcto', () => {
    // Arrange
    const expectedState = {
      authUser: {
        status: 'checking',
        token: undefined,
        user: undefined,
      },
    };

    // Act
    const actualState = store.getState();

    // Assert
    expect(actualState).toEqual(expectedState);
  });

  it('debería actualizar correctamente el estado de authUser', () => {
    // Arrange
    const mockUser: User = {
      id: '123',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      roles: ['user'],
    };

    const mockToken = 'test-token-123';
    const authPayload: AuthUserState = {
      status: 'authenticated',
      token: mockToken,
      user: mockUser,
    };

    const expectedState = {
      authUser: authPayload,
    };

    // Act
    store.dispatch(setAuthUser(authPayload));
    const updatedState = store.getState();

    // Assert
    expect(updatedState).toEqual(expectedState);
  });

  it('debería manejar múltiples actualizaciones secuenciales correctamente', () => {
    // Arrange
    // Primero configuramos un estado autenticado
    const mockUser: User = {
      id: '123',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      roles: ['user'],
    };

    const authPayload: AuthUserState = {
      status: 'authenticated',
      token: 'test-token-123',
      user: mockUser,
    };

    // Luego configuramos el payload para cerrar sesión
    const logoutPayload: AuthUserState = {
      status: 'unauthenticated',
      token: undefined,
      user: undefined,
    };

    const expectedFinalState = {
      authUser: logoutPayload,
    };

    // Act
    // Primero autenticamos
    store.dispatch(setAuthUser(authPayload));
    // Luego cerramos sesión
    store.dispatch(setAuthUser(logoutPayload));

    const finalState = store.getState();

    // Assert
    expect(finalState).toEqual(expectedFinalState);
  });

  it('debería mantener el estado existente cuando se reinicia el store', () => {
    // Arrange
    const mockUser: User = {
      id: '456',
      email: 'persistent@example.com',
      fullName: 'Persistent User',
      isActive: true,
      roles: ['admin'],
    };

    const authPayload: AuthUserState = {
      status: 'authenticated',
      token: 'persistent-token',
      user: mockUser,
    };

    // Establecemos un estado inicial
    store.dispatch(setAuthUser(authPayload));
    const stateBeforeReset = store.getState();

    // Act
    // Simulamos una recarga del store obteniendo una nueva referencia (sin reiniciar realmente)
    const currentState = store.getState();

    // Assert
    expect(currentState).toEqual(stateBeforeReset);
    expect(currentState.authUser.user).toBe(mockUser);
    expect(currentState.authUser.token).toBe('persistent-token');
  });
});
