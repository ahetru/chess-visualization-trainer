import { usePuzzle } from '../hooks/usePuzzle'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { PuzzleBoard } from './PuzzleBoard'
import { PuzzleDebug } from './PuzzleDebug'

export function PuzzlePage() {
    const { puzzle, isLoading, error } = usePuzzle()

    if (error) return <div className="p-4 text-[var(--accent-red)]">Error: {error}</div>
    if (isLoading || !puzzle) return <div className="p-4 text-dim">Loading...</div>

    return <PuzzleGame key={puzzle.id} puzzle={puzzle} />
}

function PuzzleGame({ puzzle }: { puzzle: NonNullable<ReturnType<typeof usePuzzle>['puzzle']> }) {
    const { fen, status, message, isProcessing, playerColor, currentTurn, moveNumber, onPieceDrop } =
        usePuzzleGame(puzzle)

    const isDraggable = status !== 'solved' && !isProcessing

    return (
        <div className="flex flex-col items-center gap-4 px-4 py-8">
            <PuzzleBoard
                fen={fen}
                playerColor={playerColor}
                isDraggable={isDraggable}
                onPieceDrop={onPieceDrop}
            />

            {message && (
                <p
                    className="text-lg font-medium"
                    style={{
                        color:
                            status === 'incorrect'
                                ? 'var(--accent-red)'
                                : status === 'solved'
                                  ? 'var(--accent-green)'
                                  : 'var(--accent)',
                    }}
                >
                    {message}
                </p>
            )}

            {status === 'incorrect' && (
                <p className="text-sm text-dim">Try a different move.</p>
            )}
            {status === 'solved' && (
                <button
                    className="btn-primary mt-2"
                    onClick={() => window.location.reload()}
                >
                    Next Puzzle
                </button>
            )}

            <PuzzleDebug
                puzzle={puzzle}
                playerColor={playerColor}
                currentTurn={currentTurn}
                moveNumber={moveNumber}
                status={status}
                fen={fen}
            />
        </div>
    )
}
