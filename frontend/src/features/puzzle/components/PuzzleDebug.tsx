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
        <details className="mx-auto mt-4 w-full max-w-md rounded border border-gray-300 bg-gray-50 text-xs">
            <summary className="cursor-pointer px-3 py-2 font-mono font-semibold text-gray-600 select-none">
                Debug — Puzzle {puzzle.id}
            </summary>

            <div className="space-y-2 px-3 pb-3 font-mono leading-relaxed">
                <Row label="Rating" value={puzzle.rating} />
                <Row label="Themes" value={puzzle.themes} />

                <Row
                    label="Player (from DTO)"
                    value={
                        <span
                            className={
                                playerColor === 'w'
                                    ? 'text-blue-600'
                                    : 'text-red-600'
                            }
                        >
                            {playerColor === 'w' ? 'White' : 'Black'} (
                            {playerColor})
                        </span>
                    }
                />

                <Row
                    label="Turn (active color)"
                    value={
                        <span
                            className={
                                currentTurn === 'w'
                                    ? 'text-blue-600'
                                    : 'text-red-600'
                            }
                        >
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
                            <span className="text-gray-400">(none)</span>
                        )
                    }
                />

                <Row label="Current position (FEN)" value={fen} />

                <div>
                    <span className="font-semibold text-gray-500">
                        Solution ({solutionMoves.length} ply):
                    </span>
                    <ul className="mt-1 list-inside list-decimal space-y-0.5">
                        {solutionMoves.length === 0 && (
                            <li className="text-gray-400">(empty)</li>
                        )}
                        {solutionMoves.map((move, i) => (
                            <li
                                key={i}
                                className={
                                    i % 2 === 0
                                        ? 'text-blue-600'
                                        : 'text-red-600'
                                }
                            >
                                <span className="text-gray-400">[{i}]</span>{' '}
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
            <span className="font-semibold text-gray-500">{label}:</span>{' '}
            {typeof value === 'string' ? (
                <code className="text-[11px] break-all">{value}</code>
            ) : (
                value
            )}
        </div>
    );
}