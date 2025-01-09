import axios from 'axios';
import {Config} from './interface/configInterface';

export const httpAxios = async (url: string, axiosConfig: Config) => {
  try {
    const response = await axios.get(url, axiosConfig);
    return response.data.length > 0 ? response.data : [];
  } catch (error) {
    console.log('Error', JSON.stringify(error));
    return 'Error al generar la petición';
  }
};
