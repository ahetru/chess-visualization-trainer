import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import type {
    ChessboardOptions,
    PieceDropHandlerArgs,
    SquareHandlerArgs,
} from 'react-chessboard'
import { PuzzleBoard } from './PuzzleBoard'

const mocks = vi.hoisted(() => ({
    capturedOptions: [] as ChessboardOptions[],
}))

vi.mock('react-chessboard', () => ({
    Chessboard: ({ options }: { options?: ChessboardOptions }) => {
        if (options) mocks.capturedOptions.push(options)
        return <div data-testid="chessboard" />
    },
}))

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const lastOptions = () => mocks.capturedOptions[mocks.capturedOptions.length - 1]

const clickSquare = (options: ChessboardOptions, square: string, piece: string | null = 'p') => {
    act(() => {
        options.onSquareClick?.({ piece: piece ? { pieceType: piece } : null, square } as SquareHandlerArgs)
    })
}

const dropOnSquare = (options: ChessboardOptions, from: string, to: string) => {
    let result: boolean | undefined
    act(() => {
        result = options.onPieceDrop?.({
            piece: { isSparePiece: false, position: from, pieceType: 'p' },
            sourceSquare: from,
            targetSquare: to,
        } as PieceDropHandlerArgs)
    })
    return result
}

describe('PuzzleBoard', () => {
    beforeEach(() => {
        mocks.capturedOptions.length = 0
    })

    it('renders the chessboard with the given position', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={vi.fn()} />,
        )

        expect(screen.getByTestId('chessboard')).toBeInTheDocument()
        expect(lastOptions().position).toBe(STARTING_FEN)
    })

    it('orients the board to white when the player is white', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={vi.fn()} />,
        )

        expect(lastOptions().boardOrientation).toBe('white')
    })

    it('orients the board to black when the player is black', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="b" isDraggable onPieceDrop={vi.fn()} />,
        )

        expect(lastOptions().boardOrientation).toBe('black')
    })

    it('enables dragging only when isDraggable is true', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable={false} onPieceDrop={vi.fn()} />,
        )

        expect(lastOptions().allowDragging).toBe(false)
    })

    it('forwards the piece drop result and clears the selection', () => {
        const onPieceDrop = vi.fn().mockReturnValue(true)
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={onPieceDrop} />,
        )

        clickSquare(lastOptions(), 'e2')
        expect(lastOptions().squareStyles).toHaveProperty('e2')

        const result = dropOnSquare(lastOptions(), 'e2', 'e4')

        expect(result).toBe(true)
        expect(onPieceDrop).toHaveBeenCalledTimes(1)
        expect(lastOptions().squareStyles).toEqual({})
    })

    it('returns false on drop when no onPieceDrop is provided', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable={false} onPieceDrop={undefined} />,
        )

        const result = dropOnSquare(lastOptions(), 'e2', 'e4')

        expect(result).toBe(false)
    })

    it('highlights the selected square and its legal moves', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={vi.fn()} />,
        )

        expect(lastOptions().squareStyles).toEqual({})

        clickSquare(lastOptions(), 'e2')

        const styles = lastOptions().squareStyles ?? {}
        expect(styles['e2']).toBeDefined()
        expect(styles['e2'].background).toBe('var(--board-highlight)')
        expect(styles['e3']).toBeDefined()
        expect(styles['e4']).toBeDefined()
        expect(styles['e5']).toBeUndefined()
    })

    it('clears the highlight when the same square is clicked again', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={vi.fn()} />,
        )

        clickSquare(lastOptions(), 'e2')
        expect(lastOptions().squareStyles).toHaveProperty('e2')

        clickSquare(lastOptions(), 'e2')
        expect(lastOptions().squareStyles).toEqual({})
    })

    it('clears the highlight when an empty square is clicked', () => {
        render(
            <PuzzleBoard fen={STARTING_FEN} playerColor="w" isDraggable onPieceDrop={vi.fn()} />,
        )

        clickSquare(lastOptions(), 'e2')
        expect(lastOptions().squareStyles).toHaveProperty('e2')

        clickSquare(lastOptions(), 'e5', null)
        expect(lastOptions().squareStyles).toEqual({})
    })
})
