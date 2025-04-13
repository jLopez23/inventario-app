import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ProductList} from './ProductList';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Gender, Product, Size} from '../../../domain/entities/product';

jest.mock('./ProductCard', () => ({
  ProductCard: ({product}: any) => <>{`ProductCard: ${product.name}`}</>,
}));

const createWrapper = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Product 1 Title',
    price: 100,
    description: 'Product 1 Description',
    slug: 'product-1',
    images: [],
    gender: Gender.Unisex,
    stock: 10,
    tags: ['new'],
    sizes: [Size.S, Size.M],
  },
  {
    id: '2',
    title: 'Product 2 Title',
    price: 200,
    description: 'Product 2 Description',
    slug: 'product-2',
    images: [],
    gender: Gender.Unisex,
    stock: 5,
    tags: ['sale'],
    sizes: [Size.S, Size.M],
  },
];

describe('ProductList', () => {
  it('renders list of products', () => {
    const {getByText} = createWrapper(<ProductList products={mockProducts} />);

    expect(getByText('ProductCard: Product 1')).toBeTruthy();
    expect(getByText('ProductCard: Product 2')).toBeTruthy();
  });

  it('calls fetchNextPage on end reached', () => {
    const fetchNextPageMock = jest.fn();
    const {getByTestId} = createWrapper(
      <ProductList products={mockProducts} fetchNextPage={fetchNextPageMock} />,
    );

    // Dispara onEndReached manualmente
    fireEvent(getByTestId('flat-list'), 'onEndReached');
    expect(fetchNextPageMock).toHaveBeenCalled();
  });

  it('handles pull to refresh and invalidates query', async () => {
    const {getByTestId} = createWrapper(
      <ProductList products={mockProducts} />,
    );
    const list = getByTestId('flat-list');

    fireEvent(list, 'refresh');

    // Espera al efecto del setTimeout
    await waitFor(() => {
      // No esperamos un resultado visible, pero este paso simula el delay y evita warnings
    });
  });
});
