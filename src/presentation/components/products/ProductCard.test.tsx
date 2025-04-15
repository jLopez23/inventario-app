import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ProductCard} from './ProductCard';
import {Gender, Product, Size} from '../../../domain/entities/product';
import {NavigationProp, useNavigation} from '@react-navigation/native';

// Mocks para las dependencias externas
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../ui/FadeInImage', () => ({
  FadeInImage: jest.fn(({uri, style}) => (
    <mock-fade-in-image testID="fade-in-image" uri={uri} style={style} />
  )),
}));

// Mock para Image de React Native - sólo mockeamos Image específicamente
jest.mock('react-native/Libraries/Image/Image', () => {
  return jest.fn(props => <mock-image testID="default-image" {...props} />);
});

// Mock para UI Kitten
jest.mock('@ui-kitten/components', () => ({
  Card: jest.fn(({children, style, onPress}) => (
    <mock-card testID="product-card" style={style} onPress={onPress}>
      {children}
    </mock-card>
  )),
  Text: jest.fn(({children, numberOfLines, style}) => (
    <mock-text
      testID="product-title"
      numberOfLines={numberOfLines}
      style={style}>
      {children}
    </mock-text>
  )),
}));

// Mock para la imagen por defecto
jest.mock(
  '../../../assets/no-product-image.png',
  () => 'mocked-no-product-image',
);

describe('ProductCard Component', () => {
  // Función helper para crear un producto de prueba
  const createMockProduct = (overrides = {}): Product => ({
    id: 'test-id',
    title: 'Producto de prueba',
    price: 100,
    description: 'Descripción de prueba',
    slug: 'producto-prueba',
    stock: 10,
    sizes: [Size.M],
    gender: Gender.Unisex,
    tags: ['test'],
    images: [],
    ...overrides,
  });

  // Configuración común para las pruebas
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
  } as unknown as NavigationProp<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  it('debería renderizar correctamente la tarjeta del producto', () => {
    // Arrange
    const mockProduct = createMockProduct();

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(getByTestId('product-card')).toBeTruthy();
    expect(getByTestId('product-title')).toBeTruthy();
    expect(getByTestId('product-title').props.children).toBe(mockProduct.title);
  });

  it('debería mostrar la imagen por defecto cuando no hay imágenes en el producto', () => {
    // Arrange
    const mockProduct = createMockProduct({
      images: [],
    });
    const expectedImageSource = 'mocked-no-product-image';
    const expectedImageStyle = {width: '100%', height: 200};

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    const imageComponent = getByTestId('default-image');
    expect(imageComponent).toBeTruthy();
    expect(imageComponent.props.source).toBe(expectedImageSource);
    expect(imageComponent.props.style).toEqual(expectedImageStyle);
  });

  it('debería mostrar la primera imagen cuando el producto tiene imágenes', () => {
    // Arrange
    const expectedImageUrl = 'https://example.com/image.jpg';
    const expectedImageStyle = {flex: 1, height: 200, width: '100%'};
    const mockProduct = createMockProduct({
      images: [expectedImageUrl, 'https://example.com/image2.jpg'],
    });

    // Act
    const {queryByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(queryByTestId('fade-in-image')).toBeTruthy();
    expect(require('../ui/FadeInImage').FadeInImage).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: expectedImageUrl,
        style: expectedImageStyle,
      }),
      expect.anything(),
    );
  });

  it('debería limitar el título a 2 líneas', () => {
    // Arrange
    const mockProduct = createMockProduct();
    const expectedNumberOfLines = 2;

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(getByTestId('product-title').props.numberOfLines).toBe(
      expectedNumberOfLines,
    );
  });

  it('debería navegar a la pantalla de detalle del producto al presionar la tarjeta', () => {
    // Arrange
    const mockProduct = createMockProduct();
    const expectedScreenName = 'ProductScreen';
    const expectedParams = {productId: mockProduct.id};

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);
    const card = getByTestId('product-card');
    fireEvent.press(card);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(
      expectedScreenName,
      expectedParams,
    );
  });

  it('debería aplicar los estilos correctos a la tarjeta', () => {
    // Arrange
    const mockProduct = createMockProduct();
    const expectedCardStyle = {flex: 1, backgroundColor: '#F9F9F9', margin: 3};

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(getByTestId('product-card').props.style).toEqual(expectedCardStyle);
  });

  it('debería centrar el texto del título del producto', () => {
    // Arrange
    const mockProduct = createMockProduct();
    const expectedTextStyle = {textAlign: 'center'};

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(getByTestId('product-title').props.style).toEqual(expectedTextStyle);
  });

  it('debería manejar correctamente un producto con título largo', () => {
    // Arrange
    const longTitle =
      'Este es un título extremadamente largo que debería ser acortado o mostrado en múltiples líneas para una mejor experiencia de usuario';
    const mockProduct = createMockProduct({
      title: longTitle,
    });

    // Act
    const {getByTestId} = render(<ProductCard product={mockProduct} />);

    // Assert
    expect(getByTestId('product-title').props.children).toBe(longTitle);
    expect(getByTestId('product-title').props.numberOfLines).toBe(2);
  });
});
