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

// Mock de isAxiosError para poder controlarlo en las pruebas
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
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

    // Nueva prueba para cubrir caso donde no hay imágenes locales que procesar
    it('debería procesar correctamente cuando solo hay imágenes remotas', async () => {
      // Arrange
      const productWithRemoteImagesOnly: Partial<Product> = {
        id: 'product-remote-images',
        title: 'Producto con Solo Imágenes Remotas',
        price: 120,
        stock: 15,
        images: [
          'https://example.com/remote-image1.jpg',
          'https://example.com/remote-image2.jpg',
        ],
      };

      const expectedApiResponse = {
        id: 'product-remote-images',
        title: 'Producto con Solo Imágenes Remotas',
        price: 120,
        stock: 15,
        images: ['remote-image1.jpg', 'remote-image2.jpg'],
      };

      // Mock para patch cuando se actualiza un producto existente
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: expectedApiResponse,
      });

      // Act
      const result = await updateCreateProduct(productWithRemoteImagesOnly);

      // Assert
      // Verificar que NO se haya llamado a post para subir imágenes
      expect(tesloApi.post).not.toHaveBeenCalledWith(
        '/files/product',
        expect.any(FormData),
        expect.anything(),
      );

      // Verificar que el producto se actualizó con las imágenes procesadas
      expect(tesloApi.patch).toHaveBeenCalledWith(
        `/products/${productWithRemoteImagesOnly.id}`,
        expect.objectContaining({
          images: ['remote-image1.jpg', 'remote-image2.jpg'],
        }),
      );

      expect(result).toEqual(expectedApiResponse);
    });

    // Nueva prueba para manejar errores durante la carga de imágenes
    it('debería manejar errores durante la carga de imágenes', async () => {
      // Arrange
      const productWithImages: Partial<Product> = {
        id: 'product-with-images-error',
        title: 'Producto con Error en Imágenes',
        price: 180,
        stock: 5,
        images: [
          'https://example.com/remote-image.jpg',
          'file:///local/path/to/image.jpg', // Esta imagen fallará al cargar
        ],
      };

      const uploadError = new Error('Error al cargar la imagen');

      // Mock para simular un error durante la carga de la imagen
      (tesloApi.post as jest.Mock).mockImplementation((url: string) => {
        if (url === '/files/product') {
          return Promise.reject(uploadError);
        }
        return Promise.resolve({data: {}});
      });

      // Act & Assert
      await expect(updateCreateProduct(productWithImages)).rejects.toThrow();

      // Verificar que se intentó cargar la imagen
      expect(tesloApi.post).toHaveBeenCalledWith(
        '/files/product',
        expect.any(FormData),
        expect.objectContaining({
          headers: {'Content-Type': 'multipart/form-data'},
        }),
      );
    });

    // Nueva prueba para verificar el manejo cuando no hay imágenes en absoluto
    it('debería manejar correctamente el caso donde no hay imágenes', async () => {
      // Arrange
      const productWithoutImages: Partial<Product> = {
        id: 'product-without-images',
        title: 'Producto sin Imágenes',
        price: 99,
        stock: 8,
        images: undefined, // Simular que no hay array de imágenes
      };

      const expectedApiResponse = {
        id: 'product-without-images',
        title: 'Producto sin Imágenes',
        price: 99,
        stock: 8,
        images: [],
      };

      // Mock para patch
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: expectedApiResponse,
      });

      // Act
      const result = await updateCreateProduct(productWithoutImages);

      // Assert
      // Verificar que no se llamó a post para subir imágenes
      expect(tesloApi.post).not.toHaveBeenCalledWith(
        '/files/product',
        expect.anything(),
        expect.anything(),
      );

      // Verificar que el producto se actualizó correctamente
      expect(tesloApi.patch).toHaveBeenCalledWith(
        `/products/${productWithoutImages.id}`,
        expect.objectContaining({
          images: [],
        }),
      );

      expect(result).toEqual(expectedApiResponse);
    });

    // Nueva prueba para verificar errores no relacionados con Axios
    it('debería manejar errores no relacionados con Axios', async () => {
      // Arrange
      const existingProduct: Partial<Product> = {
        id: 'existing-non-axios-error',
        title: 'Producto con Error No Axios',
        price: 50,
        stock: 10,
        images: [],
      };

      const nonAxiosError = new Error('Error no relacionado con Axios');

      // Mock de isAxiosError para que retorne false
      (isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      // Mock del rechazo de la API
      (tesloApi.patch as jest.Mock).mockRejectedValue(nonAxiosError);

      // Act & Assert
      await expect(updateCreateProduct(existingProduct)).rejects.toThrow(
        'Error updating product',
      );
      // Verificamos que console.log no fue llamado con este tipo de error
      expect(console.log).not.toHaveBeenCalledWith(
        'Error Axios updateProduct:',
        expect.anything(),
      );
    });

    // Nuevas pruebas para mejorar la cobertura
    it('debería manejar correctamente imágenes vacías (array vacío)', async () => {
      // Arrange
      const productWithEmptyImagesArray: Partial<Product> = {
        id: 'product-empty-images',
        title: 'Producto con Array de Imágenes Vacío',
        price: 85,
        stock: 12,
        images: [], // Array vacío explícito
      };

      const expectedApiResponse = {
        id: 'product-empty-images',
        title: 'Producto con Array de Imágenes Vacío',
        price: 85,
        stock: 12,
        images: [],
      };

      // Mock para patch
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: expectedApiResponse,
      });

      // Act
      const result = await updateCreateProduct(productWithEmptyImagesArray);

      // Assert
      // Verificar que el producto se actualizó correctamente sin llamar a prepareImages
      expect(tesloApi.patch).toHaveBeenCalledWith(
        `/products/${productWithEmptyImagesArray.id}`,
        expect.objectContaining({
          images: [],
        }),
      );

      expect(result).toEqual(expectedApiResponse);
    });

    // Prueba para el caso donde hay arrays mixtos de imágenes con diferentes formatos
    it('debería manejar correctamente arrays mixtos de imágenes con formatos variados', async () => {
      // Arrange
      const productWithMixedImages: Partial<Product> = {
        id: 'product-mixed-images',
        title: 'Producto con Imágenes Mixtas',
        price: 130,
        stock: 18,
        images: [
          'https://example.com/imagen1.jpg', // URL remota normal
          'file:///local/path/to/image1.jpg', // Imagen local 1
          'http://example.org/imagen-con-formato-raro.png?param=1234', // URL con parámetros
          'file:///local/path/to/image2.jpeg', // Imagen local 2
          'https://another-domain.com/images/product/imagen-existente.jpg', // URL completa que debería ser procesada
        ],
      };

      // Simular respuestas para cada carga de imagen local
      (tesloApi.post as jest.Mock).mockImplementation((url: string) => {
        if (url === '/files/product') {
          // Cada llamada a post con /files/product retorna un nombre diferente
          const formData = (tesloApi.post as jest.Mock).mock.calls.filter(
            call => call[0] === '/files/product',
          ).length;

          return Promise.resolve({
            data: {
              image: `https://cdn.example.com/uploaded-image-${formData}.jpg`,
            },
          });
        }
        return Promise.resolve({data: {}});
      });

      // Mock para patch con la respuesta esperada después de procesar todas las imágenes
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: {
          id: 'product-mixed-images',
          title: 'Producto con Imágenes Mixtas',
          price: 130,
          stock: 18,
          images: [
            'imagen1.jpg',
            'uploaded-image-1.jpg',
            'imagen-con-formato-raro.png',
            'uploaded-image-2.jpg',
            'imagen-existente.jpg',
          ],
        },
      });

      // Act
      const result = await updateCreateProduct(productWithMixedImages);

      // Assert
      // Verificar que se subieron exactamente 2 imágenes locales
      expect(tesloApi.post).toHaveBeenCalledTimes(2);

      // Verificar que se procesaron correctamente todas las imágenes
      expect(tesloApi.patch).toHaveBeenCalled();
      expect(result.images).toHaveLength(5);
      expect(result.images).toContain('imagen1.jpg');
      expect(result.images).toContain('uploaded-image-1.jpg');
      expect(result.images).toContain('uploaded-image-2.jpg');
      expect(result.images).toContain('imagen-con-formato-raro.png');
    });

    // Prueba para verificar el manejo de errores específicos de Axios en createProduct
    it('debería manejar correctamente errores de Axios al crear un producto', async () => {
      // Arrange
      const newProductWithError: Partial<Product> = {
        id: 'new',
        title: 'Producto con Error Axios',
        price: 45,
        stock: 3,
        images: [],
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
          },
        },
      };

      // Mock isAxiosError para este caso específico
      (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Mock del reject con error de Axios
      (tesloApi.post as jest.Mock).mockRejectedValue(axiosError);

      // Act y Assert
      await expect(updateCreateProduct(newProductWithError)).rejects.toThrow(
        'Error al crear el producto',
      );

      // Verificar que se registró el error específicamente como un error de Axios
      expect(console.log).toHaveBeenCalledWith(
        'Error Axios createProduct:',
        expect.any(String),
      );
    });

    // Prueba para verificar el manejo de errores específicos de Axios en updateProduct
    it('debería manejar correctamente errores de Axios al actualizar un producto', async () => {
      // Arrange
      const existingProductWithError: Partial<Product> = {
        id: 'existing-axios-error',
        title: 'Producto con Error Axios al Actualizar',
        price: 60,
        stock: 7,
        images: [],
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'Product not found',
          },
        },
      };

      // Mock isAxiosError para este caso específico
      (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Mock del reject con error de Axios
      (tesloApi.patch as jest.Mock).mockRejectedValue(axiosError);

      // Act y Assert
      await expect(
        updateCreateProduct(existingProductWithError),
      ).rejects.toThrow('Error updating product');

      // Verificar que se registró el error específicamente como un error de Axios
      expect(console.log).toHaveBeenCalledWith(
        'Error Axios updateProduct:',
        expect.any(String),
      );
    });
  });

  // Sección específica para probar detalladamente la función prepareImages
  describe('prepareImages función', () => {
    it('debería manejar caso donde solo hay imágenes locales (file://)', async () => {
      // Arrange
      const productWithLocalImagesOnly: Partial<Product> = {
        id: 'product-local-images-only',
        title: 'Producto Solo Con Imágenes Locales',
        price: 75,
        stock: 22,
        images: [
          'file:///local/path/to/image1.jpg',
          'file:///local/path/to/image2.jpg',
          'file:///local/path/to/image3.jpg',
        ],
      };

      // Simular respuestas para las subidas de imágenes
      (tesloApi.post as jest.Mock).mockImplementation((url: string) => {
        if (url === '/files/product') {
          const callCount = (tesloApi.post as jest.Mock).mock.calls.filter(
            call => call[0] === '/files/product',
          ).length;
          return Promise.resolve({
            data: {image: `https://cdn.example.com/uploaded-${callCount}.jpg`},
          });
        }
        return Promise.resolve({data: {}});
      });

      // Mock para patch con la respuesta esperada después de procesar todas las imágenes
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: {
          id: 'product-local-images-only',
          title: 'Producto Solo Con Imágenes Locales',
          price: 75,
          stock: 22,
          images: ['uploaded-1.jpg', 'uploaded-2.jpg', 'uploaded-3.jpg'],
        },
      });

      // Act
      const result = await updateCreateProduct(productWithLocalImagesOnly);

      // Assert
      // Verificar que se subieron 3 imágenes locales
      expect(tesloApi.post).toHaveBeenCalledTimes(3);
      expect(result.images).toHaveLength(3);
      expect(result.images).toContain('uploaded-1.jpg');
      expect(result.images).toContain('uploaded-2.jpg');
      expect(result.images).toContain('uploaded-3.jpg');
    });

    it('debería manejar el caso donde hay mezcla de imágenes con casos extremos', async () => {
      // Este test incluye casos con formatos variados, nombres de archivos extraños
      // y asegura que todos los caminos del código se cubran

      const productWithComplexImages: Partial<Product> = {
        id: 'product-complex-images',
        title: 'Producto Con Casos Complejos',
        price: 55.99,
        stock: 5,
        images: [
          // Imagen remota sin extensión visible
          'https://example.com/images/product',

          // Imagen local con caracteres especiales en el nombre
          'file:///local/path/to/special@character#image.jpg',

          // Imagen con formato peculiar y sin extensión clara
          'https://weird-domain.com/get.php?id=123',

          // Imagen local con ruta compleja
          'file:///Users/user/path with spaces/deep/folder/structure/image with spaces.jpeg',
        ],
      };

      // Simular las subidas de imágenes locales
      (tesloApi.post as jest.Mock).mockImplementation((url: string) => {
        if (url === '/files/product') {
          return Promise.resolve({
            data: {image: 'https://cdn.example.com/processed-image.jpg'},
          });
        }
        return Promise.resolve({data: {}});
      });

      // Mock para patch con respuesta procesada
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: {
          id: 'product-complex-images',
          title: 'Producto Con Casos Complejos',
          price: 55.99,
          stock: 5,
          images: [
            'product',
            'processed-image.jpg',
            'get.php',
            'processed-image.jpg',
          ],
        },
      });

      // Act
      const result = await updateCreateProduct(productWithComplexImages);

      // Assert
      // Verificar que se subieron 2 imágenes locales
      expect(tesloApi.post).toHaveBeenCalledTimes(2);

      // Verificar que se procesaron correctamente
      expect(tesloApi.patch).toHaveBeenCalled();
      expect(result.images).toHaveLength(4);
    });

    it('debería manejar el caso donde Promise.all rechaza durante la carga de imágenes', async () => {
      // Arrange
      const productWithFailingImages: Partial<Product> = {
        id: 'product-failing-uploads',
        title: 'Producto Con Fallos en Subidas',
        price: 150,
        stock: 10,
        images: [
          'file:///local/path/to/image-fail-1.jpg',
          'file:///local/path/to/image-fail-2.jpg',
        ],
      };

      // Simular un rechazo en Promise.all cuando se suben imágenes
      const uploadError = new Error('Error en Promise.all durante la carga');
      (tesloApi.post as jest.Mock).mockRejectedValue(uploadError);

      // Act & Assert
      await expect(
        updateCreateProduct(productWithFailingImages),
      ).rejects.toThrow();

      // Verificar que se intentó cargar imágenes
      expect(tesloApi.post).toHaveBeenCalledWith(
        '/files/product',
        expect.any(FormData),
        expect.anything(),
      );
    });

    it('debería manejar imágenes con rutas extremadamente largas', async () => {
      // Arrange
      // Creamos una ruta de archivo extremadamente larga
      const longPath = 'file:///' + 'a'.repeat(200) + '/image.jpg';

      const productWithLongPath: Partial<Product> = {
        id: 'product-long-path',
        title: 'Producto Con Ruta Larga',
        price: 99.99,
        stock: 15,
        images: [longPath, 'https://example.com/regular-image.jpg'],
      };

      // Simular la subida de la imagen
      (tesloApi.post as jest.Mock).mockResolvedValue({
        data: {image: 'https://cdn.example.com/uploaded-long-path.jpg'},
      });

      // Mock para patch
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: {
          id: 'product-long-path',
          title: 'Producto Con Ruta Larga',
          price: 99.99,
          stock: 15,
          images: ['uploaded-long-path.jpg', 'regular-image.jpg'],
        },
      });

      // Act
      const result = await updateCreateProduct(productWithLongPath);

      // Assert
      // Verificar que se procesó la ruta larga correctamente
      expect(tesloApi.post).toHaveBeenCalledTimes(1);
      expect(tesloApi.patch).toHaveBeenCalled();
      expect(result.images).toContain('uploaded-long-path.jpg');
    });

    it('debería manejar correctamente cuando la API devuelve formatos de imagen inesperados', async () => {
      // Arrange
      const productWithStrangeResponse: Partial<Product> = {
        id: 'product-strange-response',
        title: 'Producto Con Respuesta Extraña',
        price: 45,
        stock: 7,
        images: ['file:///local/path/to/image.jpg'],
      };

      // Simular una respuesta con un formato de imagen inusual
      (tesloApi.post as jest.Mock).mockResolvedValue({
        data: {
          // Respuesta con una URL absolutamente completa y parámetros
          image:
            'https://cdn.example.com/images/products/full-path/with/params.jpg?token=123&source=upload',
        },
      });

      // Mock para patch
      (tesloApi.patch as jest.Mock).mockResolvedValue({
        data: {
          id: 'product-strange-response',
          title: 'Producto Con Respuesta Extraña',
          price: 45,
          stock: 7,
          images: [
            'params.jpg', // Debería extraer solo el nombre del archivo
          ],
        },
      });

      // Act
      const result = await updateCreateProduct(productWithStrangeResponse);

      // Assert
      // Verificar que se procesó correctamente la URL compleja
      expect(tesloApi.post).toHaveBeenCalledTimes(1);
      expect(result.images[0]).toBe('params.jpg');
    });

    // Prueba para cuando hay un rechazo durante createProduct
    it('debería manejar rechazos durante createProduct con imágenes', async () => {
      // Arrange
      const newProductWithRejection: Partial<Product> = {
        id: 'new', // Es un producto nuevo
        title: 'Producto Nuevo Con Rechazo',
        price: 199.99,
        stock: 30,
        images: [
          'file:///local/path/to/image1.jpg',
          'https://example.com/remote-image.jpg',
        ],
      };

      // Simular éxito en la subida de imagen
      (tesloApi.post as jest.Mock).mockImplementation(
        (url: string, data: any) => {
          if (url === '/files/product') {
            return Promise.resolve({
              data: {image: 'https://cdn.example.com/uploaded-image.jpg'},
            });
          }

          if (url === '/products/') {
            // Simular rechazo en la creación del producto
            return Promise.reject(new Error('Error al crear el producto'));
          }

          return Promise.resolve({data: {}});
        },
      );

      // Act & Assert
      await expect(
        updateCreateProduct(newProductWithRejection),
      ).rejects.toThrow();

      // Verificar que primero se subió la imagen y luego falló la creación
      expect(tesloApi.post).toHaveBeenCalledWith(
        '/files/product',
        expect.any(FormData),
        expect.anything(),
      );
      expect(tesloApi.post).toHaveBeenCalledWith(
        '/products/',
        expect.objectContaining({
          title: 'Producto Nuevo Con Rechazo',
          price: 199.99,
          stock: 30,
        }),
      );
    });
  });

  // Sección adicional para pruebas específicas de manejo de errores en updateProduct
  describe('Manejo de errores en updateProduct', () => {
    it('debería manejar específicamente errores de tipo Axios en updateProduct', async () => {
      // Configuración inicial
      const product: Partial<Product> = {
        id: 'existing-product',
        title: 'Producto Existente',
        price: 100,
        stock: 50,
      };

      // Simulamos que el error es de tipo Axios
      (isAxiosError as jest.Mock).mockReturnValue(true);

      // Creamos un error específico de Axios (simulado)
      const axiosError = new Error('Error de Axios específico');
      Object.assign(axiosError, {
        isAxiosError: true,
        response: {
          status: 500,
          data: {message: 'Error interno del servidor'},
        },
      });

      // Hacemos que la llamada a patch arroje este error
      (tesloApi.patch as jest.Mock).mockRejectedValue(axiosError);

      // Act & Assert
      await expect(updateCreateProduct(product)).rejects.toThrow(
        'Error updating product',
      );

      // Verificamos que se llamó a isAxiosError
      expect(isAxiosError).toHaveBeenCalledWith(axiosError);

      // Verificamos que se llamó a console.log con el error
      expect(console.log).toHaveBeenCalledWith(
        'Error Axios updateProduct:',
        expect.any(String),
      );
    });

    it('debería manejar errores que NO son de tipo Axios en updateProduct', async () => {
      // Configuración inicial
      const product: Partial<Product> = {
        id: 'existing-product',
        title: 'Producto Existente',
        price: 100,
        stock: 50,
      };

      // Simulamos que el error NO es de tipo Axios
      (isAxiosError as jest.Mock).mockReturnValue(false);

      // Creamos un error genérico (no Axios)
      const genericError = new Error('Error genérico no relacionado con Axios');

      // Hacemos que la llamada a patch arroje este error
      (tesloApi.patch as jest.Mock).mockRejectedValue(genericError);

      // Act & Assert
      await expect(updateCreateProduct(product)).rejects.toThrow(
        'Error updating product',
      );

      // Verificamos que se llamó a isAxiosError
      expect(isAxiosError).toHaveBeenCalledWith(genericError);

      // Verificamos que NO se llamó a console.log con el mensaje específico de error Axios
      expect(console.log).not.toHaveBeenCalledWith(
        'Error Axios updateProduct:',
        expect.any(String),
      );
    });
  });

  // Sección adicional para pruebas específicas de manejo de errores en createProduct
  describe('Manejo de errores en createProduct', () => {
    it('debería manejar específicamente errores de tipo Axios en createProduct', async () => {
      // Configuración inicial
      const product: Partial<Product> = {
        id: 'new', // Es un nuevo producto
        title: 'Producto Nuevo',
        price: 75,
        stock: 25,
      };

      // Simulamos que el error es de tipo Axios
      (isAxiosError as jest.Mock).mockReturnValue(true);

      // Creamos un error específico de Axios (simulado)
      const axiosError = new Error('Error de Axios específico');
      Object.assign(axiosError, {
        isAxiosError: true,
        response: {
          status: 400,
          data: {message: 'Datos inválidos'},
        },
      });

      // Hacemos que la llamada a post arroje este error
      (tesloApi.post as jest.Mock).mockRejectedValue(axiosError);

      // Act & Assert
      await expect(updateCreateProduct(product)).rejects.toThrow(
        'Error al crear el producto',
      );

      // Verificamos que se llamó a isAxiosError
      expect(isAxiosError).toHaveBeenCalledWith(axiosError);

      // Verificamos que se llamó a console.log con el error
      expect(console.log).toHaveBeenCalledWith(
        'Error Axios createProduct:',
        expect.any(String),
      );
    });

    it('debería manejar errores que NO son de tipo Axios en createProduct', async () => {
      // Configuración inicial
      const product: Partial<Product> = {
        id: 'new', // Es un nuevo producto
        title: 'Producto Nuevo',
        price: 75,
        stock: 25,
      };

      // Simulamos que el error NO es de tipo Axios
      (isAxiosError as jest.Mock).mockReturnValue(false);

      // Creamos un error genérico (no Axios)
      const genericError = new Error('Error genérico no relacionado con Axios');

      // Hacemos que la llamada a post arroje este error
      (tesloApi.post as jest.Mock).mockRejectedValue(genericError);

      // Act & Assert
      await expect(updateCreateProduct(product)).rejects.toThrow(
        'Error al crear el producto',
      );

      // Verificamos que se llamó a isAxiosError
      expect(isAxiosError).toHaveBeenCalledWith(genericError);

      // Verificamos que NO se llamó a console.log con el mensaje específico de error Axios
      expect(console.log).not.toHaveBeenCalledWith(
        'Error Axios createProduct:',
        expect.any(String),
      );
    });
  });
});
