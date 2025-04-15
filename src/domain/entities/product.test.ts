import {Product, Gender, Size} from './product';

describe('Product Entity', () => {
  // Pruebas para la estructura de la interfaz Product
  describe('Product Interface', () => {
    it('should correctly create a Product object with all required properties', () => {
      // Arrange
      const mockProduct: Product = {
        id: '1',
        title: 'Test Product',
        price: 29.99,
        description: 'Test product description',
        slug: 'test-product',
        stock: 50,
        sizes: [Size.S, Size.M, Size.L],
        gender: Gender.Unisex,
        tags: ['test', 'mock'],
        images: ['image1.jpg', 'image2.jpg'],
      };

      const expectedId = '1';
      const expectedTitle = 'Test Product';
      const expectedPrice = 29.99;
      const expectedDescription = 'Test product description';
      const expectedSlug = 'test-product';
      const expectedStock = 50;
      const expectedSizes = [Size.S, Size.M, Size.L];
      const expectedGender = Gender.Unisex;
      const expectedTags = ['test', 'mock'];
      const expectedImages = ['image1.jpg', 'image2.jpg'];

      // Assert
      expect(mockProduct).toBeDefined();
      expect(mockProduct.id).toBe(expectedId);
      expect(mockProduct.title).toBe(expectedTitle);
      expect(mockProduct.price).toBe(expectedPrice);
      expect(mockProduct.description).toBe(expectedDescription);
      expect(mockProduct.slug).toBe(expectedSlug);
      expect(mockProduct.stock).toBe(expectedStock);
      expect(mockProduct.sizes).toEqual(expectedSizes);
      expect(mockProduct.gender).toBe(expectedGender);
      expect(mockProduct.tags).toEqual(expectedTags);
      expect(mockProduct.images).toEqual(expectedImages);
    });

    it('should allow setting minimum required values for a valid product', () => {
      // Arrange
      const mockMinimalProduct: Product = {
        id: '2',
        title: 'Minimal Product',
        price: 0,
        description: '',
        slug: 'minimal-product',
        stock: 0,
        sizes: [],
        gender: Gender.Unisex,
        tags: [],
        images: [],
      };

      const expectedStock = 0;
      const expectedSizesLength = 0;
      const expectedTagsLength = 0;
      const expectedImagesLength = 0;

      // Assert
      expect(mockMinimalProduct).toBeDefined();
      expect(mockMinimalProduct.stock).toBe(expectedStock);
      expect(mockMinimalProduct.sizes).toHaveLength(expectedSizesLength);
      expect(mockMinimalProduct.tags).toHaveLength(expectedTagsLength);
      expect(mockMinimalProduct.images).toHaveLength(expectedImagesLength);
    });
  });

  // Pruebas para el enum Gender
  describe('Gender Enum', () => {
    it('should contain all expected values', () => {
      // Arrange
      const expectedGenderKeys = ['Kid', 'Men', 'Unisex', 'Women'];
      const expectedGenderValues = ['kid', 'men', 'unisex', 'women'];

      // Assert
      expect(Object.keys(Gender)).toEqual(expectedGenderKeys);
      expect(Object.values(Gender)).toEqual(expectedGenderValues);

      // Verificar valores individuales
      expect(Gender.Kid).toBe('kid');
      expect(Gender.Men).toBe('men');
      expect(Gender.Unisex).toBe('unisex');
      expect(Gender.Women).toBe('women');
    });

    it('should correctly use Gender in a Product', () => {
      // Arrange
      const mockWomenProduct: Partial<Product> = {gender: Gender.Women};
      const mockMenProduct: Partial<Product> = {gender: Gender.Men};
      const mockKidProduct: Partial<Product> = {gender: Gender.Kid};
      const mockUnisexProduct: Partial<Product> = {gender: Gender.Unisex};

      const expectedWomenGender = 'women';
      const expectedMenGender = 'men';
      const expectedKidGender = 'kid';
      const expectedUnisexGender = 'unisex';

      // Assert
      expect(mockWomenProduct.gender).toBe(expectedWomenGender);
      expect(mockMenProduct.gender).toBe(expectedMenGender);
      expect(mockKidProduct.gender).toBe(expectedKidGender);
      expect(mockUnisexProduct.gender).toBe(expectedUnisexGender);
    });
  });

  // Pruebas para el enum Size
  describe('Size Enum', () => {
    it('should contain all expected values', () => {
      // Arrange
      const expectedSizeKeys = ['Xs', 'S', 'M', 'L', 'XL', 'Xxl'];
      const expectedSizeValues = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

      // Assert
      expect(Object.keys(Size)).toEqual(expectedSizeKeys);
      expect(Object.values(Size)).toEqual(expectedSizeValues);

      // Verificar valores individuales
      expect(Size.Xs).toBe('XS');
      expect(Size.S).toBe('S');
      expect(Size.M).toBe('M');
      expect(Size.L).toBe('L');
      expect(Size.XL).toBe('XL');
      expect(Size.Xxl).toBe('XXL');
    });

    it('should correctly use Size array in a Product', () => {
      // Arrange
      const mockAllSizesProduct: Partial<Product> = {
        sizes: [Size.Xs, Size.S, Size.M, Size.L, Size.XL, Size.Xxl],
      };

      const mockSmallProduct: Partial<Product> = {
        sizes: [Size.Xs, Size.S],
      };

      const mockMediumProduct: Partial<Product> = {
        sizes: [Size.M, Size.L],
      };

      const mockLargeProduct: Partial<Product> = {
        sizes: [Size.XL, Size.Xxl],
      };

      const expectedAllSizesCount = 6;
      const expectedSmallSizesCount = 2;
      const expectedMediumSizesCount = 2;
      const expectedLargeSizesCount = 2;

      // Assert
      expect(mockAllSizesProduct.sizes).toHaveLength(expectedAllSizesCount);
      expect(mockAllSizesProduct.sizes).toContain(Size.Xs);
      expect(mockAllSizesProduct.sizes).toContain(Size.Xxl);

      expect(mockSmallProduct.sizes).toHaveLength(expectedSmallSizesCount);
      expect(mockSmallProduct.sizes).toContain(Size.Xs);
      expect(mockSmallProduct.sizes).toContain(Size.S);

      expect(mockMediumProduct.sizes).toHaveLength(expectedMediumSizesCount);
      expect(mockMediumProduct.sizes).toContain(Size.M);
      expect(mockMediumProduct.sizes).toContain(Size.L);

      expect(mockLargeProduct.sizes).toHaveLength(expectedLargeSizesCount);
      expect(mockLargeProduct.sizes).toContain(Size.XL);
      expect(mockLargeProduct.sizes).toContain(Size.Xxl);
    });
  });

  // Pruebas para casos límite y esquina
  describe('Edge and Corner Cases', () => {
    it('should handle products with extreme values', () => {
      // Arrange
      const mockExtremeProduct: Product = {
        id: '999999999999999',
        title: 'A'.repeat(100), // Título muy largo
        price: Number.MAX_SAFE_INTEGER,
        description: 'B'.repeat(500), // Descripción muy larga
        slug: 'extremely-long-slug-name-for-testing-purposes',
        stock: Number.MAX_SAFE_INTEGER,
        sizes: Object.values(Size), // Todas las tallas
        gender: Gender.Unisex,
        tags: Array(50).fill('tag'), // Muchas etiquetas
        images: Array(100).fill('image.jpg'), // Muchas imágenes
      };

      const expectedSizesCount = 6; // Número de valores en el enum Size
      const expectedTagsCount = 50;
      const expectedImagesCount = 100;

      // Assert
      expect(mockExtremeProduct).toBeDefined();
      expect(mockExtremeProduct.sizes).toHaveLength(expectedSizesCount);
      expect(mockExtremeProduct.tags).toHaveLength(expectedTagsCount);
      expect(mockExtremeProduct.images).toHaveLength(expectedImagesCount);
    });

    it('should handle products with zero prices and stock', () => {
      // Arrange
      const mockFreeProduct: Product = {
        id: '3',
        title: 'Free Product',
        price: 0,
        description: 'This product is free',
        slug: 'free-product',
        stock: 0,
        sizes: [Size.M],
        gender: Gender.Unisex,
        tags: ['free'],
        images: ['free.jpg'],
      };

      const expectedPrice = 0;
      const expectedStock = 0;

      // Assert
      expect(mockFreeProduct.price).toBe(expectedPrice);
      expect(mockFreeProduct.stock).toBe(expectedStock);
    });
  });
});
