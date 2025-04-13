import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import ReduxProvider from './Redux';
import {Provider} from 'react-redux';
import {store} from '../redux/store';

// Mock para react-redux Provider
jest.mock('react-redux', () => {
  return {
    Provider: jest.fn(({children}) => children),
  };
});

// Mock para el store
jest.mock('../redux/store', () => ({
  store: {
    // Mock mínimo de la estructura del store
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe('ReduxProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente a sus hijos', () => {
    // Arrange
    const testId = 'test-child';
    const expectedText = 'Contenido de prueba';
    const TestChild = () => <Text testID={testId}>{expectedText}</Text>;

    // Act
    const {getByTestId} = render(
      <ReduxProvider>
        <TestChild />
      </ReduxProvider>,
    );

    // Assert
    expect(getByTestId(testId)).toBeTruthy();
    expect(getByTestId(testId)).toHaveTextContent(expectedText);
  });

  it('debería renderizar múltiples hijos correctamente', () => {
    // Arrange
    const firstChildId = 'first-child';
    const secondChildId = 'second-child';
    const expectedFirstText = 'Primer hijo';
    const expectedSecondText = 'Segundo hijo';

    // Act
    const {getByTestId} = render(
      <ReduxProvider>
        <Text testID={firstChildId}>{expectedFirstText}</Text>
        <Text testID={secondChildId}>{expectedSecondText}</Text>
      </ReduxProvider>,
    );

    // Assert
    expect(getByTestId(firstChildId)).toHaveTextContent(expectedFirstText);
    expect(getByTestId(secondChildId)).toHaveTextContent(expectedSecondText);
  });

  it('debería renderizar correctamente cuando no tiene hijos', () => {
    // Arrange
    // No se requiere configuración adicional

    // Act
    const renderResult = render(<ReduxProvider />);

    // Assert
    // Verificamos que el resultado del renderizado exista
    expect(renderResult).toBeDefined();
    // Alternativa: verificar que el Provider fue llamado correctamente
    expect(Provider).toHaveBeenCalled();
  });

  it('debería utilizar el Provider de redux con el store correcto', () => {
    // Arrange
    const expectedStore = store;
    const testChild = <Text>Hijo de prueba</Text>;

    // Act
    render(<ReduxProvider>{testChild}</ReduxProvider>);

    // Assert
    expect(Provider).toHaveBeenCalled();
    expect(Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        store: expectedStore,
        children: testChild,
      }),
      expect.any(Object),
    );
  });

  it('debería pasar propiedades al Provider de redux correctamente', () => {
    // Arrange
    const mockProviderImplementation = Provider as jest.Mock;
    const testChildren = <Text>Contenido</Text>;

    // Act
    render(<ReduxProvider>{testChildren}</ReduxProvider>);

    // Assert
    const providerProps = mockProviderImplementation.mock.calls[0][0];
    expect(providerProps).toHaveProperty('store', store);
    expect(providerProps).toHaveProperty('children', testChildren);
  });

  it('debería mantener la referencia al store original sin modificarlo', () => {
    // Arrange
    const originalStore = store;
    const expectedStore = originalStore;

    // Act
    render(
      <ReduxProvider>
        <Text>Contenido de prueba</Text>
      </ReduxProvider>,
    );

    // Assert
    const providerProps = (Provider as jest.Mock).mock.calls[0][0];
    expect(providerProps.store).toBe(expectedStore);
    // Verificamos que la referencia al store no ha cambiado
    expect(providerProps.store).toBe(originalStore);
  });
});
