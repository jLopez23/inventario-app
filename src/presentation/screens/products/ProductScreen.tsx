import React, {useRef} from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {useQuery} from '@tanstack/react-query';
import {getProductById} from '../../../actions/products/get-product-by-id';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {FadeInImage} from '../../components/ui/FadeInImage';
import {Size, Gender} from '../../../domain/entities/product';
import {MyIcon} from '../../components/ui/MyIcon';
import {Formik} from 'formik';

const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.XL, Size.Xxl];
const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];
interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {
  productId: string;
}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();

  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik>
      <MainLayout title={product.title} subTitle={`Precio: ${product.price}`}>
        <ScrollView style={{flex: 1}}>
          <Layout>
            <FlatList
              data={product.images}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <FadeInImage
                  uri={item}
                  style={{width: 300, height: 300, marginHorizontal: 7}}
                />
              )}
            />
          </Layout>

          <Layout style={{marginHorizontal: 10}}>
            <Input
              label="Título"
              value={product.title}
              style={{marginVertical: 5}}
            />
            <Input
              label="Slug"
              value={product.slug}
              style={{marginVertical: 5}}
            />
            <Input
              label="Descripción"
              value={product.description}
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
              value={product.price.toString()}
              style={{flex: 1}}
            />
            <Input
              label="Inventario"
              value={product.stock.toString()}
              style={{flex: 1}}
            />
          </Layout>

          <ButtonGroup
            style={{margin: 2, marginTop: 20, marginHorizontal: 15}}
            size="small"
            appearance="outline">
            {sizes.map(size => (
              <Button
                key={size}
                style={{
                  flex: 1,
                  backgroundColor: true
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
                key={gender}
                style={{
                  flex: 1,
                  backgroundColor: true
                    ? theme['color-primary-200']
                    : undefined,
                }}>
                {gender}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            accessoryLeft={<MyIcon name="save-outline" white />}
            onPress={() => console.log('Guardar')}
            style={{margin: 15}}>
            Guardar
          </Button>
          <Layout style={{height: 200}} />
        </ScrollView>
      </MainLayout>
    </Formik>
  );
};
