import {isAxiosError} from 'axios';
import {getProductById} from './get-product-by-id';
import {tesloApi} from '../../config/api/tesloApi';

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const checkedProduct = await getProductById(id);

    if (!checkedProduct?.id) {
      throw new Error('Product not found');
    }

    await tesloApi.delete(`/products/${checkedProduct.id}`);

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Error Axios deleteProduct:', JSON.stringify(error));
    }
    throw new Error('Error al crear el producto');
  }
};
