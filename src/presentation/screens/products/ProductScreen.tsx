import React, {useRef} from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  deleteProduct,
  getProductById,
  updateCreateProduct,
} from '../../../actions/products';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {ScrollView} from 'react-native-gesture-handler';
import {Product} from '../../../domain/entities/product';
import {MyIcon} from '../../components/ui/MyIcon';
import {Formik} from 'formik';
import {ProductImages} from '../../components/products/ProductImages';
import {sizes, genders} from '../../../config/constants/constants';
import {Alert} from 'react-native';
import {printAlert} from '../../../shared/helpers';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {
  productId: string;
}

export const ProductScreen = ({route, navigation}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id;
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
      printAlert(
        'Éxito',
        `El producto fue ${
          data.id === route.params.productId ? 'editado' : 'creado'
        } exitosamente.`,
      );
      navigation.goBack();
      console.log('Success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(productIdRef.current),
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      printAlert('Éxito', `El producto fue eliminado exitosamente.`);
      navigation.goBack();
      console.log('Producto eliminado');
    },
    onError() {
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      printAlert(
        'Error',
        'No se pudo eliminar el producto, actualice la lista de productos para validar si otro usuario lo eliminó.',
      );
      console.log('Error al eliminar el producto');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro que deseas eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteMutation.mutate(),
          style: 'destructive',
        },
      ],
    );
  };

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik initialValues={product} onSubmit={mutation.mutate}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout
          title={values.title}
          subTitle={`Precio: ${values.price}`}
          rightAction={async () => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos]);
          }}
          rightActionIcon="image-outline">
          <ScrollView style={{flex: 1}}>
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductImages images={values.images} />
            </Layout>

            <Layout style={{marginHorizontal: 10}}>
              <Input
                label="Título"
                style={{marginVertical: 5}}
                value={values.title}
                onChangeText={handleChange('title')}
              />
              <Input
                label="Slug"
                style={{marginVertical: 5}}
                value={values.slug}
                onChangeText={handleChange('slug')}
              />
              <Input
                label="Descripción"
                value={values.description}
                onChangeText={handleChange('description')}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
              />
            </Layout>

            <Layout
              style={{
                marginVertical: 5,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label="Precio"
                value={values.price.toString()}
                onChangeText={handleChange('price')}
                style={{flex: 1}}
                keyboardType="numeric"
              />
              <Input
                label="Inventario"
                value={values.stock.toString()}
                onChangeText={handleChange('stock')}
                style={{flex: 1}}
                keyboardType="numeric"
              />
            </Layout>

            <ButtonGroup
              style={{margin: 2, marginTop: 20, marginHorizontal: 15}}
              size="small"
              appearance="outline">
              {sizes.map(size => (
                <Button
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s === size)
                        : [...values.sizes, size],
                    )
                  }
                  key={size}
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup
              style={{margin: 2, marginTop: 20, marginHorizontal: 15}}
              size="small"
              appearance="outline">
              {genders.map(gender => (
                <Button
                  onPress={() => setFieldValue('gender', gender)}
                  key={gender}
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              style={{margin: 2, marginTop: 20, marginHorizontal: 50}}
              size="small">
              <Button
                accessoryLeft={<MyIcon name="save-outline" white />}
                onPress={() => handleSubmit()}
                disabled={mutation.isPending}
                style={{margin: 15}}>
                Guardar
              </Button>
              <Button
                accessoryLeft={<MyIcon name="trash-2-outline" white />}
                onPress={handleDelete}
                disabled={deleteMutation.isPending || mutation.isPending}
                status="danger"
                style={{margin: 15, backgroundColor: 'red'}}>
                Eliminar
              </Button>
            </ButtonGroup>

            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
