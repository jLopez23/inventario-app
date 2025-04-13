import {AuthResponse} from '../src/infrastructure/interfaces/auth.responses';
import {TesloProduct} from '../src/infrastructure/interfaces/teslo-products.response';
import {Gender, Product, Size} from '../src/domain/entities/product';

export const mockAuthResponse: AuthResponse = {
  id: 'user-123',
  email: 'test@example.com',
  fullName: 'Test User',
  isActive: true,
  roles: ['user'],
  token: 'jwt-token-123',
};

export const expectedUserToken = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    fullName: 'Test User',
    isActive: true,
    roles: ['user'],
  },
  token: 'jwt-token-123',
};

export const mockTesloProduct: TesloProduct = {
  id: '123',
  title: 'Test Product',
  price: 100,
  description: 'Test description',
  slug: 'test-product',
  stock: 10,
  sizes: [Size.S, Size.M],
  gender: Gender.Men,
  tags: ['test', 'product'],
  images: ['image1.jpg', 'image2.jpg'],
  user: mockAuthResponse,
};

export const expectedMappedProduct: Product = {
  id: '123',
  title: 'Test Product',
  price: 100,
  description: 'Test description',
  slug: 'test-product',
  sizes: [Size.S, Size.M],
  gender: Gender.Men,
  tags: ['test', 'product'],
  images: ['image1.jpg', 'image2.jpg'],
  stock: 10,
};
