import React from 'react';
import {render} from '@testing-library/react-native';
import {MyIcon} from './MyIcon';
import {StyleSheet} from 'react-native';

// Mock para @ui-kitten/components
jest.mock('@ui-kitten/components', () => {
  const mockIcon = jest.fn(({style, fill, name}) => (
    <span
      style={style}
      data-fill={fill}
      data-name={name}
      data-testid={`icon-${name}`}
    />
  ));

  // Mock del hook useTheme
  const mockUseTheme = jest.fn(() => ({
    'color-info-100': '#FFFFFF',
    'text-basic-color': '#000000',
    'color-primary-500': '#560CCE',
  }));

  return {
    Icon: mockIcon,
    useTheme: mockUseTheme,
  };
});

describe('MyIcon Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizarse correctamente con el nombre del icono especificado', () => {
    // Arrange
    const iconName = 'plus-outline';
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} />);
    
    // Assert
    const icons = UNSAFE_getAllByType('span');
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].props['data-name']).toBe(iconName);
  });

  it('debería aplicar los estilos predeterminados', () => {
    // Arrange
    const iconName = 'edit-outline';
    const expectedStyles = {width: 30, height: 30};
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} />);
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    
    // Convertir los estilos a un objeto plano para comparar
    const flattenedStyles = StyleSheet.flatten(icon.props.style);
    
    Object.entries(expectedStyles).forEach(([key, value]) => {
      expect(flattenedStyles[key]).toEqual(value);
    });
  });

  it('debería utilizar el color básico por defecto', () => {
    // Arrange
    const iconName = 'edit-outline';
    const theme = require('@ui-kitten/components').useTheme();
    const expectedColor = theme['text-basic-color'];
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} />);
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    expect(icon.props['data-fill']).toBe(expectedColor);
  });

  it('debería utilizar color blanco cuando se especifica white=true', () => {
    // Arrange
    const iconName = 'edit-outline';
    const theme = require('@ui-kitten/components').useTheme();
    const expectedColor = theme['color-info-100']; // Valor blanco del tema
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} white={true} />);
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    expect(icon.props['data-fill']).toBe(expectedColor);
  });

  it('debería utilizar el color personalizado cuando se proporciona', () => {
    // Arrange
    const iconName = 'edit-outline';
    const colorName = 'color-primary-500';
    const theme = require('@ui-kitten/components').useTheme();
    const expectedColor = theme[colorName];
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} color={colorName} />);
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    expect(icon.props['data-fill']).toBe(expectedColor);
  });

  it('debería priorizar white=true sobre color personalizado', () => {
    // Arrange
    const iconName = 'edit-outline';
    const colorName = 'color-primary-500';
    const theme = require('@ui-kitten/components').useTheme();
    const expectedColor = theme['color-info-100']; // Valor blanco del tema
    
    // Act
    const {UNSAFE_getAllByType} = render(
      <MyIcon name={iconName} color={colorName} white={true} />,
    );
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    expect(icon.props['data-fill']).toBe(expectedColor);
  });

  it('debería usar text-basic-color cuando el color proporcionado no existe en el tema', () => {
    // Arrange
    const iconName = 'edit-outline';
    const nonExistentColor = 'color-that-does-not-exist';
    const theme = require('@ui-kitten/components').useTheme();
    const expectedColor = theme['text-basic-color']; // Color por defecto
    
    // Act
    const {UNSAFE_getAllByType} = render(<MyIcon name={iconName} color={nonExistentColor} />);
    
    // Assert
    const icon = UNSAFE_getAllByType('span')[0];
    expect(icon.props['data-fill']).toBe(expectedColor);
  });
});