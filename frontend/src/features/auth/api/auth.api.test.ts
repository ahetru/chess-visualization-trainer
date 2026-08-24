import { describe, expect, it, vi, beforeEach } from 'vitest'
import { apiClient } from '../../../lib/api/client'
import { refresh, logout } from './auth.api'

vi.mock('../../../lib/api/client', () => ({
    apiClient: { post: vi.fn() },
}))

const postMock = vi.mocked(apiClient.post)

describe('auth.api', () => {
    beforeEach(() => {
        postMock.mockReset()
    })

    it('refresh posts the refresh token and returns a parsed AuthResponse', async () => {
        const authResponse = {
            accessToken: 'access',
            refreshToken: 'refresh',
            tokenType: 'Bearer',
            expiresIn: 900,
        }
        postMock.mockResolvedValue({ data: authResponse })

        await expect(refresh({ refreshToken: 'refresh' })).resolves.toEqual(authResponse)
        expect(postMock).toHaveBeenCalledWith('/api/auth/refresh', { refreshToken: 'refresh' })
    })

    it('logout posts the refresh token to revoke it', async () => {
        postMock.mockResolvedValue({ data: undefined })

        await logout({ refreshToken: 'refresh' })
        expect(postMock).toHaveBeenCalledWith('/api/auth/logout', { refreshToken: 'refresh' })
    })
})
