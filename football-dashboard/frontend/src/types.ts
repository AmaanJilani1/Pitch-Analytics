export interface PlayerSummary {
  id: number
  name: string
  club: string
  league: string
  position: string
  age: number
  photo_url: string
  goals: number
  assists: number
  xg: number
  xag: number
  minutes: number
  market_value: number
  goals_per_90: number
  assists_per_90: number
}

export interface ValueHistoryPoint {
  date: string
  value: number
}

export interface StatCategory {
  [key: string]: number
}

export interface PlayerStats {
  attacking: StatCategory
  passing: StatCategory
  defending: StatCategory
  possession: StatCategory
  discipline: StatCategory
}

export interface RadarStats {
  [key: string]: number
}

export interface SimilarPlayer {
  id: number
  name: string
  club: string
  position: string
  similarity: number
  photo_url: string
}

export interface PlayerDetail {
  id: number
  name: string
  club: string
  league: string
  position: string
  age: number
  photo_url: string
  minutes: number
  market_value: number
  value_history: ValueHistoryPoint[]
  stats: PlayerStats
  radar: RadarStats
  similar_players: SimilarPlayer[]
}

export interface LeaguePositionSummary {
  count: number
  avg_goals_per_90: number
  avg_assists_per_90: number
  avg_xg_per_90: number
  avg_pass_completion: number
  avg_progressive_passes: number
  avg_tackles: number
  avg_market_value: number
}

export interface TopScorer {
  id: number
  name: string
  club: string
  goals: number
  photo_url: string
}

export interface LeagueSummary {
  total_players: number
  avg_age: number
  total_market_value: number
  by_position: Record<string, LeaguePositionSummary>
  top_scorers: TopScorer[]
  age_distribution: Record<string, number>
}
