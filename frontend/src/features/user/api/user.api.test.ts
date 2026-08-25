import { describe, expect, it, vi, beforeEach } from 'vitest'
import { apiClient } from '../../../lib/api/client'
import { getCurrentUser } from './user.api'

vi.mock('../../../lib/api/client', () => ({
    apiClient: { get: vi.fn() },
}))

const getMock = vi.mocked(apiClient.get)

const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'alice@example.com',
    userName: 'alice',
    role: 'USER',
}

describe('user.api', () => {
    beforeEach(() => {
        getMock.mockReset()
    })

    it('fetches the current user and returns a parsed UserDto', async () => {
        getMock.mockResolvedValue({ data: user })

        await expect(getCurrentUser()).resolves.toEqual(user)
        expect(getMock).toHaveBeenCalledWith('/api/users/me')
    })
})
