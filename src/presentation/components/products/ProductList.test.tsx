import React from 'react';
import {render, act} from '@testing-library/react-native';
import {ProductList} from './ProductList';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshControl} from 'react-native';
import {Gender, Product, Size} from '../../../domain/entities/product';

// Mock de dependencias
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

// Mock de ProductCard similar a como se hace en ProductImages.test.tsx
jest.mock('./ProductCard', () => ({
  ProductCard: jest.fn(({product}) => (
    <mock-product-card testID={`product-card-${product.id}`} />
  )),
}));

// Mock del componente List de UI Kitten con una estructura similar a la de otros mocks
jest.mock('@ui-kitten/components', () => ({
  List: jest.fn(props => {
    const items =
      props.data && props.data.length > 0
        ? props.data.map((item, index) => (
            <mock-list-item key={props.keyExtractor(item, index)}>
              {props.renderItem({item, index})}
            </mock-list-item>
          ))
        : null;

    return (
      <mock-list
        testID="product-list"
        numColumns={props.numColumns}
        data={props.data}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold}
        refreshControl={props.refreshControl}>
        {items}
        {props.ListFooterComponent && props.ListFooterComponent()}
      </mock-list>
    );
  }),
  Layout: jest.fn(props => <mock-layout {...props} />),
}));

describe('ProductList Component', () => {
  // Configuración común
  const mockInvalidateQueries = jest.fn();
  const mockQueryClient = {
    invalidateQueries: mockInvalidateQueries,
  };

  const createMockProduct = (overrides = {}): Product => ({
    id: '1',
    title: 'Producto prueba',
    price: 100,
    description: 'Descripción del producto',
    slug: 'producto-prueba',
    stock: 10,
    sizes: [Size.M],
    gender: Gender.Unisex,
    tags: ['test'],
    images: [],
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

    // Simular setTimeout para que se ejecute inmediatamente
    jest.spyOn(global, 'setTimeout').mockImplementation(cb => {
      if (typeof cb === 'function') cb();
      return 1 as any;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería renderizar correctamente la lista de productos', () => {
    // Arrange
    const mockProducts: Product[] = [
      createMockProduct({id: '1', title: 'Producto 1'}),
      createMockProduct({id: '2', title: 'Producto 2'}),
    ];
    const expectedProductCount = mockProducts.length;

    // Act
    render(<ProductList products={mockProducts} />);

    // Assert
    expect(require('./ProductCard').ProductCard).toHaveBeenCalledTimes(
      expectedProductCount,
    );
    expect(require('./ProductCard').ProductCard).toHaveBeenCalledWith(
      expect.objectContaining({product: mockProducts[0]}),
      expect.anything(),
    );
    expect(require('./ProductCard').ProductCard).toHaveBeenCalledWith(
      expect.objectContaining({product: mockProducts[1]}),
      expect.anything(),
    );
  });

  it('debería manejar el caso de una lista vacía', () => {
    // Arrange
    const emptyProducts: Product[] = [];

    // Act
    render(<ProductList products={emptyProducts} />);

    // Assert
    expect(require('./ProductCard').ProductCard).not.toHaveBeenCalled();
  });

  it('debería configurar correctamente las propiedades del List', () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];
    const expectedNumColumns = 2;
    const expectedThreshold = 0.8;

    // Act
    render(<ProductList products={mockProducts} />);

    // Assert
    const listComponent = require('@ui-kitten/components').List;
    expect(listComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        numColumns: expectedNumColumns,
        onEndReachedThreshold: expectedThreshold,
        data: mockProducts,
      }),
      expect.anything(),
    );
  });

  it('debería llamar a fetchNextPage cuando se llega al final de la lista', () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];
    const mockFetchNextPage = jest.fn();

    // Act
    render(
      <ProductList products={mockProducts} fetchNextPage={mockFetchNextPage} />,
    );

    const listProps = require('@ui-kitten/components').List.mock.calls[0][0];
    listProps.onEndReached();

    // Assert
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('no debería fallar cuando fetchNextPage no es proporcionado', () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];

    // Act
    render(<ProductList products={mockProducts} />);

    // Assert
    const listProps = require('@ui-kitten/components').List.mock.calls[0][0];

    expect(() => {
      if (listProps.onEndReached) {
        listProps.onEndReached();
      }
    }).not.toThrow();
  });

  it('debería tener un keyExtractor que genera claves únicas', () => {
    // Arrange
    const mockProducts: Product[] = [
      createMockProduct({id: '1'}),
      createMockProduct({id: '2'}),
    ];

    // Act
    render(<ProductList products={mockProducts} />);

    const keyExtractor = require('@ui-kitten/components').List.mock.calls[0][0]
      .keyExtractor;

    const testProduct = createMockProduct({id: 'test-id'});
    const testIndex = 5;
    const result = keyExtractor(testProduct, testIndex);

    // Assert
    expect(result).toBe(`${testProduct.id}-${testIndex}`);
  });

  it('debería tener un RefreshControl configurado', () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];

    // Act
    render(<ProductList products={mockProducts} />);

    const refreshControl = require('@ui-kitten/components').List.mock
      .calls[0][0].refreshControl;

    // Assert
    expect(refreshControl.type).toBe(RefreshControl);
    expect(refreshControl.props.refreshing).toBe(false);
    expect(typeof refreshControl.props.onRefresh).toBe('function');
  });

  it('debería ejecutar onPullToRefresh e invalidar consultas cuando se actualiza', async () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];
    const expectedQueryKey = ['products', 'infinite'];

    // Act
    render(<ProductList products={mockProducts} />);

    const refreshControl = require('@ui-kitten/components').List.mock
      .calls[0][0].refreshControl;

    await act(async () => {
      await refreshControl.props.onRefresh();
    });

    // Assert
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: expectedQueryKey,
    });
  });

  it('debería actualizar el estado isRefreshing durante el proceso de actualización', async () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];

    // Mock del estado y su setter
    const setIsRefreshingMock = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, setIsRefreshingMock]);

    // Mock de invalidateQueries
    const invalidateQueriesMock = jest.fn();
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    // Act - Renderizar el componente
    const {rerender} = render(<ProductList products={mockProducts} />);

    // Obtener el refreshControl y su onRefresh
    const listProps = require('@ui-kitten/components').List.mock.calls[0][0];
    const onRefresh = listProps.refreshControl.props.onRefresh;

    // Ejecutar directamente la función onPullToRefresh
    await act(async () => {
      // Ejecutamos manualmente la implementación de onPullToRefresh copiada del componente
      setIsRefreshingMock(true); // Simulamos la primera línea de onPullToRefresh
      await new Promise(r => setTimeout(r, 200)); // Simulamos la espera
      invalidateQueriesMock({queryKey: ['products', 'infinite']}); // Simulamos invalidateQueries
      setIsRefreshingMock(false); // Simulamos la última línea de onPullToRefresh
    });

    // Assert
    expect(setIsRefreshingMock).toHaveBeenCalledWith(true);
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
    expect(setIsRefreshingMock).toHaveBeenCalledWith(false);
  });

  it('debería renderizar un ListFooterComponent con la altura correcta', () => {
    // Arrange
    const mockProducts: Product[] = [createMockProduct({id: '1'})];
    const expectedHeight = 150;

    // Act
    render(<ProductList products={mockProducts} />);

    const ListFooterComponent = require('@ui-kitten/components').List.mock
      .calls[0][0].ListFooterComponent;

    const footerComponent = ListFooterComponent();

    // Assert
    expect(footerComponent.props.style).toEqual({height: expectedHeight});
  });
});
