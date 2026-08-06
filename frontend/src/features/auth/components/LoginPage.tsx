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
        <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-sm border border-edge bg-card p-6"
            >
                <h1 className="mb-4 text-xl font-medium text-ink">Log in</h1>

                {error && (
                    <p className="mb-4 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
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
                    className="mb-3 w-full rounded-sm border border-edge bg-transparent px-3 py-2 text-ink
                               placeholder:text-dim/50 focus:border-accent focus:outline-none
                               focus:ring-1 focus:ring-accent"
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
                    className="mb-4 w-full rounded-sm border border-edge bg-transparent px-3 py-2 text-ink
                               placeholder:text-dim/50 focus:border-accent focus:outline-none
                               focus:ring-1 focus:ring-accent"
                    placeholder="••••••••"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-sm bg-accent px-4 py-2 text-base font-medium text-white
                               hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent
                               focus:ring-offset-2 transition-all disabled:opacity-50"
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
