const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const apiClient = {
  baseUrl: API_BASE_URL,

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  },
  async postForm<T>(path: string, form: FormData): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: form,
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  },
  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  },
};
