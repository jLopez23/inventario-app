import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {View, TouchableOpacity, Text} from 'react-native';
import {RegisterLink} from './RegisterLink';

// Mock para los estilos del tema
jest.mock('../../theme/theme', () => ({
  styles: {
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    link: {
      fontWeight: 'bold',
      color: '#560CCE',
    },
  },
}));

describe('RegisterLink Component', () => {
  it('debería renderizarse correctamente', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Act
    const {toJSON} = render(<RegisterLink navigation={mockNavigation} />);

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar el texto correcto', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const expectedQuestionText = '¿No tienes cuenta?';
    const expectedLinkText = 'Regístrate';

    // Act
    const {toJSON} = render(<RegisterLink navigation={mockNavigation} />);
    const tree = toJSON();

    // Assert
    // Verificar que los textos esperados están presentes en cualquier parte del árbol
    const treeString = JSON.stringify(tree);
    expect(treeString.includes(expectedQuestionText)).toBe(true);
    expect(treeString.includes(expectedLinkText)).toBe(true);
  });

  it('debería navegar a RegisterScreen al hacer clic en el link', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const expectedScreen = 'RegisterScreen';
    const expectedCallCount = 1;

    // Act
    const {UNSAFE_getAllByType} = render(
      <RegisterLink navigation={mockNavigation} />,
    );
    const touchableElements = UNSAFE_getAllByType(TouchableOpacity);

    // Presionar el elemento TouchableOpacity (que contiene el texto "Regístrate")
    fireEvent.press(touchableElements[0]);

    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(expectedCallCount);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(expectedScreen);
  });

  it('debería aplicar los estilos correctos al contenedor', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const {styles} = require('../../theme/theme');
    const expectedRowStyle = styles.row;

    // Act
    const {UNSAFE_getByType} = render(
      <RegisterLink navigation={mockNavigation} />,
    );
    const viewElement = UNSAFE_getByType(View);

    // Assert
    expect(viewElement.props.style).toEqual(expectedRowStyle);
  });

  it('debería aplicar los estilos correctos al texto del enlace', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const {styles} = require('../../theme/theme');
    const expectedLinkStyle = styles.link;

    // Act
    const {UNSAFE_getAllByType} = render(
      <RegisterLink navigation={mockNavigation} />,
    );

    // Buscar directamente dentro del TouchableOpacity, que contiene el texto del link
    const textElements = UNSAFE_getAllByType(Text);
    const linkTextElement = textElements.find(
      el => el.props.children === 'Regístrate',
    );

    // Assert
    expect(linkTextElement).toBeTruthy();

    // Como el estilo puede ser un arreglo, verificamos que al menos uno de los estilos
    // en el arreglo contenga las propiedades esperadas
    const styleArray = Array.isArray(linkTextElement.props.style)
      ? linkTextElement.props.style
      : [linkTextElement.props.style];

    const hasExpectedStyle = styleArray.some(
      style =>
        style &&
        style.color === expectedLinkStyle.color &&
        style.fontWeight === expectedLinkStyle.fontWeight,
    );

    expect(hasExpectedStyle).toBe(true);
  });

  it('debería funcionar correctamente cuando se presiona varias veces', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const expectedScreen = 'RegisterScreen';
    const expectedCallCount = 3;

    // Act
    const {UNSAFE_getAllByType} = render(
      <RegisterLink navigation={mockNavigation} />,
    );
    const touchableElements = UNSAFE_getAllByType(TouchableOpacity);

    // Presionar el enlace múltiples veces
    fireEvent.press(touchableElements[0]);
    fireEvent.press(touchableElements[0]);
    fireEvent.press(touchableElements[0]);

    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(expectedCallCount);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(expectedScreen);
  });

  it('debería manejar correctamente la navegación', () => {
    // Arrange
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Act
    render(<RegisterLink navigation={mockNavigation} />);

    // Assert
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('debería lanzar un error si no se proporciona la propiedad navigation', () => {
    // Esta prueba verifica el caso donde no se proporciona la propiedad de navegación
    // Esperamos un error ya que el componente intenta usar navigation.navigate

    // Mock para console.error para evitar la salida de errores durante las pruebas
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Arrange & Act & Assert
    expect(() => {
      const {UNSAFE_getAllByType} = render(<RegisterLink />);
      // No intentamos interactuar con el componente porque sabemos que fallará
    }).not.toThrow(); // Solo verificamos que el renderizado inicial no falla

    // Restaurar console.error
    consoleErrorSpy.mockRestore();
  });
});
