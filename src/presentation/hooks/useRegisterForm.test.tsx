import {renderHook, act} from '@testing-library/react-native';
import {useRegisterForm} from './useRegisterForm';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';
import {nameValidator} from '../../helpers/nameValidator';

// Mocks para los validadores
jest.mock('../../helpers/emailValidator', () => ({
  emailValidator: jest.fn(),
}));

jest.mock('../../helpers/passwordValidator', () => ({
  passwordValidator: jest.fn(),
}));

jest.mock('../../helpers/nameValidator', () => ({
  nameValidator: jest.fn(),
}));

describe('useRegisterForm Hook', () => {
  // Setup común para los tests
  const mockEmailValidator = emailValidator as jest.MockedFunction<
    typeof emailValidator
  >;
  const mockPasswordValidator = passwordValidator as jest.MockedFunction<
    typeof passwordValidator
  >;
  const mockNameValidator = nameValidator as jest.MockedFunction<
    typeof nameValidator
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializar correctamente los valores del formulario', () => {
    // Arrange
    const expectedInitialName = {value: '', error: ''};
    const expectedInitialEmail = {value: '', error: ''};
    const expectedInitialPassword = {value: '', error: ''};

    // Act
    const {result} = renderHook(() => useRegisterForm());

    // Assert
    expect(result.current.nameUser).toEqual(expectedInitialName);
    expect(result.current.emailUser).toEqual(expectedInitialEmail);
    expect(result.current.passwordUser).toEqual(expectedInitialPassword);
  });

  it('debería actualizar el valor del nombre', () => {
    // Arrange
    const initialValue = '';
    const newNameValue = 'John Doe';
    const expectedNameState = {value: newNameValue, error: ''};

    // Act
    const {result} = renderHook(() => useRegisterForm());

    // Verificar valor inicial
    expect(result.current.nameUser.value).toBe(initialValue);

    // Actualizar nombre
    act(() => {
      result.current.setName(expectedNameState);
    });

    // Assert
    expect(result.current.nameUser).toEqual(expectedNameState);
  });

  it('debería actualizar el valor del email', () => {
    // Arrange
    const initialValue = '';
    const newEmailValue = 'test@example.com';
    const expectedEmailState = {value: newEmailValue, error: ''};

    // Act
    const {result} = renderHook(() => useRegisterForm());

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
    const {result} = renderHook(() => useRegisterForm());

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
      const validName = 'John Doe';
      const validEmail = 'valid@example.com';
      const validPassword = 'valid-password123';
      const expectedValidationResult = true;

      // Configurar los mocks para que no devuelvan errores
      mockNameValidator.mockReturnValue('');
      mockEmailValidator.mockReturnValue('');
      mockPasswordValidator.mockReturnValue('');

      // Act
      const {result} = renderHook(() => useRegisterForm());

      // Configurar valores válidos
      act(() => {
        result.current.setName({value: validName, error: ''});
        result.current.setEmail({value: validEmail, error: ''});
        result.current.setPassword({value: validPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockNameValidator).toHaveBeenCalledWith(validName);
      expect(mockEmailValidator).toHaveBeenCalledWith(validEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(validPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.nameUser.error).toBe('');
      expect(result.current.emailUser.error).toBe('');
      expect(result.current.passwordUser.error).toBe('');
    });

    it('debería retornar false cuando hay error en nombre', () => {
      // Arrange
      const invalidName = '';
      const validEmail = 'valid@example.com';
      const validPassword = 'valid-password123';
      const expectedNameError = 'El nombre no puede estar vacío';
      const expectedValidationResult = false;

      // Configurar los mocks
      mockNameValidator.mockReturnValue(expectedNameError);
      mockEmailValidator.mockReturnValue('');
      mockPasswordValidator.mockReturnValue('');

      // Act
      const {result} = renderHook(() => useRegisterForm());

      // Configurar valores para validación
      act(() => {
        result.current.setName({value: invalidName, error: ''});
        result.current.setEmail({value: validEmail, error: ''});
        result.current.setPassword({value: validPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockNameValidator).toHaveBeenCalledWith(invalidName);
      expect(mockEmailValidator).toHaveBeenCalledWith(validEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(validPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.nameUser.error).toBe(expectedNameError);
      expect(result.current.emailUser.error).toBe('');
      expect(result.current.passwordUser.error).toBe('');
    });

    it('debería retornar false cuando hay error en email', () => {
      // Arrange
      const validName = 'John Doe';
      const invalidEmail = 'invalid-email';
      const validPassword = 'valid-password123';
      const expectedEmailError = 'El email no es válido';
      const expectedValidationResult = false;

      // Configurar los mocks
      mockNameValidator.mockReturnValue('');
      mockEmailValidator.mockReturnValue(expectedEmailError);
      mockPasswordValidator.mockReturnValue('');

      // Act
      const {result} = renderHook(() => useRegisterForm());

      // Configurar valores para validación
      act(() => {
        result.current.setName({value: validName, error: ''});
        result.current.setEmail({value: invalidEmail, error: ''});
        result.current.setPassword({value: validPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockNameValidator).toHaveBeenCalledWith(validName);
      expect(mockEmailValidator).toHaveBeenCalledWith(invalidEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(validPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.nameUser.error).toBe('');
      expect(result.current.emailUser.error).toBe(expectedEmailError);
      expect(result.current.passwordUser.error).toBe('');
    });

    it('debería retornar false cuando hay error en contraseña', () => {
      // Arrange
      const validName = 'John Doe';
      const validEmail = 'valid@example.com';
      const invalidPassword = '123'; // Contraseña demasiado corta
      const expectedPasswordError =
        'La contraseña debe tener al menos 5 caracteres';
      const expectedValidationResult = false;

      // Configurar los mocks
      mockNameValidator.mockReturnValue('');
      mockEmailValidator.mockReturnValue('');
      mockPasswordValidator.mockReturnValue(expectedPasswordError);

      // Act
      const {result} = renderHook(() => useRegisterForm());

      // Configurar valores para validación
      act(() => {
        result.current.setName({value: validName, error: ''});
        result.current.setEmail({value: validEmail, error: ''});
        result.current.setPassword({value: invalidPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockNameValidator).toHaveBeenCalledWith(validName);
      expect(mockEmailValidator).toHaveBeenCalledWith(validEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(invalidPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.nameUser.error).toBe('');
      expect(result.current.emailUser.error).toBe('');
      expect(result.current.passwordUser.error).toBe(expectedPasswordError);
    });

    it('debería retornar false cuando hay múltiples errores', () => {
      // Arrange
      const invalidName = '';
      const invalidEmail = 'invalid-email';
      const invalidPassword = '123'; // Contraseña demasiado corta
      const expectedNameError = 'El nombre no puede estar vacío';
      const expectedEmailError = 'El email no es válido';
      const expectedPasswordError =
        'La contraseña debe tener al menos 5 caracteres';
      const expectedValidationResult = false;

      // Configurar los mocks con errores en todos los campos
      mockNameValidator.mockReturnValue(expectedNameError);
      mockEmailValidator.mockReturnValue(expectedEmailError);
      mockPasswordValidator.mockReturnValue(expectedPasswordError);

      // Act
      const {result} = renderHook(() => useRegisterForm());

      // Configurar valores para validación
      act(() => {
        result.current.setName({value: invalidName, error: ''});
        result.current.setEmail({value: invalidEmail, error: ''});
        result.current.setPassword({value: invalidPassword, error: ''});
      });

      // Ejecutar validación
      let validationResult;
      act(() => {
        validationResult = result.current.validateForm();
      });

      // Assert
      expect(mockNameValidator).toHaveBeenCalledWith(invalidName);
      expect(mockEmailValidator).toHaveBeenCalledWith(invalidEmail);
      expect(mockPasswordValidator).toHaveBeenCalledWith(invalidPassword);
      expect(validationResult).toBe(expectedValidationResult);
      expect(result.current.nameUser.error).toBe(expectedNameError);
      expect(result.current.emailUser.error).toBe(expectedEmailError);
      expect(result.current.passwordUser.error).toBe(expectedPasswordError);
    });
  });
});
