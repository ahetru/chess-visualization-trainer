import { describe, expect, it, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../features/auth/context/AuthContext'
import { Header } from './Header'
import { TOKEN_KEY } from '../../lib/api/client'
import type { ReactNode } from 'react'

function TestWrapper({ children }: { children: ReactNode }) {
    return (
        <MemoryRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </MemoryRouter>
    )
}

describe('Header', () => {
    afterEach(() => {
        localStorage.removeItem(TOKEN_KEY)
    })

    it('renders the InnerChess link and Puzzle link', () => {
        render(
            <TestWrapper>
                <Header />
            </TestWrapper>,
        )

        expect(screen.getByRole('link', { name: 'InnerChess' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Puzzle' })).toBeInTheDocument()
    })

    it('shows Log in and Register links when not authenticated', () => {
        render(
            <TestWrapper>
                <Header />
            </TestWrapper>,
        )

        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument()
    })

    it('shows Profile link and Log out button when authenticated', () => {
        localStorage.setItem(TOKEN_KEY, 'fake-token')

        render(
            <TestWrapper>
                <Header />
            </TestWrapper>,
        )

        expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
    })
})
