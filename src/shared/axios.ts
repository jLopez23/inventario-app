import axios from 'axios';
import {Config, CreateUser} from './interface/configInterface';

export const httpAxiosGetUser = async (url: string, axiosConfig: Config) => {
  try {
    const response = await axios.get(url, axiosConfig);
    return response.data.length > 0 ? response.data : [];
  } catch (error) {
    console.log('Error', JSON.stringify(error));
    return 'Error al generar la petición';
  }
};

export const httpAxiosPostUser = async (
  url: string,
  data: CreateUser,
  axiosConfig: Config,
) => {
  try {
    const response = await axios.post(url, data, axiosConfig);
    return response?.status;
  } catch (error) {
    console.log('Error', JSON.stringify(error));
    return 'Error al generar la petición';
  }
};
