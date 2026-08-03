import { useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { ChessboardOptions } from 'react-chessboard';

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
    // Compute legal move highlights
    const squareStyles = useMemo(() => {
        const chess = new Chess(fen);
        const styles: Record<string, React.CSSProperties> = {};
        const highlightColor = 'rgba(255, 255, 0, 0.35)';

        for (const move of chess.moves({ verbose: true })) {
            styles[move.from] = { background: highlightColor };
            styles[move.to] = {
                background:
                    'radial-gradient(circle, rgba(0,0,0,0.2) 20%, transparent 40%)',
            };
        }

        return styles;
    }, [fen]);

    const options: ChessboardOptions = {
        position: fen,
        boardOrientation: playerColor === 'w' ? 'white' : 'black',
        allowDragging: isDraggable,
        onPieceDrop,
        boardStyle: { borderRadius: '4px' },
        squareStyles,
    };

    return (
        <div style={{ maxWidth: 480 }}>
            <Chessboard options={options} />
        </div>
    );
}
