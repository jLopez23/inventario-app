import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {RegisterScreen} from './RegisterScreen';
import {useAuth} from '../../hooks/useAuth';
import {useRegisterForm} from '../../hooks/useRegisterForm';

// Mocks para las dependencias
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useRegisterForm', () => ({
  useRegisterForm: jest.fn(),
}));

// Mock para los componentes utilizados
jest.mock('../../components/shared/Logo', () => 'mock-logo');
jest.mock('../../components/shared/Header', () => ({
  __esModule: true,
  default: ({children}) => (
    <mock-header testID="header">{children}</mock-header>
  ),
}));
jest.mock('../../components/shared/Button', () => ({
  __esModule: true,
  default: ({children, onPress, style}) => (
    <mock-button testID="register-button" onPress={onPress} style={style}>
      {children}
    </mock-button>
  ),
}));
jest.mock('../../components/shared/BackButton', () => ({
  __esModule: true,
  default: ({goBack}) => (
    <mock-back-button testID="back-button" onPress={goBack} />
  ),
}));
jest.mock('../../components/shared/Background', () => ({
  __esModule: true,
  default: ({children}) => <mock-background>{children}</mock-background>,
}));
jest.mock('../../components/shared/LoadingError', () => ({
  LoadingError: ({loading, error}) => (
    <mock-loading-error
      testID="loading-error"
      loading={loading}
      error={error}
    />
  ),
}));
jest.mock('../../components/shared/LoginLink', () => ({
  LoginLink: ({navigation}) => (
    <mock-login-link testID="login-link" navigation={navigation} />
  ),
}));
jest.mock('../../components/shared/RegisterForm', () => ({
  RegisterForm: ({
    nameUser,
    emailUser,
    passwordUser,
    setName,
    setEmail,
    setPassword,
  }) => (
    <mock-register-form
      testID="register-form"
      nameUser={nameUser}
      emailUser={emailUser}
      passwordUser={passwordUser}
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  ),
}));

describe('RegisterScreen', () => {
  // Mocks para los hooks
  const mockRegister = jest.fn();
  const mockValidateForm = jest.fn();
  const mockSetName = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración predeterminada para useAuth
    (useAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: '',
      register: mockRegister,
    });

    // Configuración predeterminada para useRegisterForm
    (useRegisterForm as jest.Mock).mockReturnValue({
      nameUser: {value: '', error: ''},
      emailUser: {value: '', error: ''},
      passwordUser: {value: '', error: ''},
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm,
    });
  });

  it('debería renderizarse correctamente', () => {
    // Arrange - no es necesaria configuración adicional

    // Act
    const {toJSON} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar correctamente los componentes básicos', () => {
    // Arrange
    const expectedButtonText = 'Registrarme';
    const expectedHeaderText = 'Crear Cuenta';

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );

    // Assert
    expect(getByTestId('back-button')).toBeTruthy();
    expect(getByTestId('register-form')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('login-link')).toBeTruthy();
  });

  it('debería navegar hacia atrás cuando se presiona el botón de retroceso', async () => {
    // Arrange
    const expectedCallCount = 1;

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const backButton = getByTestId('back-button');

    // Simular clic en el botón de retroceso
    await fireEvent.press(backButton);

    // Assert
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería pasar correctamente las propiedades al formulario de registro', () => {
    // Arrange
    const nameValue = 'John Doe';
    const emailValue = 'john@example.com';
    const passwordValue = 'password123';

    // Configurar valores para el formulario
    (useRegisterForm as jest.Mock).mockReturnValue({
      nameUser: {value: nameValue, error: ''},
      emailUser: {value: emailValue, error: ''},
      passwordUser: {value: passwordValue, error: ''},
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm,
    });

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const registerForm = getByTestId('register-form');

    // Assert
    expect(registerForm.props.nameUser.value).toBe(nameValue);
    expect(registerForm.props.emailUser.value).toBe(emailValue);
    expect(registerForm.props.passwordUser.value).toBe(passwordValue);
    expect(registerForm.props.setName).toBe(mockSetName);
    expect(registerForm.props.setEmail).toBe(mockSetEmail);
    expect(registerForm.props.setPassword).toBe(mockSetPassword);
  });

  it('debería llamar a validateForm y register cuando se presiona el botón de registro con datos válidos', async () => {
    // Arrange
    const nameValue = 'John Doe';
    const emailValue = 'john@example.com';
    const passwordValue = 'Password123';
    const expectedRegisterArgs = {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
    };

    // Configurar valores válidos y mock de validateForm para devolver true
    (useRegisterForm as jest.Mock).mockReturnValue({
      nameUser: {value: nameValue, error: ''},
      emailUser: {value: emailValue, error: ''},
      passwordUser: {value: passwordValue, error: ''},
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm.mockReturnValue(true),
    });

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const registerButton = getByTestId('register-button');

    // Simular clic en el botón de registro
    await fireEvent.press(registerButton);

    // Assert
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith(expectedRegisterArgs);
  });

  it('no debería llamar a register cuando validateForm devuelve false', async () => {
    // Arrange
    // Configurar mock de validateForm para devolver false
    mockValidateForm.mockReturnValue(false);

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const registerButton = getByTestId('register-button');

    // Simular clic en el botón de registro
    await fireEvent.press(registerButton);

    // Assert
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debería mostrar un componente de loading cuando loading es true', () => {
    // Arrange
    const expectedLoadingValue = true;

    // Configurar loading como true
    (useAuth as jest.Mock).mockReturnValue({
      loading: true,
      error: '',
      register: mockRegister,
    });

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const loadingError = getByTestId('loading-error');

    // Assert
    expect(loadingError.props.loading).toBe(expectedLoadingValue);
  });

  it('debería mostrar un mensaje de error cuando hay un error de registro', () => {
    // Arrange
    const expectedError = 'El email ya está en uso';

    // Configurar error
    (useAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: expectedError,
      register: mockRegister,
    });

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const loadingError = getByTestId('loading-error');

    // Assert
    expect(loadingError.props.error).toBe(expectedError);
  });

  it('debería pasar correctamente errores de validación al formulario', () => {
    // Arrange
    const nameError = 'El nombre es requerido';
    const emailError = 'Email inválido';
    const passwordError = 'La contraseña debe tener al menos 8 caracteres';

    // Configurar valores con errores
    (useRegisterForm as jest.Mock).mockReturnValue({
      nameUser: {value: '', error: nameError},
      emailUser: {value: 'invalid', error: emailError},
      passwordUser: {value: '123', error: passwordError},
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm,
    });

    // Act
    const {getByTestId} = render(
      <RegisterScreen navigation={mockNavigation as any} />,
    );
    const registerForm = getByTestId('register-form');

    // Assert
    expect(registerForm.props.nameUser.error).toBe(nameError);
    expect(registerForm.props.emailUser.error).toBe(emailError);
    expect(registerForm.props.passwordUser.error).toBe(passwordError);
  });
});
