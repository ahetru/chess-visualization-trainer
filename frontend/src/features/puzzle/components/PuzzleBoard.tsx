import { useMemo, useState, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { ChessboardOptions, PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';

interface PuzzleBoardProps {
    fen: string;
    playerColor: 'w' | 'b';
    isDraggable: boolean;
    onPieceDrop: ChessboardOptions['onPieceDrop'];
}

export function PuzzleBoard({
    fen,
    playerColor,
    isDraggable,
    onPieceDrop,
}: PuzzleBoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    const squareStyles = useMemo(() => {
        const chess = new Chess(fen);
        const styles: Record<string, React.CSSProperties> = {};

        if (!selectedSquare) return styles;

        styles[selectedSquare] = { background: 'var(--board-highlight)' };

        for (const move of chess.moves({ square: selectedSquare as Square, verbose: true })) {
            styles[move.to] = {
                background:
                    'radial-gradient(circle, var(--board-legal) 20%, transparent 40%)',
            };
        }

        return styles;
    }, [fen, selectedSquare]);

    const handlePieceDrop = useCallback(
        (args: PieceDropHandlerArgs) => {
            setSelectedSquare(null);
            return onPieceDrop?.(args) ?? false;
        },
        [onPieceDrop],
    );

    const handleSquareClick = useCallback(
        ({ piece, square }: SquareHandlerArgs) => {
            if (!piece) {
                setSelectedSquare(null);
            } else {
                setSelectedSquare((prev) => (prev === square ? null : square));
            }
        },
        [],
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
