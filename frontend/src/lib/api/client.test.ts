import { describe, expect, it } from 'vitest'
import { apiClient, TOKEN_KEY } from './client'

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
