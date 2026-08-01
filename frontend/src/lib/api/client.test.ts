import { describe, expect, it } from 'vitest'
import { apiClient } from './client'

describe('apiClient', () => {
  it('is configured with the backend base URL from the environment', () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL)
  })

  it('has a JSON content type by default', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })
})
