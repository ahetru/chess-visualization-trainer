import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../features/auth/context/AuthContext'
import { AppRouter } from './router'
import { TOKEN_KEY } from '../lib/api/client'
import type { ReactNode } from 'react'

vi.mock('../features/puzzle/hooks/usePuzzle', () => ({
    usePuzzle: () => ({ puzzle: null, isLoading: true, error: null, loadNext: vi.fn() }),
}))

function TestWrapper({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) {
    return (
        <MemoryRouter initialEntries={initialEntries}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </MemoryRouter>
    )
}

function login() {
    localStorage.setItem(TOKEN_KEY, 'fake-token')
}

function logout() {
    localStorage.removeItem(TOKEN_KEY)
}

describe('AppRouter', () => {
    beforeEach(() => logout())

    it('renders the home page at "/"', () => {
        render(
            <TestWrapper>
                <AppRouter />
            </TestWrapper>,
        )

        expect(screen.getByRole('heading', { name: /innerchess/i })).toBeInTheDocument()
    })

    it('renders the puzzle page at "/puzzle" when authenticated', () => {
        login()

        render(
            <TestWrapper initialEntries={['/puzzle']}>
                <AppRouter />
            </TestWrapper>,
        )

        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('redirects /puzzle to /login when not authenticated', () => {
        render(
            <TestWrapper initialEntries={['/puzzle']}>
                <AppRouter />
            </TestWrapper>,
        )

        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    it('renders the login page at "/login"', () => {
        render(
            <TestWrapper initialEntries={['/login']}>
                <AppRouter />
            </TestWrapper>,
        )

        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    it('renders the register page at "/register"', () => {
        render(
            <TestWrapper initialEntries={['/register']}>
                <AppRouter />
            </TestWrapper>,
        )

        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument()
    })

    it('navigates between routes via the header links when authenticated', () => {
        login()

        render(
            <TestWrapper>
                <AppRouter />
            </TestWrapper>,
        )

        fireEvent.click(screen.getByRole('link', { name: 'Puzzle' }))
        expect(screen.getByRole('status')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('link', { name: 'InnerChess' }))
        expect(screen.getByRole('heading', { name: /innerchess/i })).toBeInTheDocument()
    })
})
