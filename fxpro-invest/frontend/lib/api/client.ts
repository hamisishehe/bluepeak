import axios from 'axios';

function apiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  if (typeof window === 'undefined') return configured;
  const pointsToLoopback = configured.includes('localhost') || configured.includes('127.0.0.1');
  if (window.location.protocol === 'https:' && pointsToLoopback) return window.location.origin;
  return configured;
}

export const api = axios.create({
  baseURL: apiBaseUrl(),
  withCredentials: true,
});

export function storeAuth(payload: { accessToken: string; refreshToken: string; user: { role: string } }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fxpro_access_token', payload.accessToken);
  localStorage.setItem('fxpro_refresh_token', payload.refreshToken);
  document.cookie = `fxpro_role=${payload.user.role}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fxpro_access_token');
  localStorage.removeItem('fxpro_refresh_token');
  document.cookie = 'fxpro_role=; path=/; max-age=0; SameSite=Lax';
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fxpro_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === 'undefined' || error?.response?.status !== 401) throw error;
    const refreshToken = localStorage.getItem('fxpro_refresh_token');
    if (!refreshToken || error.config?._retry) {
      clearAuth();
      throw error;
    }
    error.config._retry = true;
    try {
      const response = await axios.post(`${apiBaseUrl()}/api/v1/auth/refresh-token`, { refreshToken });
      localStorage.setItem('fxpro_access_token', response.data.accessToken);
      localStorage.setItem('fxpro_refresh_token', response.data.refreshToken);
      error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return api.request(error.config);
    } catch (refreshError) {
      clearAuth();
      throw refreshError;
    }
  },
);

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (error.response?.status === 401) return 'Your session expired. Please sign in again.';
  }
  return 'Something went wrong. Please try again.';
}
