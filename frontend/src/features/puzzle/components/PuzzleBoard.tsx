import { useMemo, useState, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { ChessboardOptions, PieceDropHandlerArgs, PieceHandlerArgs } from 'react-chessboard';

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

    // Compute legal move highlights for the selected piece only
    const squareStyles = useMemo(() => {
        const chess = new Chess(fen);
        const styles: Record<string, React.CSSProperties> = {};

        if (!selectedSquare) return styles;

        // Highlight the selected piece's square
        styles[selectedSquare] = { background: 'rgba(255, 255, 0, 0.35)' };

        // Show legal destinations from the selected square
        for (const move of chess.moves({ square: selectedSquare as Square, verbose: true })) {
            styles[move.to] = {
                background:
                    'radial-gradient(circle, rgba(0,0,0,0.2) 20%, transparent 40%)',
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

    const handlePieceClick = useCallback(
        ({ square }: PieceHandlerArgs) => {
            setSelectedSquare((prev) => (prev === square ? null : square));
        },
        [],
    );

    const options: ChessboardOptions = {
        position: fen,
        boardOrientation: playerColor === 'w' ? 'white' : 'black',
        allowDragging: isDraggable,
        onPieceDrop: handlePieceDrop,
        onPieceClick: handlePieceClick,
        boardStyle: { borderRadius: '4px' },
        squareStyles,
    };

    return (
        <div style={{ maxWidth: 480 }}>
            <Chessboard options={options} />
        </div>
    );
}
