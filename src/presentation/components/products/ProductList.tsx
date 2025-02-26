import React from 'react';
import {List} from 'react-native-paper';

interface Props {
  products: any[];
}

export const ProductList = ({products}: Props) => {
  return (
    <List
      data={products}
      numColumns={2}
      keyExtractor={(item: string, index: string) => `${item.id}-${index}`}
    />
  );
};
