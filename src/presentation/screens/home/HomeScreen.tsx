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
import {FAB} from '../../../presentation/components/ui/FAB';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation}: Props) => {
  const {user} = useSelector(({authUser}: RootState) => authUser);
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
    <>
      <MainLayout
        title="Inventario App"
        subTitle={`Hola ${user?.fullName}`}
        rightAction={logout}
        rightActionIcon="log-out-outline">
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <ProductList
            products={data?.pages.flat() ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </MainLayout>
      <FAB
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen', { productId: 'new' })}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
      />
    </>
  );
};
