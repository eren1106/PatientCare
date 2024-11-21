/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios';
import { apiCaller } from './axiosConfig';

export const apiRequest = {
  post: async (endpoint: string, data?: any, config?: AxiosRequestConfig) => {
    return requestWithCaller('post', endpoint, data, config);
  },
  get: async (endpoint: string, config?: AxiosRequestConfig) => {
    return requestWithCaller('get', endpoint, null, config);
  },
  put: async (endpoint: string, data?: any, config?: AxiosRequestConfig) => {
    return requestWithCaller('put', endpoint, data, config);
  },
  delete: async (endpoint: string, config?: AxiosRequestConfig) => {
    return requestWithCaller('delete', endpoint, null, config);
  },
};

async function requestWithCaller(
  method: 'post' | 'get' | 'put' | 'delete',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
) {
  try {
    const response = await apiCaller({
      method,
      url: endpoint,
      data,
      headers: {
        // Only set 'Content-Type' if the data is not FormData, as FormData sets its own headers
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
      ...config, // Spread additional Axios config options if provided
    });

    // Handle 204 No Content response
    if (response.status === 204) return;

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = (typeof error.response.data.message === 'string' && error.response.data.message.trim() !== '')
        ? error.response.data.message
        : 'An error occurred';
      throw errorMessage;
    }
    throw 'An unexpected error occurred';
  }
}
