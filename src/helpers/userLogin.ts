import {httpAxiosGetUser} from '../shared/axios';
import {SUPABASE} from '../constants/app';

const config = {
  headers: {
    apikey: SUPABASE.API_KEY,
    Authorization: SUPABASE.AUTHORIZATION,
  },
};

export const userLogin = async (email: string) => {
  const data = {
    ...config,
    params: {
      email: `eq.${email}`,
    },
  };

  const response = await httpAxiosGetUser(SUPABASE.URL, data);

  return response === 'Error al generar la petición'
    ? response
    : response.length > 0
    ? response[0]
    : 'Usuario no encontrado';
};
