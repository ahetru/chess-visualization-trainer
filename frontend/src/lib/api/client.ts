import axios from 'axios';

export const TOKEN_KEY = 'accessToken';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

/** Attach the stored JWT access token to every outgoing request. */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * On 401: clear the (now-invalid) token and redirect to /login.
 * Auth endpoints (login, register) are excluded to avoid redirect loops.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url ?? '';
            const isAuthEndpoint = url.includes('/api/auth/');
            if (!isAuthEndpoint) {
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);
