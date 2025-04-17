import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Image} from 'react-native';
import BackButton from './BackButton';

// Mock del módulo react-native-status-bar-height
jest.mock('react-native-status-bar-height', () => ({
  getStatusBarHeight: jest.fn(() => 20), // Valor fijo para pruebas
}));

// Mock de la imagen
jest.mock('../../../assets/arrow_back.png', () => 'mocked-image');

describe('BackButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizarse correctamente', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const testId = 'back-button';

    // Act
    const {getByTestId} = render(
      <BackButton goBack={mockGoBack} testID={testId} />,
    );

    // Assert
    expect(getByTestId(testId)).toBeTruthy();
  });

  it('debería llamar a la función goBack cuando se presiona', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const expectedCallCount = 1;
    const testId = 'back-button';

    // Act
    const {getByTestId} = render(
      <BackButton goBack={mockGoBack} testID={testId} />,
    );
    const button = getByTestId(testId);
    fireEvent.press(button);

    // Assert
    expect(mockGoBack).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería renderizar la imagen correcta con los estilos adecuados', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const expectedImageSource = 'mocked-image';
    const expectedImageStyle = {width: 24, height: 24};

    // Act
    const {UNSAFE_getByType} = render(<BackButton goBack={mockGoBack} />);
    const image = UNSAFE_getByType(Image);

    // Assert
    expect(image.props.source).toBe(expectedImageSource);
    expect(image.props.style).toEqual(
      expect.objectContaining(expectedImageStyle),
    );
  });

  it('debería aplicar los estilos correctos al contenedor', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const mockStatusBarHeight = 20; // Mismo valor que el mock global
    const expectedTopPosition = 10 + mockStatusBarHeight;
    const expectedLeftPosition = 4;
    const expectedPosition = 'absolute';
    const testId = 'back-button';

    // Act
    const {getByTestId} = render(
      <BackButton goBack={mockGoBack} testID={testId} />,
    );
    const button = getByTestId(testId);

    // Assert
    expect(button.props.style).toEqual(
      expect.objectContaining({
        position: expectedPosition,
        top: expectedTopPosition,
        left: expectedLeftPosition,
      }),
    );
  });

  it('no debería llamar a goBack sin interacción del usuario', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const expectedCallCount = 0;

    // Act
    render(<BackButton goBack={mockGoBack} />);

    // Assert
    expect(mockGoBack).toHaveBeenCalledTimes(expectedCallCount);
  });

  it('debería manejar múltiples clics correctamente', () => {
    // Arrange
    const mockGoBack = jest.fn();
    const expectedCallCount = 3;
    const testId = 'back-button';

    // Act
    const {getByTestId} = render(
      <BackButton goBack={mockGoBack} testID={testId} />,
    );
    const button = getByTestId(testId);

    // Simular múltiples clics
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    // Assert
    expect(mockGoBack).toHaveBeenCalledTimes(expectedCallCount);
  });

  // Caso borde: función goBack indefinida
  it('debería manejar graciosamente si la función goBack es undefined', () => {
    // Arrange
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testId = 'back-button';

    // Act & Assert
    const {getByTestId} = render(<BackButton testID={testId} />);
    const button = getByTestId(testId);

    // No debería lanzar excepción, sino simplemente no hacer nada
    expect(() => {
      fireEvent.press(button);
    }).not.toThrow();

    // Limpiamos el spy
    consoleErrorSpy.mockRestore();
  });
});
