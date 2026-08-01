import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppRouter } from './router'

vi.mock('../features/puzzle/hooks/usePuzzle', () => ({
    usePuzzle: () => ({ puzzle: null, isLoading: true, error: null }),
}))

describe('AppRouter', () => {
    it('renders the home page at "/"', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRouter />
            </MemoryRouter>,
        )

        expect(screen.getByRole('heading', { name: /innerchess/i })).toBeInTheDocument()
    })

    it('renders the puzzle page at "/puzzle"', () => {
        render(
            <MemoryRouter initialEntries={['/puzzle']}>
                <AppRouter />
            </MemoryRouter>,
        )

        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('navigates between the two routes via the header links', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRouter />
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('link', { name: 'Puzzle' }))
        expect(screen.getByText(/loading/i)).toBeInTheDocument()

        fireEvent.click(screen.getByRole('link', { name: 'InnerChess' }))
        expect(screen.getByRole('heading', { name: /innerchess/i })).toBeInTheDocument()
    })
})
