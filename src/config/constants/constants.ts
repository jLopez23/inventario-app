import {Gender, Product, Size} from '../../domain/entities/product';

export const sizes: Size[] = [
  Size.Xs,
  Size.S,
  Size.M,
  Size.L,
  Size.XL,
  Size.Xxl,
];
export const genders: Gender[] = [
  Gender.Kid,
  Gender.Men,
  Gender.Women,
  Gender.Unisex,
];

export const emptyProduct: Product = {
  id: '',
  title: '',
  description: '',
  price: 0,
  images: [],
  slug: '',
  gender: Gender.Unisex,
  sizes: [],
  stock: 0,
  tags: [],
};
