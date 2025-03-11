import React from 'react';
import 'react-native-gesture-handler';

import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './presentation/routes/StackNavigator';

import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {AuthProvider} from './presentation/providers/AuthProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  return (
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer>
          <AuthProvider>
            <StackNavigator />
          </AuthProvider>
        </NavigationContainer>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};

export default App;
