export interface Config {
  headers: {
    apikey: string;
    Authorization: string;
  };
  params: {
    email: string;
    password: string;
  };
}
