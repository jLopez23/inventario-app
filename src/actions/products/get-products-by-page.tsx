import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {tesloApi} from '../../config/api/tesloApi';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';
import {Product} from '../../domain/entities/product';

export const getProductsByPage = async (
  page: number,
  limit: number = 20,
): Promise<Product[]> => {
  try {
    const {data} = await tesloApi.get<TesloProduct[]>(
      `/products?offset=${page * 10}&limit=${limit}`,
    );

    const products = data.map(ProductMapper.tesloProductToEntity);
    return products;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching products');
  }
};
