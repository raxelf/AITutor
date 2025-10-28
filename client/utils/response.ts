export type restfulResponse<T> = {
  code: number;
  message?: string;
  data?: T;
  error?: string;
};
