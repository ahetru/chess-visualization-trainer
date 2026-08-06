import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../features/auth/context/AuthContext'
import { Header } from './Header'
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
})
