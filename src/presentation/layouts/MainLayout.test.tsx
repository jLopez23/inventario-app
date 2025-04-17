import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {MainLayout} from './MainLayout';
import {useNavigation} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

// Componente wrapper para proporcionar el contexto necesario para UI Kitten
const AllProviders = ({children}) => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      {children}
    </ApplicationProvider>
  </>
);

// Función personalizada de render que incluye los providers
const customRender = (ui, options) =>
  render(ui, {wrapper: AllProviders, ...options});

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn().mockReturnValue({top: 10}),
}));

// Mock adecuado para MyIcon (más similar a como se hace en ProductCard.test.tsx)
jest.mock('../components/ui/MyIcon', () => ({
  MyIcon: jest.fn(({name}) => (
    <mock-icon testID={`icon-${name}`} name={name} />
  )),
}));

// Mock para los componentes de UI Kitten
jest.mock('@ui-kitten/components', () => ({
  ApplicationProvider: jest.fn(({children}) => <>{children}</>),
  IconRegistry: jest.fn(() => null),
  Layout: jest.fn(({children, style}) => (
    <mock-layout testID="layout" style={style}>
      {children}
    </mock-layout>
  )),
  TopNavigation: jest.fn(
    ({title, subtitle, alignment, accessoryLeft, accessoryRight}) => (
      <mock-topnavigation testID="top-navigation">
        {accessoryLeft && accessoryLeft()}
        <mock-title testID="title">{title}</mock-title>
        {subtitle && (
          <mock-subtitle testID="subtitle">{subtitle}</mock-subtitle>
        )}
        {accessoryRight && accessoryRight()}
      </mock-topnavigation>
    ),
  ),
  TopNavigationAction: jest.fn(({icon, onPress}) => (
    <mock-navigation-action testID="navigation-action" onPress={onPress}>
      {icon}
    </mock-navigation-action>
  )),
  Divider: jest.fn(() => <mock-divider testID="divider" />),
}));

describe('MainLayout Component', () => {
  // Restablecer todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      canGoBack: jest.fn().mockReturnValue(false),
      goBack: jest.fn(),
    });
  });

  it('debería renderizar correctamente con título y subtítulo', () => {
    // Arrange
    const expectedTitle = 'Título de Prueba';
    const expectedSubtitle = 'Subtítulo de Prueba';
    const expectedChildText = 'Contenido de prueba';

    // Act
    const {getByTestId, getByText} = render(
      <MainLayout title={expectedTitle} subTitle={expectedSubtitle}>
        <mock-text testID="child-content">{expectedChildText}</mock-text>
      </MainLayout>,
    );

    // Assert
    expect(getByTestId('title').props.children).toBe(expectedTitle);
    expect(getByTestId('subtitle').props.children).toBe(expectedSubtitle);
    expect(getByTestId('child-content').props.children).toBe(expectedChildText);
  });

  it('debería mostrar el botón de retroceso cuando canGoBack devuelve true', () => {
    // Arrange
    (useNavigation as jest.Mock).mockReturnValue({
      canGoBack: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
    });
    const expectedTitle = 'Título de Prueba';
    const expectedIconName = 'arrow-back-outline';

    // Act
    const {getByTestId} = render(
      <MainLayout title={expectedTitle}>
        <mock-text>Contenido</mock-text>
      </MainLayout>,
    );

    // Assert
    expect(getByTestId(`icon-${expectedIconName}`)).toBeTruthy();
  });

  it('debería navegar hacia atrás al presionar el botón de retroceso', () => {
    // Arrange
    const mockGoBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      canGoBack: jest.fn().mockReturnValue(true),
      goBack: mockGoBack,
    });
    const expectedTitle = 'Título de Prueba';

    // Act
    const {getByTestId} = render(
      <MainLayout title={expectedTitle}>
        <mock-text>Contenido</mock-text>
      </MainLayout>,
    );

    // Buscar el botón de navegación y simular la pulsación
    const navigationAction = getByTestId('navigation-action');
    fireEvent.press(navigationAction);

    // Assert
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar el botón de acción derecha cuando se proporcionan rightAction y rightActionIcon', () => {
    // Arrange
    const expectedTitle = 'Título de Prueba';
    const mockRightAction = jest.fn();
    const expectedRightActionIcon = 'log-out-outline';

    // Act
    const {getByTestId} = render(
      <MainLayout
        title={expectedTitle}
        rightAction={mockRightAction}
        rightActionIcon={expectedRightActionIcon}>
        <mock-text>Contenido</mock-text>
      </MainLayout>,
    );

    // Assert
    expect(getByTestId(`icon-${expectedRightActionIcon}`)).toBeTruthy();
  });

  it('debería ejecutar rightAction al presionar el botón de acción derecha', () => {
    // Arrange
    const expectedTitle = 'Título de Prueba';
    const mockRightAction = jest.fn();
    const expectedRightActionIcon = 'log-out-outline';

    // Act
    const {getAllByTestId} = render(
      <MainLayout
        title={expectedTitle}
        rightAction={mockRightAction}
        rightActionIcon={expectedRightActionIcon}>
        <mock-text>Contenido</mock-text>
      </MainLayout>,
    );

    // Buscar todos los botones de acción de navegación - seleccionamos el segundo (el de la derecha)
    const navigationActions = getAllByTestId('navigation-action');
    // Presionar el botón de acción derecha (debería ser el último)
    fireEvent.press(navigationActions[navigationActions.length - 1]);

    // Assert
    expect(mockRightAction).toHaveBeenCalledTimes(1);
  });

  it('no debería mostrar el botón de acción derecha cuando rightAction o rightActionIcon no están definidos', () => {
    // Arrange
    const expectedTitle = 'Título de Prueba';
    // Solo proporcionamos rightAction pero no rightActionIcon
    const mockRightAction = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      canGoBack: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
    });

    // Act
    const {queryByTestId} = render(
      <MainLayout title={expectedTitle} rightAction={mockRightAction}>
        <mock-text>Contenido</mock-text>
      </MainLayout>,
    );

    // Assert
    // Verificar que existe el botón de retroceso pero no el de acción derecha
    expect(queryByTestId('icon-arrow-back-outline')).toBeTruthy();
    expect(queryByTestId('icon-log-out-outline')).toBeNull();
  });
});
