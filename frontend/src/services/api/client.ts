import { ENV } from '../../config/env';
import { APIErrorResponse } from '../../types';

let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAuthToken = () => inMemoryToken;

export class APIError extends Error {
  code: string;
  errors?: Record<string, string[]>;
  status: number;

  constructor(message: string, code = 'UNKNOWN_ERROR', status = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiOptions extends RequestInit {
  params?: Record<string, any>;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  let url = `${ENV.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  if (fetchOptions.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorData: APIErrorResponse = {
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        code: `HTTP_${response.status}`,
      };

      try {
        const json = await response.json();
        if (json.message) errorData.message = json.message;
        if (json.code) errorData.code = json.code;
        if (json.errors) errorData.errors = json.errors;
      } catch (_) {}

      throw new APIError(errorData.message, errorData.code, response.status, errorData.errors);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || 'Network request failed. Please check backend connection.',
      'NETWORK_ERROR',
      0
    );
  }
}

export const api = Object.assign(apiClient, {
  get: async <T>(endpoint: string, options: ApiOptions = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(endpoint, { ...options, method: 'GET' });
    return { data };
  },

  post: async <T>(endpoint: string, body?: any, options: ApiOptions = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return { data };
  },

  put: async <T>(endpoint: string, body?: any, options: ApiOptions = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return { data };
  },

  patch: async <T>(endpoint: string, body?: any, options: ApiOptions = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    return { data };
  },

  delete: async <T>(endpoint: string, options: ApiOptions = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(endpoint, { ...options, method: 'DELETE' });
    return { data };
  },
});
