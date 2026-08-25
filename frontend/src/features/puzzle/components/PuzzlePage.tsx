import { useEffect, useRef, useState } from 'react'
import { usePuzzle } from '../hooks/usePuzzle'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { PuzzleBoard } from './PuzzleBoard'
import { MoveHistory } from './MoveHistory'
import { Spinner } from '../../../components/ui/Spinner'

export function PuzzlePage() {
    const { puzzle, isLoading, error, loadNext } = usePuzzle()

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
                <p className="text-[var(--accent-red)]">Error: {error}</p>
                <button className="btn-ghost" onClick={loadNext}>
                    Retry
                </button>
            </div>
        )
    }

    if (isLoading || !puzzle) {
        return (
            <div role="status" className="flex flex-col items-center gap-3 px-4 py-16">
                <Spinner className="h-6 w-6" />
                <p className="text-dim">Loading puzzle…</p>
            </div>
        )
    }

    return <PuzzleGame key={puzzle.id} puzzle={puzzle} onNext={loadNext} />
}

function PuzzleGame({
    puzzle,
    onNext,
}: {
    puzzle: NonNullable<ReturnType<typeof usePuzzle>['puzzle']>
    onNext: () => void
}) {
    const { fen, status, message, isProcessing, playerColor, history, onPieceDrop } =
        usePuzzleGame(puzzle)

    const isDraggable = status !== 'solved' && !isProcessing
    const lastMove = history.length > 0 ? history[history.length - 1] : null

    const [shakeCount, setShakeCount] = useState(0)
    const prevStatusRef = useRef(status)

    useEffect(() => {
        if (status === 'incorrect' && prevStatusRef.current !== 'incorrect') {
            setShakeCount((n) => n + 1)
        }
        prevStatusRef.current = status
    }, [status])

    return (
        <div className="flex flex-col items-center gap-4 px-4 py-8">
            <div
                key={shakeCount}
                className={status === 'incorrect' ? 'board-shake' : undefined}
            >
                <PuzzleBoard
                    fen={fen}
                    playerColor={playerColor}
                    isDraggable={isDraggable}
                    onPieceDrop={onPieceDrop}
                    lastMove={lastMove}
                />
            </div>

            {isProcessing ? (
                <div role="status" className="flex items-center gap-2 text-dim">
                    <Spinner className="h-4 w-4" />
                    <span>Checking…</span>
                </div>
            ) : message ? (
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
            ) : null}

            <MoveHistory history={history} />

            {status === 'incorrect' && (
                <p className="text-sm text-dim">Try a different move.</p>
            )}
            {status === 'solved' && (
                <button
                    className="btn-primary mt-2"
                    onClick={onNext}
                    disabled={isProcessing}
                >
                    Next Puzzle
                </button>
            )}
        </div>
    )
}
