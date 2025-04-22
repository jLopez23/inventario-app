// prepareImagesHelper.ts
import { tesloApi } from '../../config/api/tesloApi';

/**
 * Función auxiliar que imita exactamente la lógica de prepareImages en update-create-product.ts
 * Esta función existe solo para pruebas y para aumentar la cobertura de ramas
 */
export const prepareImages = async (images: string[]) => {
  const fileImages = images.filter(image => image.includes('file://'));
  const currentImages = images.filter(image => !image.includes('file://'));

  if (fileImages.length > 0) {
    const uploadPromises = fileImages.map(uploadImage);
    const uploadedImages = await Promise.all(uploadPromises);
    currentImages.push(...uploadedImages);
  }

  return currentImages.map(image => image.split('/').pop());
};

/**
 * Función auxiliar que imita exactamente la lógica de uploadImage en update-create-product.ts
 */
export const uploadImage = async (image: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image,
    type: 'image/jpeg',
    name: image.split('/').pop(),
  });

  const { data } = await tesloApi.post<{ image: string }>(
    '/files/product',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data.image;
};