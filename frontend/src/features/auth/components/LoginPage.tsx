import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types/auth.types';
import axios from 'axios';

function extractError(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
        return 'Invalid email or password.';
    }
    if (axios.isAxiosError(err) && err.response?.data?.message) {
        return String(err.response.data.message);
    }
    if (err instanceof Error) {
        return err.message;
    }
    return 'An unexpected error occurred.';
}

export function LoginPage() {
    const { isAuthenticated, isLoading, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const request: LoginRequest = { email, password };
        try {
            await login(request);
            navigate('/', { replace: true });
        } catch (err: unknown) {
            setError(extractError(err));
        }
    }

    return (
        <section className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm card p-6">
                <h1 className="mb-4 text-xl font-semibold text-[var(--fg-strong)]">Log in</h1>

                {error && (
                    <p className="mb-4 rounded-[6px] border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-3 py-2 text-sm text-[var(--accent-red)]">
                        {error}
                    </p>
                )}

                <label className="mb-1 block text-sm text-dim" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input mb-3"
                    placeholder="you@example.com"
                />

                <label className="mb-1 block text-sm text-dim" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input mb-4"
                    placeholder="••••••••"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full"
                >
                    {isLoading ? 'Logging in…' : 'Log in'}
                </button>

                <p className="mt-4 text-center text-sm text-dim">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-accent hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </section>
    );
}
