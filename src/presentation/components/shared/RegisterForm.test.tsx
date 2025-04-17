import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {RegisterForm} from './RegisterForm';

// Mock para el componente TextInput
jest.mock('./TextInput', () => {
  return function MockTextInput({
    label,
    value,
    onChangeText,
    error,
    errorText,
    secureTextEntry,
    description,
    returnKeyType,
    autoCapitalize,
    autoCompleteType,
    textContentType,
    keyboardType,
    ...props
  }) {
    return (
      <input
        aria-label={label}
        value={value}
        onChangeText={onChangeText}
        error={error}
        errorText={errorText}
        secureTextEntry={secureTextEntry}
        description={description}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        autoCompleteType={autoCompleteType}
        textContentType={textContentType}
        keyboardType={keyboardType}
        {...props}
      />
    );
  };
});

describe('RegisterForm Component', () => {
  const mockNameUser = {value: '', error: ''};
  const mockEmailUser = {value: '', error: ''};
  const mockPasswordUser = {value: '', error: ''};
  const mockSetName = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizarse correctamente', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };

    const {toJSON} = render(<RegisterForm {...props} />);

    expect(toJSON()).toBeTruthy();
  });

  it('debería renderizar los 3 campos de entrada correctamente', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };
    const expectedLabels = ['Nombre', 'Correo', 'Contraseña'];

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');
    expect(inputs.length).toBe(3);

    expectedLabels.forEach((label, index) => {
      expect(inputs[index].props['aria-label']).toBe(label);
    });
  });

  it('debería pasar los valores correctos a cada campo', () => {
    const customNameUser = {value: 'John Doe', error: ''};
    const customEmailUser = {value: 'john@example.com', error: ''};
    const customPasswordUser = {value: 'password123', error: ''};

    const props = {
      nameUser: customNameUser,
      emailUser: customEmailUser,
      passwordUser: customPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');

    expect(inputs[0].props.value).toBe(customNameUser.value);
    expect(inputs[1].props.value).toBe(customEmailUser.value);
    expect(inputs[2].props.value).toBe(customPasswordUser.value);
  });

  it('debería mostrar los mensajes de error cuando están presentes', () => {
    const customNameUser = {
      value: 'John',
      error: 'El nombre debe tener al menos 5 caracteres',
    };
    const customEmailUser = {value: 'invalid-email', error: 'Email inválido'};
    const customPasswordUser = {
      value: '123',
      error: 'La contraseña es muy corta',
    };

    const props = {
      nameUser: customNameUser,
      emailUser: customEmailUser,
      passwordUser: customPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');

    expect(inputs[0].props.errorText).toBe(customNameUser.error);
    expect(inputs[1].props.errorText).toBe(customEmailUser.error);
    expect(inputs[2].props.errorText).toBe(customPasswordUser.error);

    expect(inputs[0].props.error).toBe(true);
    expect(inputs[1].props.error).toBe(true);
    expect(inputs[2].props.error).toBe(true);
  });

  it('debería llamar a setName cuando se cambia el campo de nombre', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };
    const newName = 'Nuevo Nombre';
    const expectedSetNameArgs = {value: newName, error: ''};

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');
    const nameInput = inputs[0];

    // Usar onChangeText directamente que es el prop que espera TextInput en React Native
    fireEvent(nameInput, 'onChangeText', newName);

    expect(mockSetName).toHaveBeenCalledWith(expectedSetNameArgs);
    expect(mockSetEmail).not.toHaveBeenCalled();
    expect(mockSetPassword).not.toHaveBeenCalled();
  });

  it('debería llamar a setEmail cuando se cambia el campo de email', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };
    const newEmail = 'nuevo@example.com';
    const expectedSetEmailArgs = {value: newEmail, error: ''};

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');
    const emailInput = inputs[1];

    // Usar onChangeText directamente que es el prop que espera TextInput en React Native
    fireEvent(emailInput, 'onChangeText', newEmail);

    expect(mockSetEmail).toHaveBeenCalledWith(expectedSetEmailArgs);
    expect(mockSetName).not.toHaveBeenCalled();
    expect(mockSetPassword).not.toHaveBeenCalled();
  });

  it('debería llamar a setPassword cuando se cambia el campo de contraseña', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };
    const newPassword = 'nuevaContraseña123';
    const expectedSetPasswordArgs = {value: newPassword, error: ''};

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');
    const passwordInput = inputs[2];

    // Usar onChangeText directamente que es el prop que espera TextInput en React Native
    fireEvent(passwordInput, 'onChangeText', newPassword);

    expect(mockSetPassword).toHaveBeenCalledWith(expectedSetPasswordArgs);
    expect(mockSetName).not.toHaveBeenCalled();
    expect(mockSetEmail).not.toHaveBeenCalled();
  });

  it('debería configurar correctamente las propiedades de los campos de entrada', () => {
    const props = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      passwordUser: mockPasswordUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };

    const {UNSAFE_getAllByType} = render(<RegisterForm {...props} />);
    const inputs = UNSAFE_getAllByType('input');
    const nameInput = inputs[0];
    const emailInput = inputs[1];
    const passwordInput = inputs[2];

    expect(nameInput.props.returnKeyType).toBe('next');
    expect(emailInput.props.returnKeyType).toBe('next');
    expect(emailInput.props.autoCapitalize).toBe('none');
    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(passwordInput.props.returnKeyType).toBe('done');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('debería manejar correctamente valores extremos en las props', () => {
    const extremeProps = {
      nameUser: {value: 'a'.repeat(100), error: 'e'.repeat(100)},
      emailUser: {value: null, error: undefined},
      passwordUser: {value: '', error: null},
      setName: jest.fn(),
      setEmail: jest.fn(),
      setPassword: jest.fn(),
    };

    expect(() => render(<RegisterForm {...extremeProps} />)).not.toThrow();
  });

  it('debería lanzar error si faltan props requeridas', () => {
    const incompleteProps = {
      nameUser: mockNameUser,
      emailUser: mockEmailUser,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
    };

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<RegisterForm {...incompleteProps} />)).toThrow();

    consoleErrorSpy.mockRestore();
  });
});
