import React from 'react';
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import {HomeScreen} from '../screens/home/HomeScreen';
import {ProductsScreen} from '../screens/products/ProductsScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {RegisterScreen} from '../screens/auth/RegisterScreen';
import {ProductScreen} from '../screens/products/ProductScreen';

export type RootStackParams = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  ProductScreen: {productId: string};
  ProductsScreen: {productId: string};
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({current}) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
    </Stack.Navigator>
  );
};
