import ApiError from 'src/classes/api-error';
import type ErrorData from 'src/interfaces/error-data';

interface FetchOptions {
  endpoint: string;
  method?: string;
  params?: Record<string, string> | undefined;
  data?: Record<string, unknown> | undefined;
  isFormData?: boolean;
}

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.SERVER_URL}${process.env.SERVER_API_PATH}`;
  }

  async #fetch(
    { endpoint, method = 'GET', params, data, isFormData = false }: FetchOptions = { endpoint: '' },
  ): Promise<any> {
    let url = `${this.baseUrl}/${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
      },
    };

    if (isFormData) {
      // Send as form data
      (config.headers as Record<string, string>)['Content-Type'] =
        'application/x-www-form-urlencoded';
      if (data) {
        const formData = new URLSearchParams();
        for (const key in data) {
          formData.append(key, <string>data[key]);
        }
        config.body = formData;
      }
    } else {
      // Send it as JSON
      if (method !== 'GET') {
        (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
      if (data) {
        config.body = JSON.stringify(data);
      }
    }

    if (params && method === 'GET') {
      url += `?${new URLSearchParams(params)}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const json = await response.json();
      const errorData: ErrorData = {
        code: response.status,
        message: response.statusText,
        details: json.message,
      };
      throw new ApiError(errorData.message, errorData);
    }

    return await response.json();
  }

  async get(
    { endpoint, params }: { endpoint: string; params?: Record<string, string> } = {
      endpoint: '',
    },
  ): Promise<any> {
    return this.#fetch({ endpoint, method: 'GET', params });
  }

  async post(
    {
      endpoint,
      data,
      isFormData = false,
    }: { endpoint: string; data?: Record<string, any>; isFormData?: boolean } = {
      endpoint: '',
    },
  ): Promise<any> {
    return this.#fetch({ endpoint, method: 'POST', data, isFormData });
  }

  async put(
    { endpoint, data }: { endpoint: string; data?: Record<string, any> } = { endpoint: '' },
  ): Promise<any> {
    return this.#fetch({ endpoint, method: 'PUT', data });
  }

  async patch(
    { endpoint, data }: { endpoint: string; data?: Record<string, any> } = { endpoint: '' },
  ): Promise<any> {
    return this.#fetch({ endpoint, method: 'PATCH', data });
  }

  async delete(
    { endpoint, data }: { endpoint: string; data?: Record<string, any> } = { endpoint: '' },
  ): Promise<any> {
    return this.#fetch({ endpoint, method: 'DELETE', data });
  }
}

const api = new Api();

export { api };
