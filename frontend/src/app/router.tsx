import { Route, Routes } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { HomePage } from './HomePage'
import { PuzzlePage } from '../features/puzzle/components/PuzzlePage'

export function AppRouter() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/puzzle" element={<PuzzlePage />} />
            </Route>
        </Routes>
    )
}
