import React from 'react';
import {render} from '@testing-library/react-native';
import {FullScreenLoader} from './FullScreenLoader';

// Mock para @ui-kitten/components
jest.mock('@ui-kitten/components', () => {
  const mockLayout = jest.fn(({style, children}) => (
    <div style={style} data-testid="layout-container">
      {children}
    </div>
  ));

  const mockSpinner = jest.fn(({size}) => (
    <span data-testid={`spinner-${size}`} data-size={size} />
  ));

  return {
    Layout: mockLayout,
    Spinner: mockSpinner,
  };
});

describe('FullScreenLoader Component', () => {
  it('debería renderizarse correctamente con un spinner', () => {
    // Arrange
    const expectedSpinnerSize = 'giant';

    // Act
    const {UNSAFE_getAllByType} = render(<FullScreenLoader />);

    // Assert
    const spinners = UNSAFE_getAllByType('span');
    expect(spinners.length).toBeGreaterThan(0);
    expect(spinners[0].props['data-size']).toBe(expectedSpinnerSize);
  });

  it('debería aplicar los estilos correctos al contenedor Layout', () => {
    // Arrange
    const expectedContainerStyles = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };

    // Act
    const {UNSAFE_getByType} = render(<FullScreenLoader />);

    // Assert
    const layoutContainer = UNSAFE_getByType('div');
    expect(layoutContainer).toBeTruthy();

    // Verificar que se aplican todos los estilos esperados
    Object.entries(expectedContainerStyles).forEach(([key, value]) => {
      expect(layoutContainer.props.style[key]).toEqual(value);
    });
  });

  it('debería renderizar un Layout que ocupe toda la pantalla', () => {
    // Arrange
    const expectedFlexValue = 1;

    // Act
    const {UNSAFE_getByType} = render(<FullScreenLoader />);

    // Assert
    const layoutContainer = UNSAFE_getByType('div');
    expect(layoutContainer.props.style.flex).toBe(expectedFlexValue);
  });

  it('debería centrar el Spinner tanto horizontal como verticalmente', () => {
    // Arrange
    const expectedJustifyContent = 'center';
    const expectedAlignItems = 'center';

    // Act
    const {UNSAFE_getByType} = render(<FullScreenLoader />);

    // Assert
    const layoutContainer = UNSAFE_getByType('div');
    expect(layoutContainer.props.style.justifyContent).toBe(
      expectedJustifyContent,
    );
    expect(layoutContainer.props.style.alignItems).toBe(expectedAlignItems);
  });

  it('debería renderizar un Spinner de tamaño giant', () => {
    // Arrange
    const expectedSpinnerSize = 'giant';

    // Act
    const {UNSAFE_getAllByType} = render(<FullScreenLoader />);

    // Assert
    const spinner = UNSAFE_getAllByType('span')[0];
    expect(spinner.props['data-size']).toBe(expectedSpinnerSize);
  });
});
