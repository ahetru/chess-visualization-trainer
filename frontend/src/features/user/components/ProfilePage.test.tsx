import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfilePage } from './ProfilePage'
import { useCurrentUser } from '../hooks/useCurrentUser'

vi.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: vi.fn(),
}))

const useCurrentUserMock = vi.mocked(useCurrentUser)

const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'alice@example.com',
    userName: 'alice',
    role: 'USER',
}

describe('ProfilePage', () => {
    it('shows a loading state while fetching', () => {
        useCurrentUserMock.mockReturnValue({ user: null, isLoading: true, error: null })

        render(<ProfilePage />)

        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('renders the user fields', () => {
        useCurrentUserMock.mockReturnValue({ user, isLoading: false, error: null })

        render(<ProfilePage />)

        expect(screen.getByText('alice')).toBeInTheDocument()
        expect(screen.getByText('alice@example.com')).toBeInTheDocument()
        expect(screen.getByText('USER')).toBeInTheDocument()
        expect(screen.getByText('11111111-1111-4111-8111-111111111111')).toBeInTheDocument()
    })

    it('renders an error message when the fetch fails', () => {
        useCurrentUserMock.mockReturnValue({ user: null, isLoading: false, error: 'boom' })

        render(<ProfilePage />)

        expect(screen.getByText('Error: boom')).toBeInTheDocument()
    })
})
