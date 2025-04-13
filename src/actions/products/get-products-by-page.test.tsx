import {getProductsByPage} from './get-products-by-page';
import {tesloApi} from '../../config/api/tesloApi';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';
import {Product} from '../../domain/entities/product';
import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';

// Mock de las dependencias
jest.mock('../../config/api/tesloApi', () => ({
  tesloApi: {
    get: jest.fn(),
  },
}));

jest.mock('../../infrastructure/mappers/product.mapper', () => ({
  ProductMapper: {
    tesloProductToEntity: jest.fn(),
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

describe('getProductsByPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería obtener productos correctamente con valores por defecto', async () => {
    // Arrange
    const page = 1;
    const mockTesloProducts: TesloProduct[] = [
      {id: '1', title: 'Product 1'} as TesloProduct,
      {id: '2', title: 'Product 2'} as TesloProduct,
    ];
    const expectedProducts: Product[] = [
      {id: '1', title: 'Product 1'} as Product,
      {id: '2', title: 'Product 2'} as Product,
    ];
    const expectedUrl = '/products?offset=10&limit=20'; // page 1 = offset 10

    // Mock de la respuesta de la API
    (tesloApi.get as jest.Mock).mockResolvedValueOnce({
      data: mockTesloProducts,
    });

    // Mock del mapper para devolver productos transformados
    mockTesloProducts.forEach((product, index) => {
      (ProductMapper.tesloProductToEntity as jest.Mock).mockReturnValueOnce(
        expectedProducts[index],
      );
    });

    // Act
    const result = await getProductsByPage(page);

    // Assert
    expect(tesloApi.get).toHaveBeenCalledWith(expectedUrl);
    expect(ProductMapper.tesloProductToEntity).toHaveBeenCalledTimes(2);
    expect(result).toEqual(expectedProducts);
  });

  it('debería obtener productos de la página 0 (primera página)', async () => {
    // Arrange
    const page = 0;
    const mockTesloProducts: TesloProduct[] = [
      {id: '1', title: 'Product 1'} as TesloProduct,
    ];
    const expectedProducts: Product[] = [
      {id: '1', title: 'Product 1'} as Product,
    ];
    const expectedUrl = '/products?offset=0&limit=20'; // page 0 = offset 0

    // Mock de la respuesta de la API
    (tesloApi.get as jest.Mock).mockResolvedValueOnce({
      data: mockTesloProducts,
    });

    // Mock del mapper para devolver productos transformados
    (ProductMapper.tesloProductToEntity as jest.Mock).mockReturnValueOnce(
      expectedProducts[0],
    );

    // Act
    const result = await getProductsByPage(page);

    // Assert
    expect(tesloApi.get).toHaveBeenCalledWith(expectedUrl);
    expect(ProductMapper.tesloProductToEntity).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedProducts);
  });

  it('debería respetar el límite personalizado cuando se proporciona', async () => {
    // Arrange
    const page = 2;
    const limit = 5;
    const mockTesloProducts: TesloProduct[] = [
      {id: '1', title: 'Product 1'} as TesloProduct,
    ];
    const expectedProducts: Product[] = [
      {id: '1', title: 'Product 1'} as Product,
    ];
    const expectedUrl = '/products?offset=20&limit=5'; // page 2 = offset 20, limit personalizado = 5

    // Mock de la respuesta de la API
    (tesloApi.get as jest.Mock).mockResolvedValueOnce({
      data: mockTesloProducts,
    });

    // Mock del mapper para devolver productos transformados
    (ProductMapper.tesloProductToEntity as jest.Mock).mockReturnValueOnce(
      expectedProducts[0],
    );

    // Act
    const result = await getProductsByPage(page, limit);

    // Assert
    expect(tesloApi.get).toHaveBeenCalledWith(expectedUrl);
    expect(ProductMapper.tesloProductToEntity).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedProducts);
  });

  it('debería manejar correctamente una respuesta vacía', async () => {
    // Arrange
    const page = 3;
    const mockTesloProducts: TesloProduct[] = [];
    const expectedProducts: Product[] = [];
    const expectedUrl = '/products?offset=30&limit=20'; // page 3 = offset 30

    // Mock de la respuesta de la API con array vacío
    (tesloApi.get as jest.Mock).mockResolvedValueOnce({
      data: mockTesloProducts,
    });

    // Act
    const result = await getProductsByPage(page);

    // Assert
    expect(tesloApi.get).toHaveBeenCalledWith(expectedUrl);
    expect(ProductMapper.tesloProductToEntity).not.toHaveBeenCalled();
    expect(result).toEqual(expectedProducts);
  });

  it('debería lanzar un error cuando falla la petición API', async () => {
    // Arrange
    const page = 1;
    const expectedErrorMessage = 'Error fetching products';
    const expectedUrl = '/products?offset=10&limit=20'; // page 1 = offset 10

    // Mock de la respuesta fallida de la API
    const mockError = new Error('API Error');
    (tesloApi.get as jest.Mock).mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getProductsByPage(page)).rejects.toThrow(expectedErrorMessage);
    expect(tesloApi.get).toHaveBeenCalledWith(expectedUrl);
    expect(console.log).toHaveBeenCalled(); // Verificar que se registra el error
    expect(ProductMapper.tesloProductToEntity).not.toHaveBeenCalled();
  });
});
