import React from 'react';
import {render} from '@testing-library/react-native';
import {ProductImages} from './ProductImages';
import {StyleProp, ImageStyle} from 'react-native';

// Mocks
jest.mock('../ui/FadeInImage', () => ({
  FadeInImage: ({
    _uri,
    _style,
  }: {
    _uri: string;
    _style: StyleProp<ImageStyle>;
  }) => null,
}));

jest.mock(
  '../../../assets/no-product-image.png',
  () => 'mock-no-product-image',
);

describe('ProductImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render fallback image when no images are provided', () => {
    // Arrange
    const noImages: string[] = [];
    const expectedSource = 'mock-no-product-image';

    // Act
    const {getByRole, queryAllByTestId} = render(
      <ProductImages images={noImages} />,
    );

    // Assert
    const fallbackImage = getByRole('image');
    expect(fallbackImage).toBeTruthy();
    expect(fallbackImage.props.source).toBe(expectedSource);
    expect(queryAllByTestId('fade-in-image')).toHaveLength(0);
  });

  it('should render one FadeInImage when one image is provided', () => {
    // Arrange
    const oneImage: string[] = ['https://example.com/image1.jpg'];
    const expectedUri = oneImage[0];

    // Act
    const {getAllByTestId} = render(<ProductImages images={oneImage} />);
    const renderedImages = getAllByTestId('fade-in-image');

    // Assert
    expect(renderedImages).toHaveLength(1);
    expect(renderedImages[0].props['data-uri']).toBe(expectedUri);
  });

  it('should render multiple FadeInImage components when multiple images are provided', () => {
    // Arrange
    const images: string[] = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];
    const expectedCount = images.length;

    // Act
    const {getAllByTestId} = render(<ProductImages images={images} />);
    const renderedImages = getAllByTestId('fade-in-image');

    // Assert
    expect(renderedImages).toHaveLength(expectedCount);
    images.forEach((uri, index) => {
      expect(renderedImages[index].props['data-uri']).toBe(uri);
    });
  });

  it('should apply correct styles to each FadeInImage', () => {
    // Arrange
    const images = ['https://example.com/image1.jpg'];

    const expectedStyle: React.CSSProperties = {
      width: 300,
      height: 300,
    };

    // Act
    const {getByTestId} = render(<ProductImages images={images} />);
    const image = getByTestId('fade-in-image');

    // Assert
    expect(image.props.style).toMatchObject(expectedStyle);
  });

  it('should match snapshot for no images', () => {
    // Arrange
    const emptyImages: string[] = [];

    // Act
    const {toJSON} = render(<ProductImages images={emptyImages} />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot for multiple images', () => {
    // Arrange
    const multipleImages: string[] = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ];

    // Act
    const {toJSON} = render(<ProductImages images={multipleImages} />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render FadeInImage for empty string image', () => {
    // Arrange
    const images = [''];

    // Act
    const {getAllByTestId} = render(<ProductImages images={images} />);

    // Assert
    const rendered = getAllByTestId('fade-in-image');
    expect(rendered).toHaveLength(1);
    expect(rendered[0].props['data-uri']).toBe('');
  });
});
