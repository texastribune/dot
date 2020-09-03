import axios, { AxiosError } from 'axios';

import { NetworkError } from '../shared-errors';

export default function configureAxios(): void {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.isAxiosError) {
        const networkError = error as AxiosError;

        return Promise.reject(
          new NetworkError({
            code: networkError.code,
            message: networkError.message,
            status: networkError.response
              ? networkError.response.status
              : undefined,
            data: networkError.response
              ? networkError.response.data
              : undefined,
          })
        );
      }
      return Promise.reject(error);
    }
  );
}
