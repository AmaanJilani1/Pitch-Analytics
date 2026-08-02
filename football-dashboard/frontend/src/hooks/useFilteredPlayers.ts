import { useMemo } from 'react'
import { PlayerSummary } from '@/types'

export interface Filters {
  search: string
  leagues: string[]
  positions: string[]
  ageRange: [number, number]
  clubs: string[]
  sortBy?: 'market_value' | 'goals' | 'assists' | 'minutes' | 'name'
}

const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function useFilteredPlayers(players: PlayerSummary[], filters: Filters) {
  return useMemo(() => {
    const searchNormalized = normalizeText(filters.search || '')

    const filtered = players.filter(p => {
      const nameNorm = normalizeText(p.name)
      const clubNorm = normalizeText(p.club)

      const matchesSearch = !searchNormalized || 
        nameNorm.includes(searchNormalized) ||
        clubNorm.includes(searchNormalized)

      const matchesLeague = filters.leagues.length === 0 || filters.leagues.includes(p.league)
      const matchesPosition = filters.positions.length === 0 || filters.positions.includes(p.position)
      const matchesAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1]
      const matchesClub = filters.clubs.length === 0 || filters.clubs.includes(p.club)

      return matchesSearch && matchesLeague && matchesPosition && matchesAge && matchesClub
    })

    const sortBy = filters.sortBy || 'market_value'
    return [...filtered].sort((a, b) => {
      if (sortBy === 'goals') return b.goals - a.goals || b.market_value - a.market_value
      if (sortBy === 'assists') return b.assists - a.assists || b.market_value - a.market_value
      if (sortBy === 'minutes') return b.minutes - a.minutes
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.market_value - a.market_value
    })
  }, [players, filters])
}
