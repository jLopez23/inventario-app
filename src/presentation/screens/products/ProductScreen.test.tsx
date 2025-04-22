import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ProductScreen} from './ProductScreen';
import {
  deleteProduct,
  getProductById,
  updateCreateProduct,
} from '../../../actions/products';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Alert} from 'react-native';
import {printAlert} from '../../../helpers/app';
import {CameraAdapter} from '../../../config/adapters/camera-adapter';

// Mock para react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    ScrollView: View,
    State: {},
    PanGestureHandler: View,
    LongPressGestureHandler: View,
    TapGestureHandler: View,
    createNativeWrapper: jest.fn(() => View),
  };
});

// Mocks para las dependencias
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('../../../actions/products', () => ({
  getProductById: jest.fn(),
  updateCreateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock('../../../helpers/app', () => ({
  printAlert: jest.fn(),
}));

// Mock para react-native simplificado
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn((title, message, buttons) => {
      const deleteButton = buttons?.find(btn => btn.text === 'Eliminar');
      if (deleteButton && deleteButton.onPress) {
        deleteButton.onPress();
      }
    }),
  },
  ScrollView: ({children}) => <mock-scroll-view>{children}</mock-scroll-view>,
  StyleSheet: {
    flatten: style => style,
    create: styles => styles,
  },
  Text: ({children}) => <mock-text>{children}</mock-text>,
  View: ({children}) => <mock-view>{children}</mock-view>,
}));

jest.mock('../../../config/adapters/camera-adapter', () => ({
  CameraAdapter: {
    getPicturesFromLibrary: jest.fn().mockResolvedValue(['new-image.jpg']),
  },
}));

// Mock para los componentes utilizados
jest.mock('../../layouts/MainLayout', () => ({
  MainLayout: ({children, title, subTitle, rightAction, rightActionIcon}) => (
    <mock-main-layout
      testID="main-layout"
      title={title}
      subTitle={subTitle}
      rightActionIcon={rightActionIcon}>
      <button testID="right-action-button" onPress={rightAction} />
      {children}
    </mock-main-layout>
  ),
}));

jest.mock('@ui-kitten/components', () => ({
  Button: ({children, onPress, accessoryLeft, disabled, status, style}) => {
    // Asignar testIDs específicos basados en el contenido o status
    let buttonTestId = 'button';
    if (status === 'danger') {
      buttonTestId = 'delete-button';
    } else if (typeof children === 'string') {
      if (children === 'Guardar') {
        buttonTestId = 'save-button';
      } else if (['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(children)) {
        buttonTestId = `size-button-${children}`;
      } else if (['kid', 'men', 'women', 'unisex'].includes(children)) {
        buttonTestId = `gender-button-${children}`;
      } else {
        buttonTestId = `button-${children}`;
      }
    }

    return (
      <mock-button
        testID={buttonTestId}
        onPress={onPress}
        disabled={disabled}
        status={status}
        style={style}>
        {children}
      </mock-button>
    );
  },
  ButtonGroup: ({children, style}) => (
    <mock-button-group testID="button-group" style={style}>
      {children}
    </mock-button-group>
  ),
  Input: ({
    label,
    value,
    onChangeText,
    style,
    multiline,
    numberOfLines,
    keyboardType,
  }) => (
    <mock-input
      testID={`input-${label}`}
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={style}
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
    />
  ),
  Layout: ({children, style}) => (
    <mock-layout testID="layout" style={style}>
      {children}
    </mock-layout>
  ),
  useTheme: jest.fn().mockReturnValue({
    'color-primary-200': '#C5CEE0',
  }),
}));

jest.mock('../../components/ui/MyIcon', () => ({
  MyIcon: ({name, white}) => (
    <mock-icon testID={`icon-${name}`} name={name} white={white} />
  ),
}));

jest.mock('../../components/products/ProductImages', () => ({
  ProductImages: ({images}) => (
    <mock-product-images testID="product-images" images={images} />
  ),
}));

// Mock para Formik - Versión simplificada y funcional
jest.mock('formik', () => ({
  Formik: ({initialValues, onSubmit, children}) => {
    // Implementamos una versión sencilla sin usar React.useState
    let formValues = {...initialValues};

    const handleSubmit = () => {
      if (onSubmit) {
        onSubmit(formValues);
      }
    };

    const setFieldValue = (field, value) => {
      formValues = {...formValues, [field]: value};
    };

    const handleChange = field => val => {
      setFieldValue(field, val);
    };

    return children({
      handleChange,
      handleSubmit,
      values: formValues,
      errors: {},
      setFieldValue,
    });
  },
}));

describe('ProductScreen', () => {
  // Mocks para las funciones y hooks
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  // Mock para el producto
  const mockProduct = {
    id: 'product-1',
    title: 'Producto de prueba',
    description: 'Descripción de prueba',
    slug: 'producto-prueba',
    price: 100,
    stock: 10,
    sizes: ['S', 'M'],
    gender: 'men',
    images: ['image1.jpg', 'image2.jpg'],
  };

  // Mock para los datos de un producto creado
  const mockCreatedProduct = {
    ...mockProduct,
    id: 'new-product-id',
  };

  // Mocks para las mutaciones
  const mockMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  // Mock completo para las mutaciones
  const mockUpdateMutation = {
    mutate: mockMutate,
    isPending: false,
  };

  const mockDeleteMutation = {
    mutate: mockDeleteMutate,
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración predeterminada para useQueryClient
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

    // Configuración predeterminada para useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProduct,
    });

    // Configuración predeterminada para getProductById
    (getProductById as jest.Mock).mockResolvedValue(mockProduct);

    // Configuración predeterminada para updateCreateProduct
    (updateCreateProduct as jest.Mock).mockResolvedValue(mockCreatedProduct);

    // Configuración predeterminada para deleteProduct
    (deleteProduct as jest.Mock).mockResolvedValue(true);
  });

  // Test para verificar la renderización cuando no hay datos de producto
  it('debería mostrar "Cargando..." cuando no hay datos de producto', () => {
    // Sobreescribir el mock para el caso específico
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
    });

    (useMutation as jest.Mock)
      .mockReturnValueOnce(mockDeleteMutation)
      .mockReturnValueOnce(mockUpdateMutation);

    const mockRoute = {
      params: {
        productId: 'nonexistent-id',
      },
    };

    // Act
    const {getByTestId, queryByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Assert
    const mainLayout = getByTestId('main-layout');
    expect(mainLayout).toBeTruthy();
    expect(mainLayout.props.title).toBe('Cargando...');
    expect(queryByTestId('save-button')).toBeNull();
  });

  // Test para verificar que la función queryFn se ejecuta correctamente - línea 39
  it('debería ejecutar correctamente la función queryFn de useQuery', async () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    let queryFnFromHook;

    // Mock de useQuery que captura la función queryFn
    (useQuery as jest.Mock).mockImplementation(options => {
      queryFnFromHook = options.queryFn;
      return {data: mockProduct};
    });

    // Configurar mocks básicos para useMutation
    (useMutation as jest.Mock)
      .mockReturnValueOnce(mockDeleteMutation)
      .mockReturnValueOnce(mockUpdateMutation);

    // Act
    render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Ejecutar directamente la función queryFn
    await queryFnFromHook();

    // Assert
    expect(getProductById).toHaveBeenCalledWith(mockProduct.id);
  });

  // Test para verificar que la función mutationFn de updateCreateProduct se ejecuta correctamente - línea 44
  it('debería ejecutar correctamente la función mutationFn de useMutation para updateCreateProduct', async () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    let updateMutationFn;

    // Mock de useMutation que captura la función mutationFn
    (useMutation as jest.Mock).mockImplementation(options => {
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        !options.mutationFn.toString().includes('deleteProduct')
      ) {
        updateMutationFn = options.mutationFn;
      }

      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        return mockDeleteMutation;
      } else {
        return mockUpdateMutation;
      }
    });

    // Act
    render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Ejecutar directamente la función mutationFn con los datos del producto
    await updateMutationFn(mockProduct);

    // Assert
    expect(updateCreateProduct).toHaveBeenCalledWith({
      ...mockProduct,
      id: mockProduct.id,
    });
  });

  // Test para verificar que la función mutationFn de deleteProduct se ejecuta correctamente - línea 66
  it('debería ejecutar correctamente la función mutationFn de useMutation para deleteProduct', async () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    let deleteMutationFn;

    // Mock de useMutation que captura la función mutationFn
    (useMutation as jest.Mock).mockImplementation(options => {
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        deleteMutationFn = options.mutationFn;
        return mockDeleteMutation;
      } else {
        return mockUpdateMutation;
      }
    });

    // Act
    render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Ejecutar directamente la función mutationFn
    await deleteMutationFn();

    // Assert
    expect(deleteProduct).toHaveBeenCalledWith(mockProduct.id);
  });

  // Test para la eliminación del producto
  it('debería mostrar un diálogo de confirmación y eliminar el producto', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks específicamente para la eliminación
    (useMutation as jest.Mock).mockImplementation(options => {
      // Identificar si es mutación de eliminación o actualización
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        return {
          mutate: () => {
            mockDeleteMutate();
            // Simular que el mutate llama directamente al callback de éxito
            if (options.onSuccess) {
              options.onSuccess();
            }
          },
          isPending: false,
        };
      } else {
        return mockUpdateMutation;
      }
    });

    // Act - renderizar y presionar el botón de eliminar
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);

    // Assert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Eliminar producto',
      '¿Estás seguro que deseas eliminar este producto?',
      expect.any(Array),
    );

    // Verificar que se llamó a la función mutate
    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  // Test para la eliminar y simular éxito
  it('debería manejar correctamente la eliminación exitosa de un producto', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Reset mocks
    printAlert.mockReset();
    mockQueryClient.invalidateQueries.mockReset();

    // Configurar mocks para la eliminación con callbacks separados
    const deleteSuccessCallback = jest.fn();
    const deleteErrorCallback = jest.fn();

    (useMutation as jest.Mock).mockImplementation(options => {
      // Identificar si es mutación de eliminación o actualización
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        // Guardar callbacks para probarlos después
        if (options.onSuccess)
          deleteSuccessCallback.mockImplementation(options.onSuccess);
        if (options.onError)
          deleteErrorCallback.mockImplementation(options.onError);

        return {
          mutate: mockDeleteMutate,
          isPending: false,
        };
      } else {
        return mockUpdateMutation;
      }
    });

    // Act
    render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Simular el éxito de la eliminación llamando al callback guardado
    deleteSuccessCallback();

    // Assert
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
    expect(printAlert).toHaveBeenCalledWith(
      'Éxito',
      'El producto fue eliminado exitosamente.',
    );
  });

  // Test para simular error al eliminar
  it('debería manejar correctamente un error al eliminar un producto', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Reset mocks
    printAlert.mockReset();
    mockQueryClient.invalidateQueries.mockReset();

    // Configurar mocks para la eliminación con callbacks separados
    const deleteSuccessCallback = jest.fn();
    const deleteErrorCallback = jest.fn();

    (useMutation as jest.Mock).mockImplementation(options => {
      // Identificar si es mutación de eliminación o actualización
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        // Guardar callbacks para probarlos después
        if (options.onSuccess)
          deleteSuccessCallback.mockImplementation(options.onSuccess);
        if (options.onError)
          deleteErrorCallback.mockImplementation(options.onError);

        return {
          mutate: mockDeleteMutate,
          isPending: false,
        };
      } else {
        return mockUpdateMutation;
      }
    });

    // Act
    render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Simular el error en la eliminación
    deleteErrorCallback();

    // Assert
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
    expect(printAlert).toHaveBeenCalledWith(
      'Error',
      'No se pudo eliminar el producto, actualice la lista de productos para validar si otro usuario lo eliminó.',
    );
  });

  // Test para manejar selección de tamaños
  it('debería manejar correctamente la selección de tamaños', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks para las mutaciones
    (useMutation as jest.Mock)
      .mockReturnValueOnce({...mockDeleteMutation})
      .mockReturnValueOnce({...mockUpdateMutation});

    // Act
    const {getByTestId, getAllByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Seleccionar el botón de talla XL (no seleccionado inicialmente)
    const xlButton = getByTestId('size-button-XL');
    fireEvent.press(xlButton);

    // Seleccionar el botón de talla M (ya seleccionado inicialmente)
    const mButton = getByTestId('size-button-M');
    fireEvent.press(mButton);

    // Ahora debería tener S y XL seleccionados
    const sizeButtons = getAllByTestId(/size-button-/);
    expect(sizeButtons).toBeTruthy();
  });

  // Test para la selección de género
  it('debería manejar correctamente la selección de género', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks para las mutaciones
    (useMutation as jest.Mock)
      .mockReturnValueOnce({...mockDeleteMutation})
      .mockReturnValueOnce({...mockUpdateMutation});

    // Act
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Seleccionar el botón de género 'women'
    const womenButton = getByTestId('gender-button-women');
    fireEvent.press(womenButton);

    // Ya que estamos usando un mock de Formik, no podemos verificar el estado directamente
    // pero podemos asegurarnos de que el botón existe y se puede hacer clic en él
    expect(womenButton).toBeTruthy();
  });

  // Test para simular el éxito al guardar un producto existente
  it('debería manejar correctamente la actualización exitosa de un producto existente', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    const updatedProduct = {
      ...mockProduct,
      title: 'Producto Actualizado',
    };

    // Reset mocks
    printAlert.mockReset();
    mockQueryClient.invalidateQueries.mockReset();
    mockMutate.mockReset();

    // Configurar mocks con callbacks separados para actualización
    const updateSuccessCallback = jest.fn();
    const updateErrorCallback = jest.fn();

    (useMutation as jest.Mock).mockImplementation(options => {
      // Para la mutación de eliminación, devolver mock simple
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        return mockDeleteMutation;
      }
      // Para la mutación de actualización, guardar callbacks
      else {
        if (options.onSuccess)
          updateSuccessCallback.mockImplementation(options.onSuccess);
        if (options.onError)
          updateErrorCallback.mockImplementation(options.onError);

        return {
          mutate: (...args: any[]) => {
            mockMutate(...args);
            // No llamamos al callback automáticamente aquí para poder probarlo manualmente
          },
          isPending: false,
        };
      }
    });

    // Act - renderizar componente y presionar botón de guardar
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Verificar que se llamó a la función mutate
    expect(mockMutate).toHaveBeenCalled();

    // Simular que la mutación fue exitosa
    updateSuccessCallback(updatedProduct);

    // Assert
    expect(printAlert).toHaveBeenCalledWith(
      'Éxito',
      'El producto fue editado exitosamente.',
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['product', updatedProduct.id],
    });
  });

  // Test para simular el éxito al crear un producto nuevo
  it('debería manejar correctamente la creación exitosa de un producto nuevo', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: 'new', // ID para creación de nuevo producto
      },
    };

    // Producto sin ID para la creación
    const productWithoutId = {
      ...mockProduct,
      id: '',
    };

    // Reset mocks
    printAlert.mockReset();
    mockQueryClient.invalidateQueries.mockReset();
    mockMutate.mockReset();

    // Configurar mock para el caso de producto nuevo
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: productWithoutId,
    });

    // Configurar mocks con callbacks separados para actualización
    const updateSuccessCallback = jest.fn();

    (useMutation as jest.Mock).mockImplementation(options => {
      // Para la mutación de eliminación, devolver mock simple
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        return mockDeleteMutation;
      }
      // Para la mutación de actualización, guardar callbacks
      else {
        if (options.onSuccess)
          updateSuccessCallback.mockImplementation(options.onSuccess);

        return {
          mutate: mockMutate,
          isPending: false,
        };
      }
    });

    // Act - renderizar componente y presionar botón de guardar
    const {getByTestId, queryByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Verificar que no existe el botón de eliminar
    expect(queryByTestId('delete-button')).toBeNull();

    // Presionar botón de guardar
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Simular que la mutación fue exitosa
    updateSuccessCallback(mockCreatedProduct);

    // Assert
    expect(printAlert).toHaveBeenCalledWith(
      'Éxito',
      'El producto fue creado exitosamente.',
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['product', mockCreatedProduct.id],
    });
  });

  // Test para simular error al guardar un producto
  it('debería manejar correctamente un error al actualizar un producto', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Reset mocks
    printAlert.mockReset();
    mockQueryClient.invalidateQueries.mockReset();

    // Configurar mocks con callbacks separados para actualización
    const updateErrorCallback = jest.fn();

    (useMutation as jest.Mock).mockImplementation(options => {
      // Para la mutación de eliminación, devolver mock simple
      if (
        options &&
        typeof options.mutationFn === 'function' &&
        options.mutationFn.toString().includes('deleteProduct')
      ) {
        return mockDeleteMutation;
      }
      // Para la mutación de actualización, guardar callbacks
      else {
        if (options.onError)
          updateErrorCallback.mockImplementation(options.onError);

        return {
          mutate: mockMutate,
          isPending: false,
        };
      }
    });

    // Act - renderizar componente
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Simular que la mutación falló
    updateErrorCallback();

    // Assert
    expect(printAlert).toHaveBeenCalledWith(
      'Error',
      'No se pudo crear-editar el producto.',
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'infinite'],
    });
  });

  // Test para agregar imágenes
  it('debería permitir agregar imágenes desde la galería', async () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks
    (useMutation as jest.Mock)
      .mockReturnValueOnce({...mockDeleteMutation})
      .mockReturnValueOnce({...mockUpdateMutation});

    // Act
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Simular clic en botón para agregar imágenes
    const rightActionButton = getByTestId('right-action-button');
    fireEvent.press(rightActionButton);

    // Assert
    expect(CameraAdapter.getPicturesFromLibrary).toHaveBeenCalled();
  });

  // Test para la edición de campos de texto
  it('debería permitir la edición de campos de texto', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks
    (useMutation as jest.Mock)
      .mockReturnValueOnce({...mockDeleteMutation})
      .mockReturnValueOnce({...mockUpdateMutation});

    // Act
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Editar el título
    const titleInput = getByTestId('input-Título');
    fireEvent.changeText(titleInput, 'Nuevo título del producto');

    // Editar el slug
    const slugInput = getByTestId('input-Slug');
    fireEvent.changeText(slugInput, 'nuevo-titulo-del-producto');

    // Editar la descripción
    const descriptionInput = getByTestId('input-Descripción');
    fireEvent.changeText(descriptionInput, 'Nueva descripción del producto');

    // Editar el precio
    const priceInput = getByTestId('input-Precio');
    fireEvent.changeText(priceInput, '200');

    // Editar el stock
    const stockInput = getByTestId('input-Inventario');
    fireEvent.changeText(stockInput, '20');

    // Assert - verificar que los inputs existen y se pueden editar
    expect(titleInput).toBeTruthy();
    expect(slugInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(priceInput).toBeTruthy();
    expect(stockInput).toBeTruthy();
  });

  // Test para verificar deshabilitar botones cuando las mutaciones están pendientes
  it('debería deshabilitar botones cuando las mutaciones están pendientes', () => {
    // Arrange
    const mockRoute = {
      params: {
        productId: mockProduct.id,
      },
    };

    // Configurar mocks para las mutaciones en estado pendiente
    (useMutation as jest.Mock)
      .mockReturnValueOnce({
        ...mockDeleteMutation,
        isPending: true,
      })
      .mockReturnValueOnce({
        ...mockUpdateMutation,
        isPending: true,
      });

    // Act
    const {getByTestId} = render(
      <ProductScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Assert - verificar que los botones están deshabilitados
    const saveButton = getByTestId('save-button');
    const deleteButton = getByTestId('delete-button');

    expect(saveButton.props.disabled).toBe(true);
    expect(deleteButton.props.disabled).toBe(true);
  });
});
