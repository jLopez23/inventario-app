import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useAuth} from '../../hooks/useAuth';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {MainLayout} from '../../layouts/MainLayout';
import {FullScreenLoader} from '../../../presentation/components/ui/FullScreenLoader';
import {ProductList} from '../../../presentation/components/products/ProductList';
import {getProductsByPage} from '../../../actions/products/get-products-by-page';
import {useInfiniteQuery} from '@tanstack/react-query';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation}: Props) => {
  const {name} = useSelector(({authUser}: RootState) => authUser);
  const {logout} = useAuth();

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60,
    initialPageParam: 0,
    queryFn: async params => {
      return await getProductsByPage(params.pageParam);
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return (
    <MainLayout title="Inventario App" subTitle={`Hola ${name}`}>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <ProductList
          products={data?.pages.flat() ?? []}
          fetchNextPage={fetchNextPage}
        />
      )}

      {/* <Text>Hola {name}</Text> */}
      {/*       <Button
        accessoryLeft={<Icon name="log-out-outline" />}
        onPress={logout}>
        Logout
      </Button> */}
    </MainLayout>
  );
};
