import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../../../lib/api/client';
import * as authApi from '../api/auth.api';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function readToken(): string | null {
    return getAccessToken();
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(readToken);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (request: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(request);
            setTokens(response.accessToken, response.refreshToken);
            setToken(response.accessToken);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (request: RegisterRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.register(request);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        const refreshToken = getRefreshToken();
        clearTokens();
        setToken(null);
        setError(null);
        if (refreshToken) {
            authApi.logout({ refreshToken }).catch(() => {
                // Best-effort: local state is already cleared.
            });
        }
    }, []);

    const value = useMemo<AuthState>(() => ({
        token,
        isAuthenticated: token !== null,
        isLoading,
        error,
        login,
        register,
        logout,
    }), [token, isLoading, error, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
