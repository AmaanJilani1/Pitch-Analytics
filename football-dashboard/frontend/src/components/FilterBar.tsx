import { useMemo } from 'react'
import { Filters } from '@/hooks/useFilteredPlayers'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const leagues = [
  { label: 'All Leagues', value: '' },
  { label: 'Premier League', value: 'Premier League' },
  { label: 'La Liga', value: 'La Liga' },
  { label: 'Bundesliga', value: 'Bundesliga' },
  { label: 'Serie A', value: 'Serie A' },
  { label: 'Ligue 1', value: 'Ligue 1' },
]

const positions = [
  { label: 'All Positions', value: '' },
  { label: 'Forward (FW)', value: 'FW' },
  { label: 'Midfielder (MF)', value: 'MF' },
  { label: 'Defender (DF)', value: 'DF' },
  { label: 'Goalkeeper (GK)', value: 'GK' },
]

const ageRanges: { label: string; value: [number, number] }[] = [
  { label: 'All Ages', value: [16, 40] },
  { label: 'Under 21 (U21)', value: [16, 21] },
  { label: '22 - 25 yrs', value: [22, 25] },
  { label: '26 - 29 yrs', value: [26, 29] },
  { label: '30+ yrs', value: [30, 40] },
]

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const selectedLeague = filters.leagues[0] || ''
  const selectedPosition = filters.positions[0] || ''

  const selectedAgeKey = useMemo(() => {
    const [min, max] = filters.ageRange
    const match = ageRanges.find(r => r.value[0] === min && r.value[1] === max)
    return match ? JSON.stringify(match.value) : JSON.stringify([16, 40])
  }, [filters.ageRange])

  const update = (partial: Partial<Filters>) => {
    onChange({ ...filters, ...partial })
  }

  // Security: Sanitize search input against XSS
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[<>]/g, '')
    update({ search: sanitized })
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-4 mb-8 flex flex-wrap items-center gap-4 border border-surface-container-high">
      {/* Search Input with Security Sanitization */}
      <div className="flex-1 min-w-[240px] relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
        <input
          type="text"
          placeholder="Search player name, club, or league..."
          value={filters.search}
          onChange={handleSearchChange}
          maxLength={100}
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary font-body-sm text-body-sm transition-all outline-none text-on-surface"
        />
        {filters.search && (
          <button
            onClick={() => update({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* League Dropdown */}
        <div className="relative">
          <select
            value={selectedLeague}
            onChange={e => update({ leagues: e.target.value ? [e.target.value] : [] })}
            className="appearance-none bg-surface-container-low border-none rounded-lg pl-4 pr-10 py-3 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary cursor-pointer transition-all"
          >
            {leagues.map(l => (
              <option key={l.label} value={l.value}>{l.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
        </div>

        {/* Position Dropdown */}
        <div className="relative">
          <select
            value={selectedPosition}
            onChange={e => update({ positions: e.target.value ? [e.target.value] : [] })}
            className="appearance-none bg-surface-container-low border-none rounded-lg pl-4 pr-10 py-3 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary cursor-pointer transition-all"
          >
            {positions.map(p => (
              <option key={p.label} value={p.value}>{p.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
        </div>

        {/* Age Range Dropdown */}
        <div className="relative">
          <select
            value={selectedAgeKey}
            onChange={e => update({ ageRange: JSON.parse(e.target.value) })}
            className="appearance-none bg-surface-container-low border-none rounded-lg pl-4 pr-10 py-3 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary cursor-pointer transition-all"
          >
            {ageRanges.map(a => (
              <option key={a.label} value={JSON.stringify(a.value)}>{a.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
        </div>

        {/* Reset / Apply Filters Button */}
        {(filters.search || selectedLeague || selectedPosition || filters.ageRange[0] !== 16 || filters.ageRange[1] !== 40) ? (
          <button
            onClick={() => onChange({ search: '', leagues: [], positions: [], ageRange: [16, 40], clubs: [] })}
            className="bg-tertiary text-white px-5 py-3 rounded-lg font-label-caps text-label-caps hover:bg-tertiary-container transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reset Filters
          </button>
        ) : (
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Apply Filters
          </button>
        )}
      </div>
    </div>
  )
}
