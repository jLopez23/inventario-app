export interface Config {
  headers: {
    apikey: string;
    Authorization: string;
  };
  params?: {
    email: string;
  };
}
export interface CreateUser {
  name: string;
  email: string;
  password: string;
}
