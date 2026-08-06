import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth/context/AuthContext'

interface ProvidersProps {
    children: ReactNode
}

/**
 * Central place for app-wide providers.
 * TanStack Query's QueryClientProvider will be added here when needed.
 */
export function Providers({ children }: ProvidersProps) {
    return <AuthProvider>{children}</AuthProvider>
}
