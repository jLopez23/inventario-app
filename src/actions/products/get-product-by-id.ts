import {ProductMapper} from '../../infrastructure/mappers/product.mapper';
import {Product} from '../../domain/entities/product';
import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {tesloApi} from '../../config/api/tesloApi';

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const {data} = await tesloApi.get<TesloProduct>(`/products/${id}`);
    return ProductMapper.tesloProductToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching product by id: ${id}`);
  }
};
