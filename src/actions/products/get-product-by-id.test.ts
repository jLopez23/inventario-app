import {getProductById} from './get-product-by-id';
import {tesloApi} from '../../config/api/tesloApi';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';
import {emptyProduct} from '../../config/constants/constants';

import {
  expectedMappedProduct,
  mockTesloProduct,
} from '../../../__mocks__/mock-data';

// Mockear el módulo tesloApi
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    get: jest.fn(),
  },
}));

// Mockear el módulo ProductMapper
jest.mock('../../infrastructure/mappers/product.mapper', () => ({
  ProductMapper: {
    tesloProductToEntity: jest.fn(),
  },
}));

// Mockear console.log para evitar logs durante las pruebas
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('getProductById', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería devolver emptyProduct cuando el ID es "new"', async () => {
    // Arrange
    const productId = 'new';
    const expectedProduct = emptyProduct;

    // Act
    const result = await getProductById(productId);

    // Assert
    expect(result).toBe(expectedProduct);
    expect(tesloApi.get).not.toHaveBeenCalled();
    expect(ProductMapper.tesloProductToEntity).not.toHaveBeenCalled();
  });

  it('debería obtener y mapear correctamente un producto por su ID', async () => {
    // Arrange
    const productId = '123';

    const mockGet = tesloApi.get as jest.MockedFunction<typeof tesloApi.get>;
    mockGet.mockResolvedValueOnce({data: mockTesloProduct});

    const mockMapper =
      ProductMapper.tesloProductToEntity as jest.MockedFunction<
        typeof ProductMapper.tesloProductToEntity
      >;
    mockMapper.mockReturnValueOnce(expectedMappedProduct);

    // Act
    const result = await getProductById(productId);

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`/products/${productId}`);
    expect(mockMapper).toHaveBeenCalledWith(mockTesloProduct);
    expect(result).toEqual(expectedMappedProduct);
  });

  it('debería lanzar un error cuando la petición a la API falla', async () => {
    // Arrange
    const productId = '456';
    const expectedErrorMessage = `Error fetching product by id: ${productId}`;
    const apiError = new Error('API error');

    const mockGet = tesloApi.get as jest.MockedFunction<typeof tesloApi.get>;
    mockGet.mockRejectedValueOnce(apiError);

    // Act & Assert
    await expect(getProductById(productId)).rejects.toThrow(
      expectedErrorMessage,
    );
    expect(mockGet).toHaveBeenCalledWith(`/products/${productId}`);
    expect(console.log).toHaveBeenCalledWith(
      `Error getProductById: ${JSON.stringify(apiError)}`,
    );
  });
});
