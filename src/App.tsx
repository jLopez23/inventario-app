import 'react-native-gesture-handler';

import {Provider} from 'react-native-paper';
import {theme} from './presentation/theme/theme';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './presentation/routes/StackNavigator';

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
