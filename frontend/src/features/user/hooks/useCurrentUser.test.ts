import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCurrentUser } from './useCurrentUser'
import { getCurrentUser } from '../api/user.api'

vi.mock('../api/user.api', () => ({
    getCurrentUser: vi.fn(),
}))

const getCurrentUserMock = vi.mocked(getCurrentUser)

const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'alice@example.com',
    userName: 'alice',
    role: 'USER',
}

describe('useCurrentUser', () => {
    beforeEach(() => {
        getCurrentUserMock.mockReset()
    })

    it('returns the user once loading completes', async () => {
        getCurrentUserMock.mockResolvedValue(user)

        const { result } = renderHook(() => useCurrentUser())

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.user).toEqual(user)
        expect(result.current.error).toBeNull()
    })

    it('returns an error when the fetch fails', async () => {
        getCurrentUserMock.mockRejectedValue(new Error('boom'))

        const { result } = renderHook(() => useCurrentUser())

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.user).toBeNull()
        expect(result.current.error).toBe('boom')
    })
})
