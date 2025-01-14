import {SUPABASE} from '../constants/app';
import {httpAxiosPostUser} from '../shared/axios';
import { CreateUser } from '../shared/interface/configInterface';

const config = {
  headers: {
    apikey: SUPABASE.API_KEY,
    Authorization: SUPABASE.AUTHORIZATION,
  },
};

export const userRegistration = async (user: CreateUser) => {
  const headers = {
    ...config,
  };

  const response = await httpAxiosPostUser(SUPABASE.URL, user, headers);

  return response === 201 ? response : 'Usuario no creado';
};
