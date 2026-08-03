import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function readStoredTheme(): Theme {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(readStoredTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
    }, [theme])

    // React to system preference changes when the user has no stored preference
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light')
            }
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', next)
            return next
        })
    }, [])

    return { theme, toggleTheme }
}
