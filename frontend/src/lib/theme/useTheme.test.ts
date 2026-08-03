import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
    beforeEach(() => {
        localStorage.clear()
        delete document.documentElement.dataset.theme
        vi.mocked(window.matchMedia).mockReturnValue({
            matches: false,
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })
    })

    afterEach(() => {
        delete document.documentElement.dataset.theme
        localStorage.clear()
    })

    it('returns dark when localStorage has "dark"', () => {
        localStorage.setItem('theme', 'dark')
        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('dark')
    })

    it('returns light when localStorage has "light"', () => {
        localStorage.setItem('theme', 'light')
        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('light')
    })

    it('falls back to system-dark when no stored value and prefers-color-scheme is dark', () => {
        vi.mocked(window.matchMedia).mockReturnValue({
            matches: true,
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })

        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('dark')
    })

    it('falls back to light when no stored value and system is light', () => {
        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('light')
    })

    it('ignores an invalid stored value and falls back to system default', () => {
        localStorage.setItem('theme', 'invalid')
        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('light')
    })

    it('toggleTheme flips from light to dark and back', () => {
        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('light')

        act(() => result.current.toggleTheme())
        expect(result.current.theme).toBe('dark')

        act(() => result.current.toggleTheme())
        expect(result.current.theme).toBe('light')
    })

    it('persists the theme to localStorage on toggle', () => {
        const { result } = renderHook(() => useTheme())

        act(() => result.current.toggleTheme())
        expect(localStorage.getItem('theme')).toBe('dark')

        act(() => result.current.toggleTheme())
        expect(localStorage.getItem('theme')).toBe('light')
    })

    it('sets data-theme attribute on the document element', () => {
        const { result } = renderHook(() => useTheme())
        expect(document.documentElement.dataset.theme).toBe('light')

        act(() => result.current.toggleTheme())
        expect(document.documentElement.dataset.theme).toBe('dark')
    })

    it('updates theme when system preference changes and no stored value exists', () => {
        let systemChange: ((e: { matches: boolean }) => void) | null = null
        vi.mocked(window.matchMedia).mockReturnValue({
            matches: false,
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn((_event, handler) => {
                systemChange = handler as (e: { matches: boolean }) => void
            }),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })

        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('light')

        act(() => {
            systemChange!({ matches: true })
        })
        expect(result.current.theme).toBe('dark')
    })

    it('ignores system preference changes when a stored preference exists', () => {
        localStorage.setItem('theme', 'dark')
        let systemChange: ((e: { matches: boolean }) => void) | null = null
        vi.mocked(window.matchMedia).mockReturnValue({
            matches: false, // system is light
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn((_event, handler) => {
                systemChange = handler as (e: { matches: boolean }) => void
            }),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })

        const { result } = renderHook(() => useTheme())
        expect(result.current.theme).toBe('dark') // stored wins

        act(() => {
            systemChange!({ matches: true }) // system switches to dark, but we already are dark via storage
        })
        expect(result.current.theme).toBe('dark') // unchanged — stored preference respected
    })
})
