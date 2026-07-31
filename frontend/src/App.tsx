import { useEffect, useState } from 'react'
import './App.css'
import { getRandomPuzzle } from './api/puzzle.api'
import type { Puzzle } from './api/puzzle.api'

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRandomPuzzle()
      .then(setPuzzle)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <div>Error: {error}</div>
  if (!puzzle) return <div>Loading...</div>

  return (
    <div>
      <h2>Puzzle {puzzle.id}</h2>
      <p>Rating: {puzzle.rating}</p>
      <p>Themes: {puzzle.themes}</p>
      <p>FEN: {puzzle.fen}</p>
      <p>Moves: {puzzle.moves}</p>
    </div>
  )
}

export default App
