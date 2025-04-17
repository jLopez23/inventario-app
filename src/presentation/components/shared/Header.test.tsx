import React from 'react';
import {render} from '@testing-library/react-native';
import Header from './Header';

// Mock para react-native-paper Text
jest.mock('react-native-paper', () => ({
  Text: ({style, children, ...props}) => (
    // Aseguramos que el componente renderizado tenga el mismo nombre que el original
    // y también pasamos el data-testid directamente
    <text testID="paper-text" style={style} {...props}>
      {children}
    </text>
  ),
}));

// Mock para el tema
jest.mock('../../theme/theme', () => ({
  theme: {
    colors: {
      primary: '#560CCE',
      secondary: '#414757',
      error: '#f13a59',
    },
  },
}));

describe('Header Component', () => {
  it('debería renderizarse correctamente con el texto proporcionado', () => {
    // Arrange
    const headerText = 'Título de Prueba';

    // Act
    const {UNSAFE_getByType, getByTestId} = render(
      <Header>{headerText}</Header>,
    );

    // Assert
    const textElement = UNSAFE_getByType('text');
    expect(textElement).toBeTruthy();
    // Usamos getByTestId en lugar de getByText para asegurar que encontramos el elemento
    expect(textElement.props.children).toBe(headerText);
  });

  it('debería aplicar los estilos correctos', () => {
    // Arrange
    const headerText = 'Prueba de Estilos';
    const {theme} = require('../../theme/theme');
    const expectedStyles = {
      fontSize: 21,
      color: theme.colors.primary,
      fontWeight: 'bold',
      paddingVertical: 12,
    };

    // Act
    const {UNSAFE_getByType} = render(<Header>{headerText}</Header>);

    // Assert
    const textElement = UNSAFE_getByType('text');
    expect(textElement.props.style).toEqual(
      expect.objectContaining(expectedStyles),
    );
  });

  it('debería pasar props adicionales al componente Text', () => {
    // Arrange
    const headerText = 'Texto con Props';
    const testID = 'custom-header';
    const numberOfLines = 2;
    const accessibilityLabel = 'Encabezado de prueba';

    // Act
    const {UNSAFE_getByType} = render(
      <Header
        testID={testID}
        numberOfLines={numberOfLines}
        accessibilityLabel={accessibilityLabel}>
        {headerText}
      </Header>,
    );

    // Assert
    // Cambiamos a usar UNSAFE_getByType que está funcionando
    const textElement = UNSAFE_getByType('text');
    expect(textElement.props.testID).toBe(testID);
    expect(textElement.props.numberOfLines).toBe(numberOfLines);
    expect(textElement.props.accessibilityLabel).toBe(accessibilityLabel);
  });

  it('debería renderizar correctamente con texto vacío', () => {
    // Arrange
    const emptyText = '';

    // Act
    const {UNSAFE_getByType} = render(<Header>{emptyText}</Header>);

    // Assert
    const textElement = UNSAFE_getByType('text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe(emptyText);
  });

  it('debería renderizar correctamente con texto null', () => {
    // Arrange
    const nullText = null;

    // Act
    const {UNSAFE_getByType} = render(<Header>{nullText}</Header>);

    // Assert
    const textElement = UNSAFE_getByType('text');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe(nullText);
  });
});
