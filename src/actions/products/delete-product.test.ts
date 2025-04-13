import {deleteProduct} from '../products/delete-product';
import {getProductById} from '../products/get-product-by-id';
import {tesloApi} from '../../config/api/tesloApi';
import {isAxiosError} from 'axios';

// Mockear las dependencias necesarias
jest.mock('../products/get-product-by-id');
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    delete: jest.fn(),
  },
}));
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

// Mockear console.log para evitar logs durante pruebas
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('deleteProduct', () => {
  // Limpiar todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe eliminar un producto con éxito cuando el producto existe', async () => {
    // Arrange
    const productId = '123';
    const mockProduct = {id: productId, name: 'Test Product'};
    const expectedDeleteEndpoint = `/products/${productId}`;
    const expectedResult = true;

    // Configurar mocks
    (getProductById as jest.Mock).mockResolvedValue(mockProduct);
    (tesloApi.delete as jest.Mock).mockResolvedValue({data: {}});

    // Act
    const result = await deleteProduct(productId);

    // Assert
    expect(getProductById).toHaveBeenCalledWith(productId);
    expect(tesloApi.delete).toHaveBeenCalledWith(expectedDeleteEndpoint);
    expect(result).toBe(expectedResult);
  });

  it('debe lanzar un error cuando no se encuentra el producto', async () => {
    // Arrange
    const productId = 'non-existent';
    const expectedErrorMessage = 'Error al crear el producto';

    // Configurar mock para simular producto no encontrado
    (getProductById as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(deleteProduct(productId)).rejects.toThrow(
      expectedErrorMessage,
    );

    // Verificaciones adicionales
    expect(getProductById).toHaveBeenCalledWith(productId);
    expect(tesloApi.delete).not.toHaveBeenCalled();
  });

  it('debe manejar errores de Axios y registrarlos correctamente', async () => {
    // Arrange
    const productId = '123';
    const mockProduct = {id: productId, name: 'Test Product'};
    const axiosError = new Error('Network error');
    const expectedDeleteEndpoint = `/products/${productId}`;
    const expectedErrorMessage = 'Error al crear el producto';

    // Configurar mocks
    (getProductById as jest.Mock).mockResolvedValue(mockProduct);
    (tesloApi.delete as jest.Mock).mockRejectedValue(axiosError);
    (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    // Act & Assert
    await expect(deleteProduct(productId)).rejects.toThrow(
      expectedErrorMessage,
    );

    // Assert
    expect(getProductById).toHaveBeenCalledWith(productId);
    expect(tesloApi.delete).toHaveBeenCalledWith(expectedDeleteEndpoint);
    expect(isAxiosError).toHaveBeenCalledWith(axiosError);
    expect(console.log).toHaveBeenCalled();
  });
});