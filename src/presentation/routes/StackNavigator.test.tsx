import React from 'react';
import {render} from '@testing-library/react-native';
import {StackNavigator} from './StackNavigator';
import {NavigationContainer} from '@react-navigation/native';

// Mocks para las dependencias
jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: jest.fn(({children, initialRouteName, screenOptions}) => (
        <mock-navigator
          testID="stack-navigator"
          initialRouteName={initialRouteName}
          headerShown={screenOptions?.headerShown}>
          {children}
        </mock-navigator>
      )),
      Screen: jest.fn(({name, component, options}) => (
        <mock-screen
          testID={`screen-${name}`}
          name={name}
          component={component}
          animation={options?.cardStyleInterpolator ? true : false}
        />
      )),
    })),
    StackCardStyleInterpolator: {
      forFadeFromBottomAndroid: 'forFadeFromBottomAndroid-mock',
    },
  };
});

// Mock para los componentes de pantalla
jest.mock('../screens/home/HomeScreen', () => ({
  HomeScreen: 'HomeScreen-mock',
}));

jest.mock('../screens/auth/LoginScreen', () => ({
  LoginScreen: 'LoginScreen-mock',
}));

jest.mock('../screens/auth/RegisterScreen', () => ({
  RegisterScreen: 'RegisterScreen-mock',
}));

jest.mock('../screens/products/ProductScreen', () => ({
  ProductScreen: 'ProductScreen-mock',
}));

// Wrapper personalizado para proporcionar el contexto de navegación
const NavigationWrapper = ({children}) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('StackNavigator', () => {
  // Restablecer todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear correctamente el componente StackNavigator', () => {
    // Arrange - no se requiere configuración adicional

    // Act
    const {toJSON} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    expect(toJSON()).toBeTruthy();
    expect(
      require('@react-navigation/stack').createStackNavigator,
    ).toHaveBeenCalled();
  });

  it('debería renderizar las cuatro pantallas principales', () => {
    // Arrange
    const expectedScreenNames = [
      'LoginScreen',
      'RegisterScreen',
      'HomeScreen',
      'ProductScreen',
    ];

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    expectedScreenNames.forEach(name => {
      const screen = getByTestId(`screen-${name}`);
      expect(screen).toBeTruthy();
    });
  });

  it('debería configurar LoginScreen como pantalla inicial', () => {
    // Arrange
    const expectedInitialRouteName = 'LoginScreen';

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    const navigator = getByTestId('stack-navigator');
    expect(navigator.props.initialRouteName).toBe(expectedInitialRouteName);
  });

  it('debería configurar las pantallas sin mostrar el encabezado', () => {
    // Arrange
    const expectedHeaderShown = false;

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    const navigator = getByTestId('stack-navigator');
    expect(navigator.props.headerShown).toBe(expectedHeaderShown);
  });

  it('debería aplicar la animación fadeAnimation a las tres pantallas principales', () => {
    // Arrange
    const expectedScreensWithFade = [
      'LoginScreen',
      'RegisterScreen',
      'HomeScreen',
    ];

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    expectedScreensWithFade.forEach(name => {
      const screen = getByTestId(`screen-${name}`);
      expect(screen.props.animation).toBe(true);
    });
  });

  it('debería definir correctamente ProductScreen con sus parámetros', () => {
    // Arrange
    const screenName = 'ProductScreen';
    const expectedComponent = 'ProductScreen-mock';

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    const productScreen = getByTestId(`screen-${screenName}`);
    expect(productScreen.props.name).toBe(screenName);
    expect(productScreen.props.component).toBe(expectedComponent);
    expect(productScreen.props.animation).toBe(false);
  });

  it('debería verificar la implementación de fadeAnimation', () => {
    // En esta prueba verificamos que el componente StackNavigator
    // utiliza correctamente la función fadeAnimation

    // Act
    const {getByTestId} = render(<StackNavigator />, {
      wrapper: NavigationWrapper,
    });

    // Assert
    // Verificamos que las pantallas que deberían tener animación
    // efectivamente la tengan configurada
    const loginScreen = getByTestId('screen-LoginScreen');
    const registerScreen = getByTestId('screen-RegisterScreen');
    const homeScreen = getByTestId('screen-HomeScreen');

    expect(loginScreen.props.animation).toBe(true);
    expect(registerScreen.props.animation).toBe(true);
    expect(homeScreen.props.animation).toBe(true);
  });
});
