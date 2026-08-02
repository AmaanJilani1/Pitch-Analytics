import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { usePlayerData } from '@/hooks/usePlayerData'
import { usePlayers } from '@/hooks/usePlayers'
import { formatCurrency } from '@/lib/utils'
import PlayerRadarChart from '@/components/RadarChart'
import ValueTrendChart from '@/components/ValueTrendChart'
import ScrollReveal from '@/components/ScrollReveal'
import SEO from '@/components/SEO'

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const playerId = Number(id)
  const { players } = usePlayers()
  const summary = useMemo(() => players.find(p => p.id === playerId), [players, playerId])
  const { player, loading } = usePlayerData(playerId, summary)

  const [activeTab, setActiveTab] = useState<'attacking' | 'passing' | 'defending' | 'possession' | 'discipline'>('attacking')

  const similarPlayers = useMemo(() => {
    if (!summary) return []
    return players
      .filter(p => p.id !== summary.id && (p.position === summary.position || p.league === summary.league))
      .slice(0, 4)
  }, [players, summary])

  if (loading || !player) {
    return (
      <div className="space-y-8">
        <div className="h-64 rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] animate-pulse" />
        <div className="h-96 rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] animate-pulse" />
      </div>
    )
  }

  const statCategories = [
    { key: 'attacking', label: 'Attacking' },
    { key: 'passing', label: 'Passing' },
    { key: 'defending', label: 'Defending' },
    { key: 'possession', label: 'Possession' },
    { key: 'discipline', label: 'Discipline' },
  ] as const

  const currentStats = player.stats[activeTab] || {}
  const statEntries = Object.entries(currentStats)

  return (
    <div className="space-y-8">
      <SEO
        title={`${player.name} (${player.position}, ${player.club})`}
        description={`Full scouting report for ${player.name} (${player.position} at ${player.club}, ${player.league}). Market value: ${formatCurrency(player.market_value)}.`}
      />
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-lg border border-outline-variant text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Roster
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-8 items-end">
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="relative group">
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-xl bg-surface-container-low border border-surface-container-highest">
              <img
                src={player.photo_url}
                alt={player.name}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'
                }}
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white p-2.5 rounded-xl shadow-lg border border-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl fill-icon">sports_soccer</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-caps font-label-caps">
                {player.position}
              </span>
              <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-label-caps font-label-caps">
                {player.league}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-display text-on-surface mb-2 font-bold">{player.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-tertiary">
              <span className="flex items-center gap-1 font-body-lg text-body-lg">
                <span className="material-symbols-outlined text-[18px]">location_on</span> {player.club}
              </span>
              <span className="flex items-center gap-1 font-body-lg text-body-lg">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span> {player.age} Years Old
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-container-high">
          <p className="font-label-caps text-label-caps text-tertiary uppercase">Current Market Value</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-display text-primary font-bold">{formatCurrency(player.market_value)}</span>
            <span className="text-primary-container font-stat-sm text-stat-sm flex items-center bg-primary-container/10 px-2.5 py-1 rounded-full font-bold">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> Live
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to={`/compare?p1=${player.id}`}
              className="bg-primary text-white px-5 py-3 rounded-lg font-body-lg font-bold hover:bg-primary-container transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              Compare Athlete
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5 space-y-gutter">
          <ScrollReveal>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40 flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-label-caps text-label-caps text-tertiary">ATTRIBUTE RADAR PROFILE</h3>
                <span className="material-symbols-outlined text-outline-variant">info</span>
              </div>
              <PlayerRadarChart players={[player]} />
              <div className="mt-6 grid grid-cols-2 w-full gap-4">
                <div className="p-4 bg-surface-container-low rounded-lg">
                  <p className="text-label-caps font-label-caps text-tertiary mb-1">TOTAL GOALS</p>
                  <p className="text-stat-lg font-stat-lg text-primary">{summary?.goals || player.stats.attacking?.goals || 0}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-lg">
                  <p className="text-label-caps font-label-caps text-tertiary mb-1">TOTAL ASSISTS</p>
                  <p className="text-stat-lg font-stat-lg text-primary">{summary?.assists || player.stats.attacking?.assists || 0}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40">
              <h3 className="font-label-caps text-label-caps text-tertiary mb-6">VALUATION HISTORY</h3>
              <ValueTrendChart history={player.value_history} />
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-7 space-y-gutter">
          <ScrollReveal>
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40 overflow-hidden">
              <div className="border-b border-surface-container">
                <div className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6">
                  {statCategories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveTab(cat.key)}
                      className={`px-5 py-4 border-b-2 font-body-lg text-body-sm sm:text-body-lg whitespace-nowrap transition-colors ${
                        activeTab === cat.key
                          ? 'border-primary text-primary font-bold'
                          : 'border-transparent text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {statEntries.map(([key, value]) => {
                    const pct = Math.min(Math.max(typeof value === 'number' ? (value > 10 ? Math.min(value, 100) : value * 10) : 50, 10), 100)
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <div>
                          <p className="font-body-lg text-body-sm sm:text-body-lg text-on-surface font-semibold capitalize">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="text-body-sm text-tertiary text-xs">Season Metric</p>
                        </div>
                        <div className="text-right">
                          <p className="font-stat-lg text-stat-lg text-on-surface font-bold">
                            {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
                          </p>
                          <div className="w-28 sm:w-32 h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-surface-container grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <span className="block text-primary font-stat-lg text-stat-lg font-bold">{player.minutes.toLocaleString()}</span>
                    <span className="text-label-caps font-label-caps text-tertiary">MINUTES PLAYED</span>
                  </div>
                  <div className="text-center border-x border-surface-container">
                    <span className="block text-primary font-stat-lg text-stat-lg font-bold">{summary?.goals || 0}</span>
                    <span className="text-label-caps font-label-caps text-tertiary">SEASON GOALS</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-primary font-stat-lg text-stat-lg font-bold">{summary?.assists || 0}</span>
                    <span className="text-label-caps font-label-caps text-tertiary">SEASON ASSISTS</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40">
              <h3 className="font-label-caps text-label-caps text-tertiary mb-8">CAREER MILESTONES & RECENT PERFORMANCE</h3>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10" />
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h4 className="font-headline-md text-headline-md text-on-surface font-bold">{player.club}</h4>
                      <p className="text-primary font-bold">Current Contract • Primary Athlete</p>
                    </div>
                    <div className="md:text-right">
                      <span className="bg-surface-container-low px-3 py-1 rounded-full text-label-caps font-label-caps text-tertiary">2025/26 SEASON</span>
                    </div>
                  </div>
                  <p className="mt-2 text-tertiary text-body-sm leading-relaxed">
                    Key starter for {player.club} in {player.league}. Total valuation evaluated at {formatCurrency(player.market_value)}.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {similarPlayers.length > 0 && (
            <ScrollReveal delay={0.15}>
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40">
                <h3 className="font-label-caps text-label-caps text-tertiary mb-6">SIMILAR SCOUTING PROFILES</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarPlayers.map(sp => (
                    <Link
                      key={sp.id}
                      to={`/player/${sp.id}`}
                      className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-all border border-surface-container-high/30 flex flex-col items-center text-center group"
                    >
                      <img
                        src={sp.photo_url || 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'}
                        alt={sp.name}
                        className="w-14 h-14 rounded-full object-cover mb-2 border border-surface-container-highest"
                      />
                      <p className="font-body-sm font-bold text-on-surface truncate w-full group-hover:text-primary transition-colors">{sp.name}</p>
                      <p className="text-[11px] text-tertiary truncate w-full">{sp.club}</p>
                      <span className="mt-2 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {formatCurrency(sp.market_value)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  )
}
