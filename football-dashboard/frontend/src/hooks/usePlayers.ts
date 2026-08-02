import { useState, useEffect } from 'react'
import { PlayerSummary } from '@/types'

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/players.json')
      .then(res => res.json())
      .then((data: PlayerSummary[]) => {
        setPlayers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { players, loading, error }
}
