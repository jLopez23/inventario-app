import 'react-native-gesture-handler';

import { Provider } from 'react-native-paper'
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './presentation/routes/StackNavigator';
import { theme } from './presentation/theme/theme';

const App = () => {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
