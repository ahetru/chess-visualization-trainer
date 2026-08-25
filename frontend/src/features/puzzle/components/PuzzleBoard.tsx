import { useMemo, useState, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { ChessboardOptions, PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';

interface PuzzleBoardProps {
    fen: string;
    playerColor: 'w' | 'b';
    isDraggable: boolean;
    onPieceDrop: ChessboardOptions['onPieceDrop'];
    lastMove?: { from: string; to: string } | null;
}

export function PuzzleBoard({
    fen,
    playerColor,
    isDraggable,
    onPieceDrop,
    lastMove,
}: PuzzleBoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    const squareStyles = useMemo(() => {
        const chess = new Chess(fen);
        const styles: Record<string, React.CSSProperties> = {};

        if (lastMove) {
            styles[lastMove.from] = { background: 'var(--board-last-move)' };
            styles[lastMove.to] = { background: 'var(--board-last-move)' };
        }

        if (selectedSquare) {
            styles[selectedSquare] = { background: 'var(--board-highlight)' };

            for (const move of chess.moves({ square: selectedSquare as Square, verbose: true })) {
                styles[move.to] = {
                    background:
                        'radial-gradient(circle, var(--board-legal) 20%, transparent 40%)',
                };
            }
        }

        if (chess.inCheck()) {
            const king = chess.findPiece({ type: 'k', color: chess.turn() })[0];
            if (king) {
                styles[king] = { background: 'var(--board-check)' };
            }
        }

        return styles;
    }, [fen, selectedSquare, lastMove]);

    const handlePieceDrop = useCallback(
        (args: PieceDropHandlerArgs) => {
            setSelectedSquare(null);
            return onPieceDrop?.(args) ?? false;
        },
        [onPieceDrop],
    );

    const handleSquareClick = useCallback(
        ({ piece, square }: SquareHandlerArgs) => {
            if (selectedSquare) {
                const chess = new Chess(fen);
                const isLegalTarget = chess
                    .moves({ square: selectedSquare as Square, verbose: true })
                    .some((move) => move.to === square);

                if (isLegalTarget) {
                    const movedPiece = chess.get(selectedSquare as Square);
                    handlePieceDrop({
                        piece: {
                            isSparePiece: false,
                            position: selectedSquare,
                            pieceType: movedPiece?.type ?? 'p',
                        },
                        sourceSquare: selectedSquare,
                        targetSquare: square,
                    });
                    return;
                }
            }

            if (!piece) {
                setSelectedSquare(null);
            } else {
                setSelectedSquare((prev) => (prev === square ? null : square));
            }
        },
        [fen, selectedSquare, handlePieceDrop],
    );

    const options: ChessboardOptions = {
        position: fen,
        boardOrientation: playerColor === 'w' ? 'white' : 'black',
        allowDragging: isDraggable,
        onPieceDrop: handlePieceDrop,
        onSquareClick: handleSquareClick,
        boardStyle: { borderRadius: String('var(--radius)') },
        darkSquareStyle: { backgroundColor: 'var(--board-dark)' },
        lightSquareStyle: { backgroundColor: 'var(--board-light)' },
        squareStyles,
    };

    return (
        <div style={{ maxWidth: 560 }}>
            <Chessboard options={options} />
        </div>
    );
}
