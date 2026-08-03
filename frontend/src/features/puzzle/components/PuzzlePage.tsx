import { usePuzzle } from '../hooks/usePuzzle'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { PuzzleBoard } from './PuzzleBoard'
import { PuzzleDebug } from './PuzzleDebug'

export function PuzzlePage() {
    const { puzzle, isLoading, error } = usePuzzle()

    if (error) return <div className="p-4 text-red-600">Error: {error}</div>
    if (isLoading || !puzzle) return <div className="p-4">Loading...</div>

    return <PuzzleGame key={puzzle.id} puzzle={puzzle} />
}

function PuzzleGame({ puzzle }: { puzzle: NonNullable<ReturnType<typeof usePuzzle>['puzzle']> }) {
    const { fen, status, message, isProcessing, playerColor, currentTurn, moveNumber, onPieceDrop } =
        usePuzzleGame(puzzle)

    const isDraggable = status === 'playing' && !isProcessing

    return (
        <div className="flex flex-col items-center gap-4 px-4 py-8">
            <h2 className="text-xl font-bold">Puzzle {puzzle.id}</h2>
            <p className="text-sm text-gray-500">
                Rating: {puzzle.rating} &middot; Themes: {puzzle.themes}
            </p>

            <PuzzleBoard
                fen={fen}
                playerColor={playerColor}
                isDraggable={isDraggable}
                onPieceDrop={onPieceDrop}
            />

            {message && (
                <p
                    className={`text-lg font-semibold ${
                        status === 'incorrect'
                            ? 'text-red-600'
                            : status === 'solved'
                              ? 'text-green-600'
                              : 'text-blue-600'
                    }`}
                >
                    {message}
                </p>
            )}

            {status === 'incorrect' && (
                <p className="text-sm text-gray-400">Try a different move.</p>
            )}
            {status === 'solved' && (
                <button
                    className="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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