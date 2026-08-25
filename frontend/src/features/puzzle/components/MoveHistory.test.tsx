import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoveHistory } from './MoveHistory'
import type { MoveHistoryEntry } from '../hooks/usePuzzleGame'

const entry = (partial: Partial<MoveHistoryEntry> & Pick<MoveHistoryEntry, 'san' | 'color' | 'moveNumber'>): MoveHistoryEntry => ({
    from: 'e2',
    to: 'e4',
    ...partial,
})

describe('MoveHistory', () => {
    it('renders nothing for an empty history', () => {
        const { container } = render(<MoveHistory history={[]} />)

        expect(container).toBeEmptyDOMElement()
    })

    it('numbers white moves and groups the opponent reply on the same line', () => {
        render(
            <MoveHistory
                history={[
                    entry({ san: 'e4', color: 'w', moveNumber: 1 }),
                    entry({ san: 'Nf6', color: 'b', moveNumber: 1 }),
                    entry({ san: 'd4', color: 'w', moveNumber: 2 }),
                ]}
            />,
        )

        expect(screen.getByText('1.')).toBeInTheDocument()
        expect(screen.getByText('e4')).toBeInTheDocument()
        expect(screen.getByText('Nf6')).toBeInTheDocument()
        expect(screen.getByText('2.')).toBeInTheDocument()
        expect(screen.getByText('d4')).toBeInTheDocument()
    })

    it('prefixes the opening black move with an ellipsis', () => {
        render(
            <MoveHistory
                history={[
                    entry({ san: 'e5', color: 'b', moveNumber: 1 }),
                    entry({ san: 'Nf3', color: 'w', moveNumber: 2 }),
                    entry({ san: 'Nc6', color: 'b', moveNumber: 2 }),
                ]}
            />,
        )

        expect(screen.getByText('1...')).toBeInTheDocument()
        expect(screen.getByText('e5')).toBeInTheDocument()
        expect(screen.getByText('2.')).toBeInTheDocument()
        expect(screen.getByText('Nf3')).toBeInTheDocument()
        expect(screen.getByText('Nc6')).toBeInTheDocument()
    })
})
