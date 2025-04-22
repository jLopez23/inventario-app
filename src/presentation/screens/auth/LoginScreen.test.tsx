import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {LoginScreen} from './LoginScreen';
import {useAuth} from '../../hooks/useAuth';
import {useLoginForm} from '../../hooks/useLoginForm';

// Mocks para las dependencias
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useLoginForm', () => ({
  useLoginForm: jest.fn(),
}));

// Mock para los componentes utilizados
jest.mock('../../components/shared/Logo', () => 'mock-logo');
jest.mock('../../components/shared/Header', () => 'mock-header');
jest.mock('../../components/shared/Button', () => ({
  __esModule: true,
  default: ({children, onPress, disabled, style}) => (
    <mock-button
      testID="login-button"
      onPress={onPress}
      disabled={disabled}
      style={style}>
      {children}
    </mock-button>
  ),
}));
jest.mock('../../components/shared/TextInput', () => ({
  __esModule: true,
  default: ({
    label,
    returnKeyType,
    value,
    onChangeText,
    error,
    errorText,
    autoCapitalize,
    autoCompleteType,
    textContentType,
    keyboardType,
    secureTextEntry,
    description,
  }) => (
    <mock-text-input
      testID={`input-${label}`}
      label={label}
      returnKeyType={returnKeyType}
      value={value}
      onChangeText={onChangeText}
      error={error}
      errorText={errorText}
      autoCapitalize={autoCapitalize}
      autoCompleteType={autoCompleteType}
      textContentType={textContentType}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      description={description}
    />
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
jest.mock('../../components/shared/RegisterLink', () => ({
  RegisterLink: ({navigation}) => (
    <mock-register-link testID="register-link" navigation={navigation} />
  ),
}));

describe('LoginScreen', () => {
  // Mocks para los hooks
  const mockLogin = jest.fn();
  const mockValidateForm = jest.fn();
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
      login: mockLogin,
    });

    // Configuración predeterminada para useLoginForm
    (useLoginForm as jest.Mock).mockReturnValue({
      emailUser: {value: '', error: ''},
      passwordUser: {value: '', error: ''},
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm,
    });
  });

  it('debería renderizarse correctamente', () => {
    // Arrange - no es necesaria configuración adicional

    // Act
    const {toJSON} = render(<LoginScreen navigation={mockNavigation as any} />);

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar correctamente los componentes básicos', () => {
    // Arrange
    const expectedButtonText = 'Login';

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );

    // Assert
    expect(getByTestId('input-Correo')).toBeTruthy();
    expect(getByTestId('input-Contraseña')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
    expect(getByTestId('register-link')).toBeTruthy();
  });

  it('debería llamar a setEmail cuando se cambia el campo de correo', () => {
    // Arrange
    const newEmail = 'test@example.com';
    const expectedSetEmailArgs = {value: newEmail, error: ''};

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const emailInput = getByTestId('input-Correo');

    // Simular cambio en el campo de correo
    fireEvent(emailInput, 'onChangeText', newEmail);

    // Assert
    expect(mockSetEmail).toHaveBeenCalledWith(expectedSetEmailArgs);
  });

  it('debería llamar a setPassword cuando se cambia el campo de contraseña', () => {
    // Arrange
    const newPassword = 'password123';
    const expectedSetPasswordArgs = {value: newPassword, error: ''};

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const passwordInput = getByTestId('input-Contraseña');

    // Simular cambio en el campo de contraseña
    fireEvent(passwordInput, 'onChangeText', newPassword);

    // Assert
    expect(mockSetPassword).toHaveBeenCalledWith(expectedSetPasswordArgs);
  });

  it('debería llamar a validateForm y login cuando se presiona el botón de login con datos válidos', async () => {
    // Arrange
    const emailValue = 'valid@example.com';
    const passwordValue = 'password123';
    const expectedLoginArgs = {
      email: emailValue,
      password: passwordValue,
    };

    // Configurar valores válidos y mock de validateForm para devolver true
    (useLoginForm as jest.Mock).mockReturnValue({
      emailUser: {value: emailValue, error: ''},
      passwordUser: {value: passwordValue, error: ''},
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm.mockReturnValue(true),
    });

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const loginButton = getByTestId('login-button');

    // Simular clic en el botón de login
    await fireEvent.press(loginButton);

    // Assert
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith(expectedLoginArgs);
  });

  it('no debería llamar a login cuando validateForm devuelve false', async () => {
    // Arrange
    // Configurar mock de validateForm para devolver false
    mockValidateForm.mockReturnValue(false);

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const loginButton = getByTestId('login-button');

    // Simular clic en el botón de login
    await fireEvent.press(loginButton);

    // Assert
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debería desactivar el botón de login cuando loading es true', () => {
    // Arrange
    // Configurar loading como true
    (useAuth as jest.Mock).mockReturnValue({
      loading: true,
      error: '',
      login: mockLogin,
    });

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const loginButton = getByTestId('login-button');

    // Assert
    expect(loginButton.props.disabled).toBe(true);
  });

  it('debería mostrar un mensaje de error cuando hay un error de autenticación', () => {
    // Arrange
    const expectedError = 'Credenciales inválidas';

    // Configurar error
    (useAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: expectedError,
      login: mockLogin,
    });

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const loadingError = getByTestId('loading-error');

    // Assert
    expect(loadingError.props.error).toBe(expectedError);
  });

  it('debería pasar correctamente las propiedades a los campos de entrada', () => {
    // Arrange
    const emailValue = 'test@example.com';
    const emailError = 'Email inválido';
    const passwordValue = 'pass';
    const passwordError = 'Contraseña muy corta';

    // Configurar valores con errores
    (useLoginForm as jest.Mock).mockReturnValue({
      emailUser: {value: emailValue, error: emailError},
      passwordUser: {value: passwordValue, error: passwordError},
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      validateForm: mockValidateForm,
    });

    // Act
    const {getByTestId} = render(
      <LoginScreen navigation={mockNavigation as any} />,
    );
    const emailInput = getByTestId('input-Correo');
    const passwordInput = getByTestId('input-Contraseña');

    // Assert
    expect(emailInput.props.value).toBe(emailValue);
    expect(emailInput.props.error).toBe(true);
    expect(emailInput.props.errorText).toBe(emailError);
    expect(passwordInput.props.value).toBe(passwordValue);
    expect(passwordInput.props.error).toBe(true);
    expect(passwordInput.props.errorText).toBe(passwordError);
  });
});
