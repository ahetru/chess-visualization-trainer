import { useEffect, useState } from 'react'
import './App.css'
import { getHello } from './api/hello.api'

function App() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getHello()
      .then(setMessage)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <div>Erreur: {error}</div>

  return <div>{message}</div>
}

export default App