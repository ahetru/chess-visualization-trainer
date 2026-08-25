import { Route, Routes } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { HomePage } from './HomePage'
import { LoginPage } from '../features/auth/components/LoginPage'
import { RegisterPage } from '../features/auth/components/RegisterPage'
import { RequireAuth } from '../features/auth/components/RequireAuth'
import { PuzzlePage } from '../features/puzzle/components/PuzzlePage'
import { ProfilePage } from '../features/user/components/ProfilePage'

export function AppRouter() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/puzzle"
                    element={
                        <RequireAuth>
                            <PuzzlePage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <RequireAuth>
                            <ProfilePage />
                        </RequireAuth>
                    }
                />
            </Route>
        </Routes>
    )
}
