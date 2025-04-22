import React from 'react';
import {render} from '@testing-library/react-native';
import {HomeScreen} from './HomeScreen';
import {useAuth} from '../../hooks/useAuth';
import {useSelector} from 'react-redux';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getProductsByPage} from '../../../actions/products/get-products-by-page';

// Mocks para las dependencias
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(),
}));

jest.mock('../../../actions/products/get-products-by-page', () => ({
  getProductsByPage: jest.fn(),
}));

// Mock para los componentes utilizados
jest.mock('../../layouts/MainLayout', () => ({
  MainLayout: ({children, title, subTitle, rightAction, rightActionIcon}) => (
    <mock-main-layout
      testID="main-layout"
      title={title}
      subTitle={subTitle}
      rightAction={rightAction}
      rightActionIcon={rightActionIcon}>
      {children}
    </mock-main-layout>
  ),
}));

jest.mock('../../../presentation/components/ui/FullScreenLoader', () => ({
  FullScreenLoader: () => (
    <mock-full-screen-loader testID="full-screen-loader" />
  ),
}));

jest.mock('../../../presentation/components/products/ProductList', () => ({
  ProductList: ({products, fetchNextPage}) => (
    <mock-product-list
      testID="product-list"
      products={products}
      fetchNextPage={fetchNextPage}
    />
  ),
}));

jest.mock('../../../presentation/components/ui/FAB', () => ({
  FAB: ({iconName, onPress, style}) => (
    <mock-fab
      testID="fab-button"
      iconName={iconName}
      onPress={onPress}
      style={style}
    />
  ),
}));

describe('HomeScreen', () => {
  // Mocks para las funciones y hooks
  const mockLogout = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  const mockUser = {
    id: '1',
    fullName: 'Usuario Test',
    email: 'test@example.com',
  };
  const mockProducts = [
    {id: '1', title: 'Producto 1', price: 100},
    {id: '2', title: 'Producto 2', price: 200},
  ];
  const mockFetchNextPage = jest.fn();
  const mockQueryFn = jest.fn();
  const mockGetNextPageParam = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración predeterminada para useSelector
    (useSelector as jest.Mock).mockImplementation(selector => {
      // Ejecutamos el selector directamente con un objeto simulado
      return selector({authUser: {user: mockUser}});
    });

    // Configuración predeterminada para useAuth
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });

    // Configuración para getProductsByPage
    (getProductsByPage as jest.Mock).mockResolvedValue(mockProducts);

    // Configuración predeterminada para useInfiniteQuery
    (useInfiniteQuery as jest.Mock).mockImplementation(
      ({queryFn, getNextPageParam}) => {
        mockQueryFn.mockImplementation(queryFn);
        mockGetNextPageParam.mockImplementation(getNextPageParam);
        return {
          isLoading: false,
          data: {
            pages: [mockProducts],
          },
          fetchNextPage: mockFetchNextPage,
        };
      },
    );
  });

  it('debería renderizarse correctamente', () => {
    // Arrange - no es necesaria configuración adicional

    // Act
    const {toJSON} = render(<HomeScreen navigation={mockNavigation as any} />);

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar el título y el nombre del usuario', () => {
    // Arrange
    const expectedTitle = 'Inventario App';
    const expectedSubtitle = `Hola ${mockUser.fullName}`;

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const mainLayout = getByTestId('main-layout');

    // Assert
    expect(mainLayout.props.title).toBe(expectedTitle);
    expect(mainLayout.props.subTitle).toBe(expectedSubtitle);
  });

  it('debería mostrar el FullScreenLoader cuando está cargando', () => {
    // Arrange
    // Configurar loading como true
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      fetchNextPage: mockFetchNextPage,
    });

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );

    // Assert
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('debería mostrar la lista de productos cuando no está cargando', () => {
    // Arrange
    const expectedProducts = mockProducts;

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const productList = getByTestId('product-list');

    // Assert
    expect(productList).toBeTruthy();
    expect(productList.props.products).toEqual(expectedProducts);
    expect(productList.props.fetchNextPage).toBe(mockFetchNextPage);
  });

  it('debería llamar a la función logout cuando se presiona el botón de logout', () => {
    // Arrange
    const expectedCallCount = 1;

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const mainLayout = getByTestId('main-layout');

    // Simular clic en el botón de logout
    mainLayout.props.rightAction();

    // Assert
    expect(mockLogout).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería tener el icono correcto para la acción de logout', () => {
    // Arrange
    const expectedIcon = 'log-out-outline';

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const mainLayout = getByTestId('main-layout');

    // Assert
    expect(mainLayout.props.rightActionIcon).toBe(expectedIcon);
  });

  it('debería navegar a la pantalla de productos cuando se presiona el botón FAB', () => {
    // Arrange
    const expectedScreen = 'ProductScreen';
    const expectedParams = {productId: 'new'};

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const fabButton = getByTestId('fab-button');

    // Simular clic en el botón FAB
    fabButton.props.onPress();

    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      expectedScreen,
      expectedParams,
    );
  });

  it('debería filtrar productos duplicados si existen', () => {
    // Arrange
    const productsWithDuplicates = [
      {id: '1', title: 'Producto 1', price: 100},
      {id: '1', title: 'Producto 1', price: 100}, // Duplicado
      {id: '2', title: 'Producto 2', price: 200},
    ];
    const expectedFilteredProducts = [
      {id: '1', title: 'Producto 1', price: 100},
      {id: '2', title: 'Producto 2', price: 200},
    ];

    // Configurar mock con productos duplicados
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        pages: [productsWithDuplicates],
      },
      fetchNextPage: mockFetchNextPage,
    });

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const productList = getByTestId('product-list');

    // Assert
    expect(productList.props.products.length).toBe(
      expectedFilteredProducts.length,
    );
    expect(productList.props.products).toEqual(expectedFilteredProducts);
  });

  it('debería configurar correctamente la función queryFn', async () => {
    // Arrange
    const pageParam = 0;

    // Act
    render(<HomeScreen navigation={mockNavigation as any} />);

    // Simular la llamada a queryFn con un parámetro de página
    await mockQueryFn({pageParam});

    // Assert
    expect(getProductsByPage).toHaveBeenCalledWith(pageParam);
  });

  it('debería configurar correctamente la función getNextPageParam', () => {
    // Arrange
    const mockLastPage = mockProducts;
    const mockAllPages = [mockProducts, mockProducts];
    const expectedResult = mockAllPages.length;

    // Act
    render(<HomeScreen navigation={mockNavigation as any} />);

    // Simular la llamada a getNextPageParam
    const result = mockGetNextPageParam(mockLastPage, mockAllPages);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('debería manejar el caso donde data es null', () => {
    // Arrange
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      fetchNextPage: mockFetchNextPage,
    });

    // Act
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as any} />,
    );
    const productList = getByTestId('product-list');

    // Assert
    expect(productList.props.products).toEqual([]);
  });
});
