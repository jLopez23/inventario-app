import {ProductMapper} from './product.mapper';
import { TesloProduct, Gender } from '../interfaces/teslo-products.response';
import {Product, Size} from '../../domain/entities/product';
import { mockTesloProduct } from '../../../__mocks__/mock-data';

// Mock para tesloApi
jest.mock('../../config/api/tesloApi', () => ({
  API_URL: 'http://test-api.example.com',
}));

describe('ProductMapper', () => {
  const expectedBaseUrl = 'http://test-api.example.com/files/product/';

  describe('tesloProductToEntity', () => {
    it('debería mapear correctamente un producto de Teslo a una entidad Product', () => {
      // Arrange
      const expectedProduct: Product = {
        id: '123',
        title: 'Test Product',
        price: 100,
        description: 'Test description',
        slug: 'test-product',
        stock: 10,
        sizes: [Size.S, Size.M],
        gender: Gender.Men,
        tags: ['test', 'product'],
        images: [
          `${expectedBaseUrl}image1.jpg`,
          `${expectedBaseUrl}image2.jpg`,
        ],
      };

      // Act
      const result = ProductMapper.tesloProductToEntity(mockTesloProduct);

      // Assert
      expect(result).toEqual(expectedProduct);
    });

    it('debería manejar correctamente productos sin imágenes', () => {
      // Arrange
      const tesloProductWithoutImages: TesloProduct = {
        ...mockTesloProduct,
        images: [],
      };

      const expectedProductWithoutImages: Product = {
        id: '123',
        title: 'Test Product',
        price: 100,
        description: 'Test description',
        slug: 'test-product',
        stock: 10,
        sizes: [Size.S, Size.M],
        gender: Gender.Men,
        tags: ['test', 'product'],
        images: [],
      };

      // Act
      const result = ProductMapper.tesloProductToEntity(
        tesloProductWithoutImages,
      );

      // Assert
      expect(result).toEqual(expectedProductWithoutImages);
      expect(result.images).toHaveLength(0);
    });

    it('debería construir correctamente las URLs de imágenes con la URL base de la API', () => {
      // Arrange
      const expectedImageUrls = [
        `${expectedBaseUrl}image1.jpg`,
        `${expectedBaseUrl}image2.jpg`,
      ];

      // Act
      const result = ProductMapper.tesloProductToEntity(mockTesloProduct);

      // Assert
      expect(result.images).toEqual(expectedImageUrls);
      expect(result.images[0]).toMatch(/^http:\/\/test-api\.example\.com\/files\/product\//);
      expect(result.images[0]).toContain('/files/product/');
    });

    it('debería preservar todos los campos del producto original', () => {
      // Arrange
      // Usamos el mockTesloProduct definido anteriormente

      // Act
      const result = ProductMapper.tesloProductToEntity(mockTesloProduct);

      // Assert
      expect(result.id).toBe(mockTesloProduct.id);
      expect(result.title).toBe(mockTesloProduct.title);
      expect(result.price).toBe(mockTesloProduct.price);
      expect(result.description).toBe(mockTesloProduct.description);
      expect(result.slug).toBe(mockTesloProduct.slug);
      expect(result.stock).toBe(mockTesloProduct.stock);
      expect(result.sizes).toEqual(mockTesloProduct.sizes);
      expect(result.gender).toBe(mockTesloProduct.gender);
      expect(result.tags).toEqual(mockTesloProduct.tags);
    });

    it('debería manejar correctamente productos con múltiples imágenes', () => {
      // Arrange
      const multipleImagesTesloProduct: TesloProduct = {
        ...mockTesloProduct,
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'],
      };

      const expectedImageUrls = [
        `${expectedBaseUrl}img1.jpg`,
        `${expectedBaseUrl}img2.jpg`,
        `${expectedBaseUrl}img3.jpg`,
        `${expectedBaseUrl}img4.jpg`,
        `${expectedBaseUrl}img5.jpg`,
      ];

      // Act
      const result = ProductMapper.tesloProductToEntity(
        multipleImagesTesloProduct,
      );

      // Assert
      expect(result.images).toEqual(expectedImageUrls);
      expect(result.images).toHaveLength(5);
    });
  });
});
