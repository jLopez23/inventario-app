import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {ProductImages} from './ProductImages';
import {Image, FlatList} from 'react-native';
import {FadeInImage} from '../ui/FadeInImage';

// Mock del componente FadeInImage
jest.mock('../ui/FadeInImage', () => ({
  FadeInImage: jest.fn(({uri, style}) => (
    <mock-fade-in-image uri={uri} style={style} testID="fade-in-image" />
  )),
}));

describe('ProductImages Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar la imagen por defecto cuando el array de imágenes está vacío', () => {
    // Arrange
    const emptyImages: string[] = [];
    const expectedDefaultImageSource = require('../../../assets/no-product-image.png');
    const expectedImageStyle = {width: 300, height: 300};

    // Act
    render(<ProductImages images={emptyImages} />);

    // Assert
    const defaultImage = screen.UNSAFE_getByType(Image);
    expect(defaultImage.props.source).toEqual(expectedDefaultImageSource);
    expect(defaultImage.props.style).toEqual(expectedImageStyle);
  });

  it('debería mostrar un FlatList con imágenes cuando el array de imágenes no está vacío', () => {
    // Arrange
    const mockImages = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ];

    // Act
    render(<ProductImages images={mockImages} />);

    // Assert
    const flatList = screen.UNSAFE_getByType(FlatList);
    expect(flatList).toBeTruthy();
    expect(flatList.props.data).toEqual(mockImages);
    expect(flatList.props.horizontal).toBe(true);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(false);
    expect(flatList.props.testID).toBe('product-image-list');
  });

  it('debería utilizar la función keyExtractor correctamente en el FlatList', () => {
    // Arrange
    const mockImages = ['https://example.com/image1.jpg'];
    const testImageUrl = 'https://example.com/test.jpg';
    const expectedKey = testImageUrl;

    // Act
    render(<ProductImages images={mockImages} />);
    const flatList = screen.UNSAFE_getByType(FlatList);
    const resultKey = flatList.props.keyExtractor(testImageUrl);

    // Assert
    expect(resultKey).toBe(expectedKey);
  });

  it('debería renderizar FadeInImage para cada elemento en el FlatList con propiedades correctas', () => {
    // Arrange
    const mockImages = ['https://example.com/image1.jpg'];
    const expectedUri = mockImages[0];
    const expectedStyle = {width: 300, height: 300, marginHorizontal: 7};

    // Act
    render(<ProductImages images={mockImages} />);
    const flatList = screen.UNSAFE_getByType(FlatList);
    const renderedItem = flatList.props.renderItem({
      item: mockImages[0],
    });

    // Assert
    expect(renderedItem.props.uri).toBe(expectedUri);
    expect(renderedItem.props.style).toEqual(expectedStyle);
    expect(FadeInImage).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: expectedUri,
        style: expectedStyle,
      }),
      expect.anything(),
    );
  });

  it('debería manejar correctamente un array con múltiples imágenes', () => {
    // Arrange
    const mockImages = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
      'https://example.com/image4.jpg',
      'https://example.com/image5.jpg',
    ];
    const expectedItemCount = mockImages.length;

    // Act
    render(<ProductImages images={mockImages} />);

    // Assert
    const flatList = screen.UNSAFE_getByType(FlatList);
    expect(flatList.props.data).toHaveLength(expectedItemCount);
    expect(flatList.props.data).toEqual(mockImages);
  });
});
