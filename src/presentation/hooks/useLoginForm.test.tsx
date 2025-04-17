import {renderHook, act} from '@testing-library/react-native';
import {useLoginForm} from './useLoginForm';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';

// Mocks para los validadores
jest.mock('../../helpers/emailValidator', () => ({
  emailValidator: jest.fn(),
}));

jest.mock('../../helpers/passwordValidator', () => ({
  passwordValidator: jest.fn(),
}));

describe('useLoginForm Hook', () => {
  // Setup común para los tests
  const mockEmailValidator = emailValidator as jest.MockedFunction<
    typeof emailValidator
  >;
  const mockPasswordValidator = passwordValidator as jest.MockedFunction<
    typeof passwordValidator
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializar correctamente los valores del formulario', () => {
    // Arrange
    const expectedInitialEmail = {value: '', error: ''};
    const expectedInitialPassword = {value: '', error: ''};

    // Act
    const {result} = renderHook(() => useLoginForm());

    // Assert
    expect(result.current.emailUser).toEqual(expectedInitialEmail);
    expect(result.current.passwordUser).toEqual(expectedInitialPassword);
  });

  it('debería actualizar el valor del email', () => {
    // Arrange
    const initialValue = '';
    const newEmailValue = 'test@example.com';
    const expectedEmailState = {value: newEmailValue, error: ''};

    // Act
    const {result} = renderHook(() => useLoginForm());

    // Verificar valor inicial
    expect(result.current.emailUser.value).toBe(initialValue);

    // Actualizar email
    act(() => {
      result.current.setEmail(expectedEmailState);
    });

    // Assert
    expect(result.current.emailUser).toEqual(expectedEmailState);
  });

  it('debería actualizar el valor de la contraseña', () => {
    // Arrange
    const initialValue = '';
    const newPasswordValue = 'password123';
    const expectedPasswordState = {value: newPasswordValue, error: ''};

    // Act
    const {result} = renderHook(() => useLoginForm());

    // Verificar valor inicial
    expect(result.current.passwordUser.value).toBe(initialValue);

    // Actualizar contraseña
    act(() => {
      result.current.setPassword(expectedPasswordState);
    });

    // Assert
    expect(result.current.passwordUser).toEqual(expectedPasswordState);
  });

  describe('validateForm', () => {
    it('debería retornar true cuando no hay errores de validación', () => {
      // Arrange
      const validEmail = 'valid@example.com';
      const validPassword = 'valid-password123';
      const expectedValidationResult = true;

      // Configurar los mocks para que no devuelvan errores
      mockEmailValidator.mockReturnValue('');
      mockPasswordValidator.mockReturnValue('');

      // Act
      const {result} = renderHook(() => useLoginForm());

      // Configurar valores válidos
      act(() => {
        result.current.setEmail({value: validEmail, error: ''});
        result.current.setPassword({value: validPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockEmailValidator).toHaveBeenCalledWith(validEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(validPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.emailUser.error).toBe('');
      expect(result.current.passwordUser.error).toBe('');
    });

    it('debería retornar false cuando hay errores de validación en email', () => {
      // Arrange
      const invalidEmail = 'invalid-email';
      const validPassword = 'valid-password123';
      const expectedEmailError = 'El email no es válido';
      const expectedValidationResult = false;

      // Configurar los mocks con el error de email
      mockEmailValidator.mockReturnValue(expectedEmailError);
      mockPasswordValidator.mockReturnValue('');

      // Act
      const {result} = renderHook(() => useLoginForm());

      // Configurar valores para validación
      act(() => {
        result.current.setEmail({value: invalidEmail, error: ''});
        result.current.setPassword({value: validPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockEmailValidator).toHaveBeenCalledWith(invalidEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(validPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.emailUser.error).toBe(expectedEmailError);
      expect(result.current.passwordUser.error).toBe('');
    });

    it('debería retornar false cuando hay errores de validación en contraseña', () => {
      // Arrange
      const validEmail = 'valid@example.com';
      const invalidPassword = '123'; // Contraseña demasiado corta
      const expectedPasswordError =
        'La contraseña debe tener al menos 5 caracteres';
      const expectedValidationResult = false;

      // Configurar los mocks con el error de contraseña
      mockEmailValidator.mockReturnValue('');
      mockPasswordValidator.mockReturnValue(expectedPasswordError);

      // Act
      const {result} = renderHook(() => useLoginForm());

      // Configurar valores para validación
      act(() => {
        result.current.setEmail({value: validEmail, error: ''});
        result.current.setPassword({value: invalidPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockEmailValidator).toHaveBeenCalledWith(validEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(invalidPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.emailUser.error).toBe('');
      expect(result.current.passwordUser.error).toBe(expectedPasswordError);
    });

    it('debería retornar false cuando hay errores de validación en ambos campos', () => {
      // Arrange
      const invalidEmail = 'invalid-email';
      const invalidPassword = '123'; // Contraseña demasiado corta
      const expectedEmailError = 'El email no es válido';
      const expectedPasswordError =
        'La contraseña debe tener al menos 5 caracteres';
      const expectedValidationResult = false;

      // Configurar los mocks con errores en ambos campos
      mockEmailValidator.mockReturnValue(expectedEmailError);
      mockPasswordValidator.mockReturnValue(expectedPasswordError);

      // Act
      const {result} = renderHook(() => useLoginForm());

      // Configurar valores para validación
      act(() => {
        result.current.setEmail({value: invalidEmail, error: ''});
        result.current.setPassword({value: invalidPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockEmailValidator).toHaveBeenCalledWith(invalidEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(invalidPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.emailUser.error).toBe(expectedEmailError);
      expect(result.current.passwordUser.error).toBe(expectedPasswordError);
    });
  });
});
