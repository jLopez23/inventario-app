import React from 'react';
import {render} from '@testing-library/react-native';
import {View, ActivityIndicator} from 'react-native';
import {LoadingError} from './LoadingError';

// Mock para los estilos del tema
jest.mock('../../theme/theme', () => ({
  styles: {
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
  },
}));

describe('LoadingError Component', () => {
  it('debería renderizarse correctamente sin carga ni error', () => {
    // Arrange
    const loading = false;
    const error = '';

    // Act
    const {toJSON} = render(<LoadingError loading={loading} error={error} />);

    // Assert
    expect(toJSON()).toBeTruthy();
  });

  it('debería mostrar el indicador de carga cuando loading es true', () => {
    // Arrange
    const loading = true;
    const error = '';
    const expectedColor = '#0000ff'; // Color azul definido en el componente

    // Act
    const {UNSAFE_getAllByType} = render(
      <LoadingError loading={loading} error={error} />,
    );
    const activityIndicators = UNSAFE_getAllByType(ActivityIndicator);

    // Assert
    expect(activityIndicators.length).toBeGreaterThan(0);
    expect(activityIndicators[0].props.size).toBe('large');
    expect(activityIndicators[0].props.color).toBe(expectedColor);
  });

  it('debería mostrar el mensaje de error cuando se proporciona', () => {
    // Arrange
    const loading = false;
    const errorMessage = 'Este es un mensaje de error';
    const expectedColor = 'red';

    // Act
    const {UNSAFE_getAllByType, toJSON} = render(
      <LoadingError loading={loading} error={errorMessage} />,
    );
    
    // Assert
    // Analizamos el JSON del componente para verificar la estructura
    const tree = toJSON();
    
    // Verificamos que la estructura general es correcta
    expect(tree.type).toBe('View');
    expect(tree.children).toBeTruthy();
    
    // En lugar de acceder a posiciones específicas, buscamos a través de propiedades
    // Buscar cualquier elemento dentro del árbol que tenga el color rojo y el mensaje de error
    const hasErrorTextWithRedColor = JSON.stringify(tree).includes(errorMessage) && 
                                     JSON.stringify(tree).includes(expectedColor);
    
    expect(hasErrorTextWithRedColor).toBe(true);
  });

  it('debería mostrar tanto el indicador de carga como el error cuando ambos están presentes', () => {
    // Arrange
    const loading = true;
    const errorMessage = 'Error mientras carga';

    // Act
    const {UNSAFE_getAllByType, toJSON} = render(
      <LoadingError loading={loading} error={errorMessage} />,
    );

    // Assert
    // Verificar que hay un ActivityIndicator
    const activityIndicators = UNSAFE_getAllByType(ActivityIndicator);
    expect(activityIndicators.length).toBeGreaterThan(0);
    
    // Verificar que el error está presente en el árbol de componentes
    const tree = toJSON();
    
    // Buscar el mensaje de error en cualquier parte del árbol
    const treeString = JSON.stringify(tree);
    expect(treeString.includes(errorMessage)).toBe(true);
    expect(treeString.includes('red')).toBe(true);
  });

  it('debería aplicar los estilos de row del tema', () => {
    // Arrange
    const {styles} = require('../../theme/theme');
    const expectedRowStyle = styles.row;

    // Act
    const {UNSAFE_getByType} = render(
      <LoadingError loading={false} error="" />,
    );
    const viewElement = UNSAFE_getByType(View);

    // Assert
    expect(viewElement.props.style).toEqual(expectedRowStyle);
  });

  it('debería manejar correctamente valores de error nulo', () => {
    // Arrange
    const loading = false;
    const error = null;

    // Act
    const {toJSON} = render(
      <LoadingError loading={loading} error={error} />,
    );

    // Assert
    // Verificar que no se renderiza ningún texto de error
    const treeString = JSON.stringify(toJSON());
    
    // No debería contener texto con estilo de color rojo
    expect(treeString.includes('"color":"red"')).toBe(false);
  });
});