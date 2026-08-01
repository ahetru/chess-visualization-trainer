import type { ReactNode } from 'react'

interface ProvidersProps {
    children: ReactNode
}

/**
 * Central place for app-wide providers.
 * TanStack Query's QueryClientProvider will be added here in Phase 7.
 */
export function Providers({ children }: ProvidersProps) {
    return <>{children}</>
}
