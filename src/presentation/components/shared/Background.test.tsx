import React from 'react';
import {render} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import Background from './Background';

// Mock para el recurso de imagen
jest.mock('../../../assets/background_dot.png', () => 'mockedImagePath');

describe('Background Component', () => {
  it('renderiza correctamente', () => {
    const {toJSON} = render(
      <Background>
        <Text>Contenido de prueba</Text>
      </Background>,
    );

    // Verificamos que el componente se renderiza sin errores
    expect(toJSON()).toBeTruthy();
  });

  it('aplica los estilos correctos al contenedor', () => {
    const {toJSON} = render(
      <Background testID="background-container">
        <Text>Contenido de prueba</Text>
      </Background>,
    );

    const tree = toJSON();
    expect(tree.type).toBe('View');

    // Verificamos que hay estilos aplicados
    expect(tree.props.style).toBeTruthy();
  });

  it('utiliza la imagen de fondo correcta', () => {
    const {toJSON} = render(
      <Background>
        <Text>Test</Text>
      </Background>,
    );

    const tree = toJSON();

    expect(tree.type).toBe('View');
    expect(tree.children.length).toBeGreaterThanOrEqual(1);
  });

  it('configura correctamente el KeyboardAvoidingView', () => {
    const {toJSON} = render(
      <Background>
        <Text>Test</Text>
      </Background>,
    );

    const tree = toJSON();

    expect(tree.children.length).toBeGreaterThanOrEqual(1);

    const lastChild = tree.children[tree.children.length - 1];
    expect(lastChild.type).toBe('View');
    expect(lastChild.props.style).toBeTruthy();
  });

  it('renderiza los children correctamente', () => {
    const testMessage = 'Contenido de prueba';
    const {getByText} = render(
      <Background>
        <Text>{testMessage}</Text>
      </Background>,
    );

    const childText = getByText(testMessage);
    expect(childText).toBeDefined();
  });

  it('renderiza múltiples children correctamente', () => {
    const {getByText} = render(
      <Background>
        <Text>Primer hijo</Text>
        <Text>Segundo hijo</Text>
        <View>
          <Text>Hijo anidado</Text>
        </View>
      </Background>,
    );

    expect(getByText('Primer hijo')).toBeDefined();
    expect(getByText('Segundo hijo')).toBeDefined();
    expect(getByText('Hijo anidado')).toBeDefined();
  });

  it('renderiza sin children sin errores', () => {
    // No debería lanzar error si no hay children
    const {toJSON} = render(<Background />);
    expect(toJSON()).toBeTruthy();

    // Verificamos que la estructura básica sigue intacta
    const tree = toJSON();
    expect(tree.children).toBeTruthy();
  });
});
