export type restfulResponse<T> = {
  code: number;
  message?: string;
  data?: T;
  error?: string;
};

export type loginResponse = {
  code: number;
  message?: string;
  access_token?: string;
  error?: string;
};
