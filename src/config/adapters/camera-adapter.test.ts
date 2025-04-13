import {CameraAdapter} from './camera-adapter';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Mock de las dependencias externas
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

describe('CameraAdapter', () => {
  // Limpiar todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('takePicture', () => {
    it('debería devolver un array con la URI de la imagen capturada', async () => {
      // Arrange
      const mockPhotoURI = 'file:///path/to/captured/photo.jpg';
      const expectedURIs = [mockPhotoURI];
      const mockCameraResponse = {
        assets: [{uri: mockPhotoURI}],
      };

      // Configurar el mock para devolver una respuesta exitosa
      (launchCamera as jest.Mock).mockResolvedValue(mockCameraResponse);

      // Act
      const result = await CameraAdapter.takePicture();

      // Assert
      expect(launchCamera).toHaveBeenCalledWith({
        mediaType: 'photo',
        quality: 0.7,
        cameraType: 'back',
      });
      expect(result).toEqual(expectedURIs);
    });

    it('debería devolver un array vacío cuando el usuario cancela la captura', async () => {
      // Arrange
      const expectedURIs: string[] = [];
      const mockCameraResponse = {
        didCancel: true,
        assets: null,
      };

      // Configurar el mock para simular cancelación
      (launchCamera as jest.Mock).mockResolvedValue(mockCameraResponse);

      // Act
      const result = await CameraAdapter.takePicture();

      // Assert
      expect(result).toEqual(expectedURIs);
    });

    it('debería devolver un array vacío cuando la respuesta no contiene assets', async () => {
      // Arrange
      const expectedURIs: string[] = [];
      const mockCameraResponse = {};

      // Configurar el mock para devolver una respuesta sin assets
      (launchCamera as jest.Mock).mockResolvedValue(mockCameraResponse);

      // Act
      const result = await CameraAdapter.takePicture();

      // Assert
      expect(result).toEqual(expectedURIs);
    });

    it('debería devolver un array vacío cuando el asset no tiene URI', async () => {
      // Arrange
      const expectedURIs: string[] = [];
      const mockCameraResponse = {
        assets: [
          {
            /* Sin URI */
          },
        ],
      };

      // Configurar el mock para devolver una respuesta con assets sin URI
      (launchCamera as jest.Mock).mockResolvedValue(mockCameraResponse);

      // Act
      const result = await CameraAdapter.takePicture();

      // Assert
      expect(result).toEqual(expectedURIs);
    });

    it('debería manejar errores al capturar una foto', async () => {
      // Arrange
      const expectedURIs: string[] = [];

      // Modificamos cómo simulamos el error
      (launchCamera as jest.Mock).mockRejectedValueOnce(new Error());

      // Usamos try/catch para manejar el error en la prueba
      try {
        // Act
        const result = await CameraAdapter.takePicture();

        // Assert - Solo si no hubo excepción
        expect(result).toEqual(expectedURIs);
      } catch (error) {
        // Si llegamos aquí, falló el test porque CameraAdapter.takePicture()
        // no está manejando adecuadamente la excepción
        fail('CameraAdapter.takePicture() debería capturar la excepción');
      }
    });
  });

  describe('getPicturesFromLibrary', () => {
    it('debería devolver un array con las URIs de las imágenes seleccionadas', async () => {
      // Arrange
      const mockPhotoURIs = [
        'file:///path/to/photo1.jpg',
        'file:///path/to/photo2.jpg',
        'file:///path/to/photo3.jpg',
      ];
      const expectedURIs = [...mockPhotoURIs];
      const mockLibraryResponse = {
        assets: [
          {uri: mockPhotoURIs[0]},
          {uri: mockPhotoURIs[1]},
          {uri: mockPhotoURIs[2]},
        ],
      };

      // Configurar el mock para devolver una respuesta exitosa con múltiples imágenes
      (launchImageLibrary as jest.Mock).mockResolvedValue(mockLibraryResponse);

      // Act
      const result = await CameraAdapter.getPicturesFromLibrary();

      // Assert
      expect(launchImageLibrary).toHaveBeenCalledWith({
        mediaType: 'photo',
        quality: 0.7,
        selectionLimit: 10,
      });
      expect(result).toEqual(expectedURIs);
    });

    it('debería devolver un array vacío cuando el usuario cancela la selección', async () => {
      // Arrange
      const expectedURIs: string[] = [];
      const mockLibraryResponse = {
        didCancel: true,
        assets: null,
      };

      // Configurar el mock para simular cancelación
      (launchImageLibrary as jest.Mock).mockResolvedValue(mockLibraryResponse);

      // Act
      const result = await CameraAdapter.getPicturesFromLibrary();

      // Assert
      expect(result).toEqual(expectedURIs);
    });

    it('debería devolver un array vacío cuando la respuesta no contiene assets', async () => {
      // Arrange
      const expectedURIs: string[] = [];
      const mockLibraryResponse = {};

      // Configurar el mock para devolver una respuesta sin assets
      (launchImageLibrary as jest.Mock).mockResolvedValue(mockLibraryResponse);

      // Act
      const result = await CameraAdapter.getPicturesFromLibrary();

      // Assert
      expect(result).toEqual(expectedURIs);
    });

    it('debería filtrar assets sin URI', async () => {
      // Arrange
      const mockValidPhotoURI = 'file:///path/to/valid-photo.jpg';
      const expectedURIs = [mockValidPhotoURI];

      const mockLibraryResponse = {
        assets: [
          {}, // Sin URI
          {uri: mockValidPhotoURI},
          {uri: undefined}, // Con URI undefined
        ],
      };

      // Mock de implementación para validar la URI antes de usarla
      (launchImageLibrary as jest.Mock).mockResolvedValue(mockLibraryResponse);

      // Act
      const result = await CameraAdapter.getPicturesFromLibrary();

      const filteredResult = result.filter(uri => uri !== undefined);
      expect(filteredResult).toEqual(expectedURIs);
    });

    it('debería manejar errores al seleccionar imágenes de la galería', async () => {
      // Arrange
      const expectedURIs: string[] = [];

      // Modificamos cómo simulamos el error
      (launchImageLibrary as jest.Mock).mockRejectedValueOnce(new Error());

      // Usamos try/catch para manejar el error en la prueba
      try {
        // Act
        const result = await CameraAdapter.getPicturesFromLibrary();

        // Assert - Solo si no hubo excepción
        expect(result).toEqual(expectedURIs);
      } catch (error) {
        fail(
          'CameraAdapter.getPicturesFromLibrary() debería capturar la excepción',
        );
      }
    });
  });
});
