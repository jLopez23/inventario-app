export interface TesloProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  images: string[];
  user: TesloUser;
}

export enum Gender {
  Kid = 'kid',
  Men = 'men',
  Unisex = 'unisex',
  Women = 'women',
}

export enum Size {
  Xs = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  Xxl = 'XXL',
}

export interface TesloUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}
