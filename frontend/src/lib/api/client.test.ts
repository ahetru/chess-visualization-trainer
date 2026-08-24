import { describe, expect, it } from 'vitest'
import {
  apiClient,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from './client'

describe('token storage helpers', () => {
  it('stores both tokens and clears them together', () => {
    setTokens('acc', 'ref')
    expect(getAccessToken()).toBe('acc')
    expect(getRefreshToken()).toBe('ref')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('acc')
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('ref')

    clearTokens()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})

describe('apiClient', () => {
  it('is configured with the backend base URL from the environment', () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL)
  })

  it('has a JSON content type by default', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('attaches the Bearer token from localStorage when present', async () => {
    const token = 'test-jwt-token'
    localStorage.setItem(TOKEN_KEY, token)

    const handler = apiClient.interceptors.request.handlers?.[0]
    expect(handler).toBeDefined()

    const config = { headers: {} } as Parameters<NonNullable<typeof handler>['fulfilled']>[0]
    const result = await Promise.resolve(handler!.fulfilled!(config))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = (result as any).headers as Record<string, string>

    expect(headers.Authorization).toBe(`Bearer ${token}`)

    localStorage.removeItem(TOKEN_KEY)
  })

  it('does not attach Authorization header when no token is stored', async () => {
    localStorage.removeItem(TOKEN_KEY)

    const handler = apiClient.interceptors.request.handlers?.[0]
    expect(handler).toBeDefined()

    const config = { headers: {} } as Parameters<NonNullable<typeof handler>['fulfilled']>[0]
    const result = await Promise.resolve(handler!.fulfilled!(config))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = (result as any).headers as Record<string, string>

    expect(headers.Authorization).toBeUndefined()
  })
})
