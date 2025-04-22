import {STAGE, API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID} from '@env';
import axios from 'axios';
import {Platform} from 'react-native';
import {StorageAdapter} from '../adapters/storage-adapter';
import { getApiUrl } from './tesloApiHelper';

// Usando la función auxiliar para determinar la API_URL
export const API_URL = getApiUrl(
  STAGE,
  Platform.OS,
  PROD_URL,
  API_URL_IOS,
  API_URL_ANDROID
);

const tesloApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

tesloApi.interceptors.request.use(async config => {
  const token = await StorageAdapter.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export {tesloApi};
