import { useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface PuzzleBoardProps {
    fen: string;
}

export function PuzzleBoard({ fen }: PuzzleBoardProps) {
    const position = useMemo(() => {
        const chess = new Chess(fen);
        return chess.fen();
    }, [fen]);

    return (
        <div style={{ maxWidth: 480 }}>
            <Chessboard options={{ position, allowDragging: false }} />
        </div>
    );
}
