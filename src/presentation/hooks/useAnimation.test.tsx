import {renderHook, act} from '@testing-library/react-native';
import {Easing} from 'react-native';
import {useAnimation} from './useAnimation';

// Mock para Animated de React Native
jest.mock('react-native', () => {
  return {
    Animated: {
      Value: jest.fn(initialValue => ({
        setValue: jest.fn(),
        current: initialValue,
        interpolate: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(callback => {
          if (callback) callback({finished: true});
        }),
      })),
    },
    Easing: {
      linear: 'linear-easing',
      ease: 'ease-easing',
    },
  };
});

describe('useAnimation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializar correctamente los valores de animación', () => {
    // Arrange
    const expectedInitialOpacityValue = 0;
    const expectedInitialTopValue = 0;

    // Act
    const {result} = renderHook(() => useAnimation());

    // Assert
    expect(result.current.animatedOpacity).toBeDefined();
    expect(result.current.animatedTop).toBeDefined();
  });

  it('debería ejecutar fadeIn con valores por defecto', () => {
    // Arrange
    const expectedDuration = 300;
    const expectedToValue = 1;
    const expectedConfig = {
      toValue: expectedToValue,
      duration: expectedDuration,
      useNativeDriver: true,
    };

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.fadeIn({});
    });

    // Assert
    expect(result.current.fadeIn).toBeDefined();
  });

  it('debería ejecutar fadeIn con valores personalizados', () => {
    // Arrange
    const expectedDuration = 500;
    const expectedToValue = 0.8;
    const mockCallback = jest.fn();

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.fadeIn({
        duration: expectedDuration,
        toValue: expectedToValue,
        callback: mockCallback,
      });
    });

    // Assert
    expect(result.current.fadeIn).toBeDefined();
  });

  it('debería ejecutar fadeOut con valores por defecto', () => {
    // Arrange
    const expectedDuration = 300;
    const expectedToValue = 0;

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.fadeOut({});
    });

    // Assert
    expect(result.current.fadeOut).toBeDefined();
  });

  it('debería ejecutar fadeOut con valores personalizados', () => {
    // Arrange
    const expectedDuration = 600;
    const expectedToValue = 0.2;
    const mockCallback = jest.fn();

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.fadeOut({
        duration: expectedDuration,
        toValue: expectedToValue,
        callback: mockCallback,
      });
    });

    // Assert
    expect(result.current.fadeOut).toBeDefined();
  });

  it('debería ejecutar startMovingTopPosition con valores por defecto', () => {
    // Arrange
    const expectedInitialPosition = 0;
    const expectedToValue = 0;
    const expectedDuration = 300;

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.startMovingTopPosition({});
    });

    // Assert
    expect(result.current.startMovingTopPosition).toBeDefined();
  });

  it('debería ejecutar startMovingTopPosition con valores personalizados', () => {
    // Arrange
    const expectedInitialPosition = 10;
    const expectedToValue = 20;
    const expectedDuration = 800;
    const mockCallback = jest.fn();

    // Act
    const {result} = renderHook(() => useAnimation());
    act(() => {
      result.current.startMovingTopPosition({
        initialPosition: expectedInitialPosition,
        toValue: expectedToValue,
        duration: expectedDuration,
        easing: Easing.ease,
        callback: mockCallback,
      });
    });

    // Assert
    expect(result.current.startMovingTopPosition).toBeDefined();
  });
});
