import {tesloApi} from '../../config/api/tesloApi';
import type {AuthResponse} from '../../infrastructure/interfaces/auth.responses';
import {User} from '../../domain/entities/user';

const returnUserToken = (data: AuthResponse) => {
  const user: User = {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    isActive: data.isActive,
    roles: data.roles,
  };

  return {
    user,
    token: data.token,
  };
};

export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();
  try {
    const {data} = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return returnUserToken(data);
  } catch (error) {
    console.log(`Error authLogin: ${JSON.stringify(error)}`);
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const {data} = await tesloApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data);
  } catch (error) {
    console.log(`Error authCheckStatus: ${JSON.stringify(error)}`);
    return null;
  }
};

export const authRegister = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    console.log('Registering user...', {email, password, fullName});
    const {data} = await tesloApi.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    });
    return returnUserToken(data);
  } catch (error) {
    console.log(`Error authRegister: ${JSON.stringify(error)}`);
    return null;
  }
};
