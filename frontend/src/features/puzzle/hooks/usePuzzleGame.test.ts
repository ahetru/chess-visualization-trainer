import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePuzzleGame } from './usePuzzleGame';
import { submitMove } from '../api/puzzle.api';
import type { Puzzle } from '../types/puzzle.types';
import type { PieceDropHandlerArgs } from 'react-chessboard';

vi.mock('../api/puzzle.api', () => ({
    submitMove: vi.fn(),
}));

const submitMoveMock = vi.mocked(submitMove);

const basePuzzle: Puzzle = {
    id: 'puzzle-1',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1',
    playerColor: 'w',
    opponentMove: 'e7e5',
    solution: 'e2e4 g8f6 d2d4',
    rating: 1500,
    themes: 'opening',
};

function drop(handler: NonNullable<ReturnType<typeof usePuzzleGame>['onPieceDrop']>, from: string, to: string) {
    return handler({
        piece: { isSparePiece: false, position: from, pieceType: 'p' },
        sourceSquare: from,
        targetSquare: to,
    } as PieceDropHandlerArgs);
}

async function flushMicrotasks() {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
}

describe('usePuzzleGame', () => {
    beforeEach(() => {
        submitMoveMock.mockReset();
    });

    it('applies the opponent blunder and starts with the player to move', () => {
        const { result } = renderHook(() => usePuzzleGame(basePuzzle));

        expect(result.current.status).toBe('playing');
        expect(result.current.playerColor).toBe('w');
        expect(result.current.fen.split(' ')[1]).toBe('w');
    });

    it('marks the puzzle solved after a correct final move', async () => {
        submitMoveMock
            .mockResolvedValueOnce({ correct: true, solved: false, replyMove: 'g8f6' })
            .mockResolvedValueOnce({ correct: true, solved: true, replyMove: null });

        const { result } = renderHook(() => usePuzzleGame(basePuzzle));

        act(() => {
            drop(result.current.onPieceDrop, 'e2', 'e4');
        });
        await flushMicrotasks();
        expect(result.current.status).toBe('correct');
        expect(result.current.message).toBe('Correct!');

        act(() => {
            drop(result.current.onPieceDrop, 'd2', 'd4');
        });
        await flushMicrotasks();
        expect(result.current.status).toBe('solved');
        expect(result.current.message).toBe('Puzzle solved!');
    });

    it('snaps the piece back on an incorrect move', async () => {
        submitMoveMock.mockResolvedValueOnce({ correct: false, solved: false, replyMove: null });

        const { result } = renderHook(() => usePuzzleGame(basePuzzle));
        const fenBefore = result.current.fen;

        act(() => {
            drop(result.current.onPieceDrop, 'e2', 'e4');
        });
        await flushMicrotasks();

        expect(result.current.status).toBe('incorrect');
        expect(result.current.message).toBe('Incorrect move, try again.');
        expect(result.current.fen).toBe(fenBefore);
    });

    it('clears the previous feedback when the next move starts', async () => {
        submitMoveMock
            .mockResolvedValueOnce({ correct: true, solved: false, replyMove: 'g8f6' })
            .mockResolvedValueOnce({ correct: true, solved: true, replyMove: null });

        const { result } = renderHook(() => usePuzzleGame(basePuzzle));

        act(() => {
            drop(result.current.onPieceDrop, 'e2', 'e4');
        });
        await flushMicrotasks();
        expect(result.current.message).toBe('Correct!');

        act(() => {
            drop(result.current.onPieceDrop, 'd2', 'd4');
        });
        expect(result.current.message).toBeNull();
    });
});
