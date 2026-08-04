import { useState, useEffect } from 'react'
import { PlayerSummary } from '@/types'

// Module-level in-memory cache to prevent refetching and route navigation locks
let cachedPlayers: PlayerSummary[] | null = null
let fetchPromise: Promise<PlayerSummary[]> | null = null

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerSummary[]>(cachedPlayers || [])
  const [loading, setLoading] = useState<boolean>(!cachedPlayers)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If dataset is already loaded in memory, return immediately
    if (cachedPlayers) {
      setPlayers(cachedPlayers)
      setLoading(false)
      return
    }

    // Deduplicate network request if a fetch is already in flight
    if (!fetchPromise) {
      fetchPromise = fetch('/data/players.json')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load players dataset')
          return res.json()
        })
        .then((data: PlayerSummary[]) => {
          cachedPlayers = data
          return data
        })
        .catch(err => {
          fetchPromise = null // Reset on error to allow retries
          throw err
        })
    }

    fetchPromise
      .then(data => {
        setPlayers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Error loading players')
        setLoading(false)
      })
  }, [])

  return { players, loading, error }
}
