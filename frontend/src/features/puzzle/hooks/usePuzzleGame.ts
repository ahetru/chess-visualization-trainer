import { useState, useRef, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { submitMove } from '../api/puzzle.api';
import type { Puzzle } from '../types/puzzle.types';
import type { ChessboardOptions, PieceDropHandlerArgs } from 'react-chessboard';

export type GameStatus = 'playing' | 'correct' | 'incorrect' | 'solved';

export interface UsePuzzleGameReturn {
    /** Current board position as FEN */
    fen: string;
    /** Current game status */
    status: GameStatus;
    /** Feedback message for the last move */
    message: string | null;
    /** Whether a move submission is in flight */
    isProcessing: boolean;
    /** The player's color ('w' or 'b') */
    playerColor: 'w' | 'b';
    /** The current side to move according to chess.js ('w' or 'b') */
    currentTurn: 'w' | 'b';
    /** The 0-based index of the next player move to submit */
    moveNumber: number;
    /** Handler for react-chessboard onPieceDrop (options.onPieceDrop) */
    onPieceDrop: NonNullable<ChessboardOptions['onPieceDrop']>;
}

/**
 * Manages the interactive puzzle game state: local chess.js board (UX only),
 * move submission to the backend (authoritative validation), and opponent
 * reply application.
 *
 * The board is initialized by applying the opponent's blunder to the puzzle
 * FEN, so the player faces the position where their solution begins.
 *
 * onPieceDrop returns boolean synchronously (required by react-chessboard).
 * Async backend validation happens via .then(); if the backend rejects the
 * move, we undo it locally and update the FEN, which snaps the piece back.
 */
export function usePuzzleGame(puzzle: Puzzle): UsePuzzleGameReturn {
    const initialFen = useMemo(() => {
        const chess = new Chess(puzzle.fen);
        if (puzzle.opponentMove) {
            chess.move({
                from: puzzle.opponentMove.slice(0, 2),
                to: puzzle.opponentMove.slice(2, 4),
                promotion:
                    puzzle.opponentMove.length > 4
                        ? puzzle.opponentMove[4]
                        : undefined,
            });
        }
        return chess.fen();
    }, [puzzle.fen, puzzle.opponentMove]);

    const chessRef = useRef(new Chess(initialFen));
    const processingRef = useRef(false);
    const moveNumberRef = useRef(0);

    // The player's color is explicit in the DTO — no inference needed.
    const playerColor: 'w' | 'b' = puzzle.playerColor;

    const [fen, setFen] = useState(initialFen);
    const [status, setStatus] = useState<GameStatus>('playing');
    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentTurn, setCurrentTurn] = useState<'w' | 'b'>(playerColor);
    const [moveNumber, setMoveNumber] = useState(0);

    const onPieceDrop: NonNullable<ChessboardOptions['onPieceDrop']> = useCallback(
        (args: PieceDropHandlerArgs) => {
            const { sourceSquare, targetSquare } = args;
            if (targetSquare === null) return false;
            if (processingRef.current) return false;
            if (chessRef.current.turn() !== playerColor) return false;

            // Attempt the move locally (UX-only legality check)
            const moveResult = chessRef.current.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // default promotion to queen
            });

            if (!moveResult) return false; // illegal move, piece snaps back

            // Build UCI string: from + to + optional promotion piece
            const uci =
                moveResult.from + moveResult.to + (moveResult.promotion ?? '');
            const currentMoveNumber = moveNumberRef.current;

            processingRef.current = true;
            setIsProcessing(true);
            setCurrentTurn(chessRef.current.turn() as 'w' | 'b');

            submitMove(puzzle.id, uci, currentMoveNumber)
                .then((response) => {
                    if (response.correct) {
                        setFen(chessRef.current.fen());
                        setStatus(response.solved ? 'solved' : 'correct');
                        setMessage(
                            response.solved ? 'Puzzle solved!' : 'Correct!',
                        );

                        // Apply opponent's forced reply if present
                        if (response.replyMove) {
                            const from = response.replyMove.slice(0, 2);
                            const to = response.replyMove.slice(2, 4);
                            const promotion =
                                response.replyMove.length > 4
                                    ? response.replyMove[4]
                                    : undefined;
                            chessRef.current.move({
                                from,
                                to,
                                promotion: (promotion as string) ?? 'q',
                            });
                            setFen(chessRef.current.fen());
                        }

                        moveNumberRef.current += 2;
                        setMoveNumber(moveNumberRef.current);
                        setCurrentTurn(chessRef.current.turn() as 'w' | 'b');
                    } else {
                        // Incorrect — undo the move, piece snaps back
                        chessRef.current.undo();
                        setFen(chessRef.current.fen());
                        setStatus('incorrect');
                        setMessage('Incorrect move, try again.');
                        setCurrentTurn(chessRef.current.turn() as 'w' | 'b');
                    }
                })
                .catch(() => {
                    // Network or validation error — undo
                    chessRef.current.undo();
                    setFen(chessRef.current.fen());
                    setStatus('incorrect');
                    setMessage('Failed to submit move. Try again.');
                    setCurrentTurn(chessRef.current.turn() as 'w' | 'b');
                })
                .finally(() => {
                    processingRef.current = false;
                    setIsProcessing(false);
                });

            // Return true so the piece stays visually on the board
            // while the backend validates. If incorrect, the FEN update
            // above will trigger a re-render and snap it back.
            return true;
        },
        [puzzle.id, playerColor],
    );

    return { fen, status, message, isProcessing, playerColor, currentTurn, moveNumber, onPieceDrop };
}
