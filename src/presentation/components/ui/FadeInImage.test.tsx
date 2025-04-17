import React from 'react';
import {render, act} from '@testing-library/react-native';
import {FadeInImage} from './FadeInImage';
import {useAnimation} from '../../hooks/useAnimation';

// Mock para los hooks utilizados
jest.mock('../../hooks/useAnimation', () => ({
  useAnimation: jest.fn(),
}));

// Mock para react-native
jest.mock('react-native', () => {
  return {
    // Solo mockear los componentes que realmente necesitamos
    Animated: {
      Image: jest.fn(({source, onLoadEnd, style}) => (
        <img
          src={source.uri}
          onLoadEnd={onLoadEnd}
          style={style}
          data-testid="animated-image"
        />
      )),
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
      })),
    },
    ActivityIndicator: jest.fn(({style, color, size}) => (
      <div
        style={style}
        data-color={color}
        data-size={size}
        data-testid="activity-indicator"
      />
    )),
    View: jest.fn(({style, children}) => (
      <div style={style} data-testid="view-container">
        {children}
      </div>
    )),
    StyleSheet: {
      create: jest.fn(styles => styles),
    },
    // Necesarios para evitar errores
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios || obj.default),
    },
  };
});

describe('FadeInImage Component', () => {
  const mockFadeIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración predeterminada del mock useAnimation
    (useAnimation as jest.Mock).mockReturnValue({
      animatedOpacity: 0.5,
      fadeIn: mockFadeIn,
    });
  });

  it('debería renderizarse correctamente con la URI proporcionada', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';

    // Act
    const {UNSAFE_getAllByType} = render(<FadeInImage uri={testUri} />);

    // Assert
    const images = UNSAFE_getAllByType('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0].props.src).toBe(testUri);
  });

  it('debería mostrar un indicador de carga mientras la imagen está cargando', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';

    // Act
    const {UNSAFE_getAllByType} = render(<FadeInImage uri={testUri} />);

    // Assert
    // Buscar el ActivityIndicator directamente usando el tipo 'div' y data-testid
    const activityIndicators = UNSAFE_getAllByType('div').filter(
      element => element.props['data-testid'] === 'activity-indicator',
    );

    expect(activityIndicators.length).toBeGreaterThan(0);
    // Verificar solo la propiedad position del estilo, ya que es la única que nos interesa
    expect(activityIndicators[0].props.style).toHaveProperty(
      'position',
      'absolute',
    );
    expect(activityIndicators[0].props['data-color']).toBe('grey');
    expect(activityIndicators[0].props['data-size']).toBe(30);
  });

  it('debería llamar a fadeIn cuando la imagen termina de cargar', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';

    // Act
    const {UNSAFE_getAllByType} = render(<FadeInImage uri={testUri} />);

    // Simular que la imagen ha terminado de cargar
    const image = UNSAFE_getAllByType('img')[0];
    act(() => {
      image.props.onLoadEnd();
    });

    // Assert
    expect(mockFadeIn).toHaveBeenCalledTimes(1);
  });

  it('debería aplicar los estilos personalizados cuando se proporcionan', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';
    const customStyle = {width: 200, height: 200, borderRadius: 10};
    const expectedStyle = [customStyle, {opacity: 0.5, resizeMode: 'contain'}];

    // Act
    const {UNSAFE_getAllByType} = render(
      <FadeInImage uri={testUri} style={customStyle} />,
    );

    // Assert
    const image = UNSAFE_getAllByType('img')[0];
    expect(image.props.style).toEqual(expectedStyle);
  });

  it('debería aplicar estilos predeterminados de opacidad y resizeMode a la imagen', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';
    const expectedStyleProps = {opacity: 0.5, resizeMode: 'contain'};

    // Act
    const {UNSAFE_getAllByType} = render(<FadeInImage uri={testUri} />);

    // Assert
    const image = UNSAFE_getAllByType('img')[0];
    const imageStyle = image.props.style[1];

    expect(imageStyle).toEqual(expectedStyleProps);
  });

  it('debería prevenir cambios de estado después de desmontarse (evitar memory leaks)', () => {
    // Arrange
    const testUri = 'https://ejemplo.com/imagen.jpg';
    // Crear una referencia al manejador onLoadEnd antes de desmontar
    let onLoadEndHandler;

    // Act
    const {UNSAFE_getAllByType, unmount} = render(
      <FadeInImage uri={testUri} />,
    );

    // Guardar una referencia a onLoadEnd antes de desmontar
    const image = UNSAFE_getAllByType('img')[0];
    onLoadEndHandler = image.props.onLoadEnd;

    // Primero desmontamos el componente
    unmount();

    // Reseteamos el mock para asegurarnos que no ha sido llamado antes
    mockFadeIn.mockClear();

    // Luego llamamos directamente al handler guardado
    act(() => {
      // Si isDisposed.current es true, fadeIn no debería ser llamado
      onLoadEndHandler();
    });

    // Assert
    // Como el componente está desmontado y usamos isDisposed.current,
    // fadeIn no debería ser llamado
    expect(mockFadeIn).not.toHaveBeenCalled();
  });
});
