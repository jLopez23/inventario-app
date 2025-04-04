import {ProductMapper} from '../../infrastructure/mappers/product.mapper';
import {Product} from '../../domain/entities/product';
import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {tesloApi} from '../../config/api/tesloApi';
import { emptyProduct } from '../../config/constants/constants';

export const getProductById = async (id: string): Promise<Product> => {
  if (id === 'new') return emptyProduct;
  try {
    const {data} = await tesloApi.get<TesloProduct>(`/products/${id}`);
    return ProductMapper.tesloProductToEntity(data);
  } catch (error) {
    console.log(`Error getProductById: ${JSON.stringify(error)}`);
    throw new Error(`Error fetching product by id: ${id}`);
  }
};
