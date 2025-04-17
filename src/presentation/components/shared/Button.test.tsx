import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Button from './Button';

// Mock para el tema
jest.mock('../../theme/theme', () => ({
  theme: {
    colors: {
      surface: '#ffffff',
      primary: '#560CCE',
      secondary: '#414757',
      error: '#f13a59',
    },
  },
}));

// Mock para react-native-paper Button
jest.mock('react-native-paper', () => {
  const mockPaperButton = jest.fn(
    ({
      children,
      mode,
      style,
      labelStyle,
      onPress,
      disabled,
      testID,
      ...rest
    }) => (
      <button
        onClick={onPress}
        disabled={disabled}
        style={style}
        data-testid={testID || `paper-button-${mode}`}
        data-labelstyle={JSON.stringify(labelStyle)}
        {...rest}>
        <span data-testid="button-text">{children}</span>
      </button>
    ),
  );

  return {
    Button: mockPaperButton,
    PaperProvider: ({children}) => <>{children}</>,
  };
});

describe('Button Component', () => {
  // Limpiamos todos los mocks después de cada test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizarse correctamente con el texto proporcionado', () => {
    // Arrange
    const buttonText = 'Texto del botón';
    const expectedMode = 'contained';
    const testID = 'paper-button-contained';

    // Act
    const {UNSAFE_getAllByType} = render(
      <Button mode={expectedMode} testID={testID}>
        {buttonText}
      </Button>,
    );

    // Assert
    const spans = UNSAFE_getAllByType('span');
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].props.children).toBe(buttonText);
  });

  it('debería pasar correctamente el modo al botón de Paper', () => {
    // Arrange
    const buttonText = 'Botón Outline';
    const expectedMode = 'outlined';

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode}>{buttonText}</Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');
    expect(buttonElement.props['data-testid']).toBe(
      `paper-button-${expectedMode}`,
    );
  });

  it('debería pasar correctamente los estilos según el modo', () => {
    // Arrange
    const buttonText = 'Botón con estilos';
    const expectedMode = 'outlined';
    const {theme} = require('../../theme/theme');

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode}>{buttonText}</Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');
    expect(buttonElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({backgroundColor: theme.colors.surface}),
      ]),
    );
  });

  it('debería aplicar estilos personalizados cuando se proporcionan', () => {
    // Arrange
    const buttonText = 'Botón personalizado';
    const expectedMode = 'contained';
    const customStyle = {backgroundColor: '#ff0000', borderRadius: 10};

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode} style={customStyle}>
        {buttonText}
      </Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');
    expect(buttonElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)]),
    );
  });

  it('debería pasar correctamente el callback onPress', () => {
    // Arrange
    const buttonText = 'Presionar';
    const mockOnPress = jest.fn();
    const expectedCallCount = 1;

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode="contained" onPress={mockOnPress}>
        {buttonText}
      </Button>,
    );

    // Simulamos el evento press en el botón
    const buttonElement = UNSAFE_getByType('button');
    fireEvent.press(buttonElement);

    // Assert
    expect(mockOnPress).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería pasar correctamente la propiedad disabled', () => {
    // Arrange
    const buttonText = 'Botón deshabilitado';
    const expectedMode = 'contained';
    const isDisabled = true;

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode} disabled={isDisabled}>
        {buttonText}
      </Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');
    expect(buttonElement.props.disabled).toBe(isDisabled);
  });

  it('debería aplicar los estilos base a todos los botones', () => {
    // Arrange
    const buttonText = 'Botón con estilos base';
    const expectedMode = 'contained';
    const expectedBaseStyles = {
      width: '100%',
      marginVertical: 10,
      paddingVertical: 2,
    };

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode}>{buttonText}</Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');
    expect(buttonElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(expectedBaseStyles)]),
    );
  });

  it('debería aplicar los estilos de texto a todos los botones', () => {
    // Arrange
    const buttonText = 'Botón con estilos de texto';
    const expectedMode = 'contained';
    const expectedTextStyles = {
      fontWeight: 'bold',
      fontSize: 15,
      lineHeight: 26,
    };

    // Act
    const {UNSAFE_getByType} = render(
      <Button mode={expectedMode}>{buttonText}</Button>,
    );

    // Assert
    const buttonElement = UNSAFE_getByType('button');

    const labelStyleAttr = buttonElement.props['data-labelstyle'];
    expect(labelStyleAttr).toBeTruthy();

    const parsedLabelStyle = JSON.parse(labelStyleAttr);
    expect(parsedLabelStyle).toEqual(
      expect.objectContaining(expectedTextStyles),
    );
  });
});
