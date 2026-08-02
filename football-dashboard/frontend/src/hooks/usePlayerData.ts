import { useState, useEffect } from 'react'
import { PlayerDetail, PlayerSummary } from '@/types'

function createFallbackPlayerDetail(summary: PlayerSummary): PlayerDetail {
  const g90 = summary.goals_per_90 || (summary.minutes > 0 ? (summary.goals / summary.minutes) * 90 : 0)
  const a90 = summary.assists_per_90 || (summary.minutes > 0 ? (summary.assists / summary.minutes) * 90 : 0)

  const attackScore = Math.min(Math.max(Math.round(g90 * 120 + summary.goals * 3 + 40), 20), 99)
  const passingScore = Math.min(Math.max(Math.round(a90 * 110 + summary.assists * 4 + 45), 20), 99)
  const defenseScore = summary.position === 'DF' ? 88 : summary.position === 'MF' ? 68 : 35
  const physicalScore = Math.min(Math.max(Math.round(60 + (summary.minutes / 3000) * 30), 30), 95)
  const dribbleScore = Math.min(Math.max(Math.round(passingScore * 0.9 + 10), 25), 95)

  return {
    id: summary.id,
    name: summary.name,
    club: summary.club,
    league: summary.league,
    position: summary.position,
    age: summary.age,
    photo_url: summary.photo_url || 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1',
    minutes: summary.minutes,
    market_value: summary.market_value,
    value_history: [
      { date: '2023-01', value: Math.round(summary.market_value * 0.6) },
      { date: '2024-01', value: Math.round(summary.market_value * 0.8) },
      { date: '2025-01', value: summary.market_value },
    ],
    stats: {
      attacking: {
        goals: summary.goals,
        assists: summary.assists,
        goals_per_90: Number(g90.toFixed(2)),
        assists_per_90: Number(a90.toFixed(2)),
        xg: summary.xg || Number((g90 * 0.9).toFixed(2)),
      },
      passing: {
        key_passes: Math.round(summary.assists * 2.5 + 10),
        pass_accuracy: summary.position === 'MF' ? 88 : summary.position === 'DF' ? 85 : 78,
      },
      defending: {
        tackles_won: summary.position === 'DF' ? 32 : 12,
        interceptions: summary.position === 'DF' ? 28 : 8,
      },
      possession: {
        touches: Math.round((summary.minutes / 90) * 55),
        dribbles_completed: Math.round(summary.assists * 1.8 + 5),
      },
      discipline: {
        yellow_cards: summary.position === 'DF' ? 4 : 2,
        red_cards: 0,
      },
    },
    radar: {
      goals: attackScore,
      assists: passingScore,
      xg: Math.min(Math.round((summary.xg || g90) * 100), 99),
      passing: passingScore,
      progression: dribbleScore,
      defense: defenseScore,
      possession: Math.min(Math.round((passingScore + dribbleScore) / 2), 95),
      aerial: summary.position === 'DF' || summary.position === 'FW' ? 82 : physicalScore,
    },
    similar_players: [],
  }
}

export function usePlayerData(id: number | null, summary?: PlayerSummary) {
  const [player, setPlayer] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/data/player_details/${id}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Detail JSON not found')
        return res.json()
      })
      .then((data: PlayerDetail) => {
        setPlayer(data)
        setLoading(false)
      })
      .catch(() => {
        if (summary) {
          setPlayer(createFallbackPlayerDetail(summary))
        } else {
          setError('Player detail unavailable')
        }
        setLoading(false)
      })
  }, [id, summary])

  return { player, loading, error }
}
