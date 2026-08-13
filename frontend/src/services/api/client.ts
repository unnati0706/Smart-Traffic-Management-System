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

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${ENV.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  // Handle FormData (multipart/form-data)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      ...options,
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
      } catch (_) {
        // Response body was not JSON
      }

      throw new APIError(errorData.message, errorData.code, response.status, errorData.errors);
    }

    // Handle 244 No Content or empty body
    if (response.status === 244 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
    }
    // Network or parse error
    throw new APIError(
      error.message || 'Network request failed. Please check backend connection.',
      'NETWORK_ERROR',
      0
    );
  }
}
