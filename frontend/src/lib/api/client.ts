import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

/** Plain client used for the refresh call so it never re-enters the interceptor. */
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function redirectToLogin(): void {
    window.location.href = '/login';
}

function isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/');
}

/** Attach the stored JWT access token to every outgoing request. */
apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * On 401: transparently refresh the access token and retry the failed request
 * once. Concurrent 401s share a single in-flight refresh. If refresh fails (or
 * is impossible), clear the tokens and redirect to /login.
 * Auth endpoints (login, register, refresh, logout) are excluded to avoid loops.
 */
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return Promise.resolve(null);
    }
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', {
                refreshToken,
            })
            .then(({ data }) => {
                setTokens(data.accessToken, data.refreshToken);
                return data.accessToken;
            })
            .catch(() => null)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined;
        const status = error.response?.status;
        const url = original?.url ?? '';

        if (status !== 401 || !original || isAuthEndpoint(url)) {
            return Promise.reject(error);
        }

        if (original._retry) {
            clearTokens();
            redirectToLogin();
            return Promise.reject(error);
        }

        original._retry = true;

        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
            clearTokens();
            redirectToLogin();
            return Promise.reject(error);
        }

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(original);
    },
);
