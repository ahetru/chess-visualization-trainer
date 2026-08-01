import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Header } from './Header'

describe('Header', () => {
    it('renders the navigation links to both routes', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'InnerChess' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Puzzle' })).toBeInTheDocument()
    })
})
