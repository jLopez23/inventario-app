import React from 'react';
import {render, act} from '@testing-library/react-native';
import {AuthProvider} from './AuthProvider';
import {useAuth} from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AuthStatus} from '../../infrastructure/interfaces/auth.status';

// Mocks
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  Provider: ({children}) => children, // Mock simple del Provider de Redux
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('AuthProvider Component', () => {
  // Mock para useAuth
  const mockCheckStatus = jest.fn();

  // Mock para useSelector
  const mockSelector = jest.fn();

  // Mock para useNavigation
  const mockReset = jest.fn();

  // Capturar la función selector utilizada en useSelector
  let capturedSelectorFn;

  // Contenido de prueba
  const testChildContent = 'Contenido de prueba';

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mock para useAuth
    (useAuth as jest.Mock).mockReturnValue({
      checkStatus: mockCheckStatus,
    });

    // Configurar mock para useSelector para capturar la función de selector
    (useSelector as jest.Mock).mockImplementation(selectorFn => {
      capturedSelectorFn = selectorFn;
      return mockSelector();
    });

    // Configurar mock para useNavigation
    (useNavigation as jest.Mock).mockReturnValue({
      reset: mockReset,
    });

    // Configuración inicial para useSelector
    mockSelector.mockReturnValue({status: 'checking'});

    // Configurar timers falsos
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debería llamar a checkStatus al montar el componente', () => {
    // Arrange
    const expectedCallCount = 1;

    // Act
    render(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Assert
    expect(mockCheckStatus).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería renderizar los componentes hijos', () => {
    // Arrange
    const expectedChildContent = testChildContent;

    // Act
    const {getByTestId} = render(
      <AuthProvider>
        <mock-text testID="child-content">{expectedChildContent}</mock-text>
      </AuthProvider>,
    );

    // Assert
    expect(getByTestId('child-content').props.children).toBe(
      expectedChildContent,
    );
  });

  it('debería navegar a HomeScreen cuando el estado cambia a authenticated', async () => {
    // Arrange
    const initialStatus: AuthStatus = 'checking';
    const newStatus: AuthStatus = 'authenticated';
    const expectedNavigationConfig = {
      index: 0,
      routes: [{name: 'HomeScreen'}],
    };

    // Comenzar con estado "checking"
    mockSelector.mockReturnValue({status: initialStatus});

    // Act
    const {rerender} = render(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Cambiar el estado a "authenticated" y volver a renderizar el componente
    mockSelector.mockReturnValue({status: newStatus});

    // Forzar re-renderizado para que se aplique el nuevo valor del selector
    rerender(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Ejecutar timers para asegurar que los efectos async se completen
    await act(async () => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockReset).toHaveBeenCalledWith(expectedNavigationConfig);
  });

  it('debería navegar a LoginScreen cuando el estado cambia a unauthenticated', async () => {
    // Arrange
    const initialStatus: AuthStatus = 'checking';
    const newStatus: AuthStatus = 'unauthenticated';
    const expectedNavigationConfig = {
      index: 0,
      routes: [{name: 'LoginScreen'}],
    };

    // Comenzar con estado "checking"
    mockSelector.mockReturnValue({status: initialStatus});

    // Act
    const {rerender} = render(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Cambiar el estado a "unauthenticated" y volver a renderizar el componente
    mockSelector.mockReturnValue({status: newStatus});

    // Forzar re-renderizado para que se aplique el nuevo valor del selector
    rerender(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Ejecutar timers para asegurar que los efectos async se completen
    await act(async () => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockReset).toHaveBeenCalledWith(expectedNavigationConfig);
  });

  it('no debería navegar si el estado sigue siendo checking', async () => {
    // Arrange
    const status: AuthStatus = 'checking';
    mockSelector.mockReturnValue({status});

    // Act
    const {rerender} = render(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Forzar re-renderizado con el mismo estado
    rerender(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Ejecutar timers
    await act(async () => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('debería extraer correctamente el estado de autenticación del store', () => {
    // Arrange
    const mockAuthState = {
      status: 'authenticated',
      user: {id: '123', fullName: 'Test User'},
    };
    const mockRootState = {authUser: mockAuthState};

    // Act
    render(
      <AuthProvider>
        <mock-text testID="child-content">{testChildContent}</mock-text>
      </AuthProvider>,
    );

    // Ejecutar la función del selector capturada con un estado mock
    const result = capturedSelectorFn(mockRootState);

    // Assert
    expect(result).toEqual(mockAuthState);
  });
});
