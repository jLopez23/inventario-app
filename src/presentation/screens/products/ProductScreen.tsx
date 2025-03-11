import React, { useRef } from 'react';
import {Text} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {useQuery} from '@tanstack/react-query';
import {getProductById} from '../../../actions/products/get-product-by-id';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {
  productId: string;
}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);

  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <MainLayout
      title={product.title}
      subTitle={`Precio: ${product.price}`}>
      <Text>Hola Mundo</Text>
    </MainLayout>
  );
};
