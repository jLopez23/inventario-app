import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {FAB} from './FAB';
import {StyleSheet} from 'react-native';

// Mock para @ui-kitten/components y sus componentes utilizados
jest.mock('@ui-kitten/components', () => {
  const mockButton = jest.fn(({style, accessoryLeft, onPress, testID}) => (
    <button
      style={style}
      onClick={onPress}
      data-testid={testID || 'ui-kitten-button'}>
      {accessoryLeft}
    </button>
  ));

  return {
    Button: mockButton,
  };
});

// Mock para MyIcon
jest.mock('./MyIcon', () => ({
  MyIcon: jest.fn(({name, white}) => (
    <span data-testid={`icon-${name}`} data-white={white} />
  )),
}));

describe('FAB Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizarse correctamente con el icono especificado', () => {
    // Arrange
    const iconName = 'plus-outline';
    const mockOnPress = jest.fn();

    // Act
    const {UNSAFE_getAllByType} = render(
      <FAB iconName={iconName} onPress={mockOnPress} />,
    );

    // Assert
    const icons = UNSAFE_getAllByType('span');
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].props['data-testid']).toBe(`icon-${iconName}`);
    expect(icons[0].props['data-white']).toBe(true);
  });

  it('debería aplicar los estilos predeterminados', () => {
    // Arrange
    const iconName = 'edit-outline';
    const mockOnPress = jest.fn();
    const expectedShadowStyles = {
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 3,
      borderRadius: 13,
    };

    // Act
    const {UNSAFE_getByType} = render(
      <FAB iconName={iconName} onPress={mockOnPress} />,
    );

    // Assert
    const button = UNSAFE_getByType('button');
    const buttonStyle = StyleSheet.flatten(button.props.style[1]);

    Object.entries(expectedShadowStyles).forEach(([key, value]) => {
      expect(buttonStyle[key]).toEqual(value);
    });
  });

  it('debería aplicar estilos personalizados cuando se proporcionan', () => {
    // Arrange
    const iconName = 'plus-outline';
    const mockOnPress = jest.fn();
    const customStyle = {backgroundColor: 'red', margin: 10};

    // Act
    const {UNSAFE_getByType} = render(
      <FAB iconName={iconName} onPress={mockOnPress} style={customStyle} />,
    );

    // Assert
    const button = UNSAFE_getByType('button');
    const buttonStyle = StyleSheet.flatten(button.props.style[0]);

    Object.entries(customStyle).forEach(([key, value]) => {
      expect(buttonStyle[key]).toEqual(value);
    });
  });

  it('debería llamar a la función onPress cuando se presiona', () => {
    // Arrange
    const iconName = 'plus-outline';
    const mockOnPress = jest.fn();
    const expectedCallCount = 1;

    // Act
    const {UNSAFE_getByType} = render(
      <FAB iconName={iconName} onPress={mockOnPress} />,
    );

    const button = UNSAFE_getByType('button');
    fireEvent.press(button);

    // Assert
    expect(mockOnPress).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería combinar correctamente los estilos predeterminados y personalizados', () => {
    // Arrange
    const iconName = 'plus-outline';
    const mockOnPress = jest.fn();
    const customStyle = {position: 'absolute', bottom: 20, right: 20};
    const expectedStyleKeys = [
      ...Object.keys(customStyle),
      'shadowColor',
      'shadowOffset',
      'shadowOpacity',
      'shadowRadius',
      'elevation',
      'borderRadius',
    ];

    // Act
    const {UNSAFE_getByType} = render(
      <FAB iconName={iconName} onPress={mockOnPress} style={customStyle} />,
    );

    // Assert
    const button = UNSAFE_getByType('button');
    const combinedStyles = StyleSheet.flatten([
      button.props.style[0],
      button.props.style[1],
    ]);

    expectedStyleKeys.forEach(key => {
      expect(combinedStyles).toHaveProperty(key);
    });
  });
});
