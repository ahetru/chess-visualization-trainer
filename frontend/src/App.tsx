import { usePuzzle } from './features/puzzle/hooks/usePuzzle'
import { PuzzleBoard } from './features/puzzle/components/PuzzleBoard'

function App() {
  const { puzzle, isLoading, error } = usePuzzle()

  if (error) return <div>Error: {error}</div>
  if (isLoading || !puzzle) return <div>Loading...</div>

  return (
    <div>
      <h2>Puzzle {puzzle.id}</h2>
      <p>Rating: {puzzle.rating}</p>
      <p>Themes: {puzzle.themes}</p>
      <PuzzleBoard fen={puzzle.fen} />
    </div>
  )
}

export default App
