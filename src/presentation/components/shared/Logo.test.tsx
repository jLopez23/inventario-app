import React from 'react';
import {render} from '@testing-library/react-native';
import {Image} from 'react-native';
import Logo from './Logo';

// Mock del recurso de imagen
jest.mock('../../../assets/logo.png', () => 'mocked-logo-image');

describe('Logo Component', () => {
  it('debería renderizarse correctamente', () => {
    // Arrange & Act
    const {toJSON} = render(<Logo />);

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar la imagen correcta', () => {
    // Arrange
    const expectedImageSource = 'mocked-logo-image';

    // Act
    const {UNSAFE_getByType} = render(<Logo />);
    const imageElement = UNSAFE_getByType(Image);

    // Assert
    expect(imageElement.props.source).toBe(expectedImageSource);
  });

  it('debería aplicar los estilos correctos a la imagen', () => {
    // Arrange
    const expectedStyles = {
      width: 110,
      height: 110,
      marginBottom: 8,
    };

    // Act
    const {UNSAFE_getByType} = render(<Logo />);
    const imageElement = UNSAFE_getByType(Image);

    // Assert
    expect(imageElement.props.style).toEqual(
      expect.objectContaining(expectedStyles),
    );
  });

  it('debería renderizar solo un componente Image', () => {
    // Arrange
    const expectedImageCount = 1;

    // Act
    const {UNSAFE_getAllByType} = render(<Logo />);
    const imageElements = UNSAFE_getAllByType(Image);

    // Assert
    expect(imageElements.length).toBe(expectedImageCount);
  });

  it('debería mantener las proporciones correctas de la imagen', () => {
    // Arrange
    const expectedAspectRatio = 1; // width === height para una imagen cuadrada

    // Act
    const {UNSAFE_getByType} = render(<Logo />);
    const imageElement = UNSAFE_getByType(Image);
    const aspectRatio =
      imageElement.props.style.width / imageElement.props.style.height;

    // Assert
    expect(aspectRatio).toBe(expectedAspectRatio);
  });
});
