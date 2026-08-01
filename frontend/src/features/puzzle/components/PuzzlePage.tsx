import { usePuzzle } from '../hooks/usePuzzle'
import { PuzzleBoard } from './PuzzleBoard'

export function PuzzlePage() {
    const { puzzle, isLoading, error } = usePuzzle()

    if (error) return <div>Error: {error}</div>
    if (isLoading || !puzzle) return <div>Loading...</div>

    return (
        <div className="px-4 py-8">
            <h2>Puzzle {puzzle.id}</h2>
            <p>Rating: {puzzle.rating}</p>
            <p>Themes: {puzzle.themes}</p>
            <PuzzleBoard fen={puzzle.fen} />
        </div>
    )
}
