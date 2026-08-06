import type { Puzzle } from '../types/puzzle.types';
import type { GameStatus } from '../hooks/usePuzzleGame';

interface PuzzleDebugProps {
    puzzle: Puzzle;
    playerColor: 'w' | 'b';
    currentTurn: 'w' | 'b';
    moveNumber: number;
    status: GameStatus;
    fen: string;
}

export function PuzzleDebug({
    puzzle,
    playerColor,
    currentTurn,
    moveNumber,
    status,
    fen,
}: PuzzleDebugProps) {
    const solutionMoves = puzzle.solution.trim().split(/\s+/).filter(Boolean);

    return (
        <details className="mx-auto mt-4 w-full max-w-md rounded-[6px] border border-[var(--bg-alt)] bg-[var(--bg-alt)] text-xs">
            <summary className="cursor-pointer px-3 py-2 font-semibold text-dim select-none" style={{ fontFamily: 'var(--font-mono)' }}>
                Debug — Puzzle {puzzle.id}
            </summary>

            <div className="space-y-2 px-3 pb-3 leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
                <Row label="Rating" value={puzzle.rating} />
                <Row label="Themes" value={puzzle.themes} />

                <Row
                    label="Player (from DTO)"
                    value={
                        <span style={{ color: playerColor === 'w' ? 'var(--accent)' : 'var(--accent-red)' }}>
                            {playerColor === 'w' ? 'White' : 'Black'} (
                            {playerColor})
                        </span>
                    }
                />

                <Row
                    label="Turn (active color)"
                    value={
                        <span style={{ color: currentTurn === 'w' ? 'var(--accent)' : 'var(--accent-red)' }}>
                            {currentTurn === 'w' ? 'White' : 'Black'} (
                            {currentTurn})
                        </span>
                    }
                />

                <Row label="Status" value={status} />
                <Row label="Next move index" value={moveNumber} />

                <Row
                    label="Opponent blunder"
                    value={
                        puzzle.opponentMove ? (
                            puzzle.opponentMove
                        ) : (
                            <span className="text-dim">(none)</span>
                        )
                    }
                />

                <Row label="Current position (FEN)" value={fen} />

                <div>
                    <span className="font-semibold text-dim">
                        Solution ({solutionMoves.length} ply):
                    </span>
                    <ul className="mt-1 list-inside list-decimal space-y-0.5">
                        {solutionMoves.length === 0 && (
                            <li className="text-dim">(empty)</li>
                        )}
                        {solutionMoves.map((move, i) => (
                            <li
                                key={i}
                                style={{ color: i % 2 === 0 ? 'var(--accent)' : 'var(--accent-red)' }}
                            >
                                <span className="text-dim">[{i}]</span>{' '}
                                {move}
                                {i % 2 === 0 ? ' (player)' : ' (opponent)'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </details>
    );
}

function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode;
}) {
    return (
        <div>
            <span className="font-semibold text-dim">{label}:</span>{' '}
            {typeof value === 'string' ? (
                <code className="text-[11px] break-all">{value}</code>
            ) : (
                value
            )}
        </div>
    );
}
