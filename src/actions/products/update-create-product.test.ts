import {isAxiosError} from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import {Product} from '../../domain/entities/product';
import {updateCreateProduct} from './update-create-product';

// Mock de las dependencias
jest.mock('axios');
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

// Mock de console.log para evitar ruido en los tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('updateCreateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creación de productos', () => {
    it('debería crear un nuevo producto correctamente', async () => {
      // Arrange
      const newProduct: Partial<Product> = {
        id: 'new',
        title: 'Nuevo Producto',
        price: 100,
        stock: 10,
        images: [],
      };

      const expectedProductData = {
        id: 'product-123',
        title: 'Nuevo Producto',
        price: 100,
        stock: 10,
        images: [],
      };

      // Mock de la respuesta de la API
      (tesloApi.post as jest.Mock).mockResolvedValue({
        data: expectedProductData,
      });

      // Act
      const result = await updateCreateProduct(newProduct);

      // Assert
      expect(tesloApi.post).toHaveBeenCalledWith('/products/', {
        title: 'Nuevo Producto',
        price: 100,
        stock: 10,
        images: [],
      });
      expect(result).toEqual(expectedProductData);
    });

    it('debería convertir correctamente valores string a number', async () => {
      // Arrange
      const newProduct: Partial<Product> = {
        id: 'new',
        title: 'Producto con Strings',
        price: '199.99' as unknown as number, // Simular valor string
        stock: '25' as unknown as number, // Simular valor string
        images: [],
      };

      const expectedNumericValues = {
        price: 199.99,
        stock: 25,
      };

      const expectedApiResponse = {
        id: 'product-456',
        title: 'Producto con Strings',
        ...expectedNumericValues,
        images: [],
      };

      (tesloApi.post as jest.Mock).mockResolvedValue({
        data: expectedApiResponse,
      });

      // Act
      await updateCreateProduct(newProduct);

      // Assert
      expect(tesloApi.post).toHaveBeenCalledWith('/products/', {
        title: 'Producto con Strings',
        price: 199.99,
        stock: 25,
        images: [],
      });
    });

    it('debería manejar valores NaN convirtiéndolos a 0', async () => {
      // Arrange
      const productWithInvalidValues: Partial<Product> = {
        id: 'new',
        title: 'Producto Inválido',
        price: 'no-es-numero' as unknown as number,
        stock: undefined as unknown as number,
        images: [],
      };

      const expectedConvertedValues = {
        price: 0,
        stock: 0,
      };

      const expectedApiResponse = {
        id: 'product-789',
        title: 'Producto Inválido',
        ...expectedConvertedValues,
        images: [],
      };

      (tesloApi.post as jest.Mock).mockResolvedValue({
        data: expectedApiResponse,
      });

      // Act
      await updateCreateProduct(productWithInvalidValues);

      // Assert
      expect(tesloApi.post).toHaveBeenCalledWith('/products/', {
        title: 'Producto Inválido',
        price: 0,
        stock: 0,
        images: [],
      });
    });

    it('debería manejar errores al crear un producto', async () => {
      // Arrange
      const newProduct: Partial<Product> = {
        id: 'new',
        title: 'Producto Error',
        price: 50,
        stock: 5,
        images: [],
      };

      const expectedError = new Error('Error al crear el producto');
      const mockAxiosError = {
        isAxiosError: true,
        message: 'Network Error',
      };

      // Mock de isAxiosError
      (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Mock del rechazo de la API
      (tesloApi.post as jest.Mock).mockRejectedValue(mockAxiosError);

      // Act & Assert
      await expect(updateCreateProduct(newProduct)).rejects.toThrow(
        expectedError,
      );
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Actualización de productos', () => {
    it('debería actualizar un producto existente correctamente', async () => {
      // Arrange
      const existingProduct: Partial<Product> = {
        id: 'existing-123',
        title: 'Producto Existente',
        price: 75,
        stock: 15,
        images: [],
      };

      const expectedUpdatedProduct = {
        id: 'existing-123',
        title: 'Producto Existente',
        price: 75,
        stock: 15,
        images: [],
      };

      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: expectedUpdatedProduct,
      });

      // Act
      const result = await updateCreateProduct(existingProduct);

      // Assert
      expect(tesloApi.patch).toHaveBeenCalledWith('/products/existing-123', {
        title: 'Producto Existente',
        price: 75,
        stock: 15,
        images: [],
      });
      expect(result).toEqual(expectedUpdatedProduct);
    });

    it('debería manejar errores al actualizar un producto', async () => {
      // Arrange
      const existingProduct: Partial<Product> = {
        id: 'existing-456',
        title: 'Producto Error Update',
        price: 100,
        stock: 20,
        images: [],
      };

      const expectedError = new Error('Error updating product');
      const mockAxiosError = {
        isAxiosError: true,
        message: 'Server Error',
      };

      // Mock de isAxiosError
      (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Mock del rechazo de la API
      (tesloApi.patch as jest.Mock).mockRejectedValue(mockAxiosError);

      // Act & Assert
      await expect(updateCreateProduct(existingProduct)).rejects.toThrow(
        expectedError,
      );
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Manejo de imágenes', () => {
    it('debería preparar correctamente imágenes locales y remotas', async () => {
      // Arrange
      const productWithImages: Partial<Product> = {
        id: 'product-with-images',
        title: 'Producto con Imágenes',
        price: 150,
        stock: 30,
        images: [
          'https://example.com/remote-image1.jpg',
          'file:///local/path/to/image.jpg',
          'https://example.com/remote-image2.jpg',
        ],
      };

      const expectedUploadedImagePath =
        'https://api.example.com/uploaded-image.jpg';
      const expectedApiResponse = {
        id: 'product-with-images',
        title: 'Producto con Imágenes',
        price: 150,
        stock: 30,
        images: [
          'remote-image1.jpg',
          'uploaded-image.jpg',
          'remote-image2.jpg',
        ],
      };

      // Mock para simular la carga de una imagen y respuestas de la API
      (tesloApi.post as jest.Mock).mockImplementation((url: string) => {
        if (url === '/files/product') {
          return Promise.resolve({data: {image: expectedUploadedImagePath}});
        }
        if (url === '/products/') {
          return Promise.resolve({data: expectedApiResponse});
        }
        return Promise.reject(new Error('URL no esperada en post'));
      });

      // Mock para patch - debe agregarse para cuando se actualiza un producto existente
      (tesloApi.patch as jest.Mock).mockImplementation((url: string) => {
        if (url === `/products/${productWithImages.id}`) {
          return Promise.resolve({data: expectedApiResponse});
        }
        return Promise.reject(new Error('URL no esperada en patch'));
      });

      // Act
      const result = await updateCreateProduct(productWithImages);

      // Assert
      // Verificar que se haya llamado a post para subir la imagen
      expect(tesloApi.post).toHaveBeenCalledWith(
        '/files/product',
        expect.any(FormData),
        expect.objectContaining({
          headers: {'Content-Type': 'multipart/form-data'},
        }),
      );

      // Verificar que el producto se actualizó con las imágenes procesadas
      expect(tesloApi.patch).toHaveBeenCalledWith(
        `/products/${productWithImages.id}`,
        expect.objectContaining({
          images: expect.arrayContaining([
            'remote-image1.jpg',
            'uploaded-image.jpg',
            'remote-image2.jpg',
          ]),
        }),
      );

      expect(result).toEqual(expectedApiResponse);
    });
  });
});
