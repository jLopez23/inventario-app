import {httpAxios} from '../shared/axios';
import {SUPABASE} from '../constants/app';

const config = {
  headers: {
    apikey: SUPABASE.API_KEY,
    Authorization: SUPABASE.AUTHORIZATION,
  },
};

export const validateUser = async (email: string, password: string) => {
  const data = {
    ...config,
    params: {
      email: `eq.${email}`,
      password: `eq.${password}`,
    },
  };

  const response = await httpAxios(SUPABASE.URL, data);

  return response === 'Error al generar la petición'
    ? response
    : response.length > 0
    ? response[0]
    : 'Usuario no encontrado';
};
