import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayers } from '@/hooks/usePlayers'
import { usePlayerData } from '@/hooks/usePlayerData'
import { formatCurrency } from '@/lib/utils'
import PlayerRadarChart from '@/components/RadarChart'
import ScrollReveal from '@/components/ScrollReveal'
import SEO from '@/components/SEO'

const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { players } = usePlayers()

  const p1Id = Number(searchParams.get('p1')) || (players[0]?.id || 1)
  const p2Id = Number(searchParams.get('p2')) || (players[1]?.id || 2)

  const summary1 = useMemo(() => players.find(p => p.id === p1Id), [players, p1Id])
  const summary2 = useMemo(() => players.find(p => p.id === p2Id), [players, p2Id])

  const { player: player1 } = usePlayerData(p1Id, summary1)
  const { player: player2 } = usePlayerData(p2Id, summary2)

  const [selecting, setSelecting] = useState<'p1' | 'p2' | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const qNorm = normalizeText(query || '')
    if (!qNorm) return players.slice(0, 12)
    return players.filter(p =>
      normalizeText(p.name).includes(qNorm) ||
      normalizeText(p.club).includes(qNorm)
    ).slice(0, 12)
  }, [players, query])

  const setPlayer = (slot: 'p1' | 'p2', id: number) => {
    const next = new URLSearchParams(searchParams)
    next.set(slot, String(id))
    setSearchParams(next)
    setSelecting(null)
    setQuery('')
  }

  const compareStats = () => {
    if (!player1 || !player2) return []
    const categories = ['attacking', 'passing', 'defending', 'possession', 'discipline'] as const
    const rows: { label: string; p1: number; p2: number; higher: 'p1' | 'p2' | 'tie' }[] = []

    categories.forEach(cat => {
      const s1 = player1.stats[cat]
      const s2 = player2.stats[cat]
      if (!s1 || !s2) return
      Object.keys(s1).forEach(key => {
        const v1 = s1[key]
        const v2 = s2[key]
        if (typeof v1 === 'number' && typeof v2 === 'number') {
          rows.push({
            label: key.replace(/_/g, ' '),
            p1: v1,
            p2: v2,
            higher: v1 > v2 ? 'p1' : v2 > v1 ? 'p2' : 'tie',
          })
        }
      })
    })

    return rows
  }

  const rows = compareStats()

  if (!player1 || !player2) {
    return (
      <div className="space-y-8">
        <div className="h-64 rounded-xl bg-surface-container-lowest animate-pulse" />
        <div className="h-96 rounded-xl bg-surface-container-lowest animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-gutter">
      <SEO
        title={`Compare ${player1.name} vs ${player2.name}`}
        description={`Head-to-head comparison matrix between ${player1.name} (${player1.club}) and ${player2.name} (${player2.club}) featuring dual radar charts and statistical leader metrics.`}
      />
      {/* Stitch VS Player Selector Header */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high/40 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          {/* Player 1 Card */}
          <div className="md:col-span-5 flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high/40">
            <div className="flex items-center gap-4">
              <img
                src={player1.photo_url}
                alt={player1.name}
                className="w-16 h-16 rounded-full object-cover border border-surface-container-highest"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'
                }}
              />
              <div>
                <span className="text-label-caps font-label-caps text-primary font-bold">{player1.position}</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate max-w-[180px]">{player1.name}</h3>
                <p className="text-body-sm text-tertiary">
                  <span className="font-bold text-primary">{formatCurrency(player1.market_value)}</span> • {player1.club} • {player1.age}yr
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelecting('p1')}
              className="p-2 hover:bg-surface-container rounded-full text-tertiary hover:text-primary transition-colors"
              title="Change Player 1"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          </div>

          {/* VS Badge */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-tertiary font-stat-sm font-bold flex items-center justify-center text-sm shadow-inner">
              VS
            </div>
          </div>

          {/* Player 2 Card */}
          <div className="md:col-span-5 flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high/40">
            <div className="flex items-center gap-4">
              <img
                src={player2.photo_url}
                alt={player2.name}
                className="w-16 h-16 rounded-full object-cover border border-surface-container-highest"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'
                }}
              />
              <div>
                <span className="text-label-caps font-label-caps text-secondary font-bold">{player2.position}</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate max-w-[180px]">{player2.name}</h3>
                <p className="text-body-sm text-tertiary">
                  <span className="font-bold text-primary">{formatCurrency(player2.market_value)}</span> • {player2.club} • {player2.age}yr
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelecting('p2')}
              className="p-2 hover:bg-surface-container rounded-full text-tertiary hover:text-primary transition-colors"
              title="Change Player 2"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Grid: Dual Radar & Statistical Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left: Dual Radar Comparison */}
        <div className="lg:col-span-6">
          <ScrollReveal>
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-surface-container-high/40 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] h-full flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-label-caps text-label-caps text-tertiary">PERFORMANCE PROFILE</h3>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {player1.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-secondary">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" /> {player2.name}
                  </span>
                </div>
              </div>
              <PlayerRadarChart players={[player1, player2]} />
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Statistical Breakdown Table */}
        <div className="lg:col-span-6">
          <ScrollReveal delay={0.1}>
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-surface-container-high/40 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="font-label-caps text-label-caps text-tertiary mb-6">STATISTICAL BREAKDOWN</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm">
                  <thead>
                    <tr className="border-b border-surface-container text-tertiary text-xs uppercase font-label-caps">
                      <th className="pb-3 font-semibold">Metric</th>
                      <th className="pb-3 text-right font-semibold">{player1.name.split(' ').pop()}</th>
                      <th className="pb-3 text-right font-semibold">{player2.name.split(' ').pop()}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-mono">
                    {rows.slice(0, 8).map(row => (
                      <tr key={row.label} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 capitalize text-on-surface font-sans">{row.label}</td>
                        <td className={`py-3 text-right font-bold ${row.higher === 'p1' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                          {row.p1}
                          {row.higher === 'p1' && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-sans">LEADER</span>}
                        </td>
                        <td className={`py-3 text-right font-bold ${row.higher === 'p2' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                          {row.p2}
                          {row.higher === 'p2' && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-sans">LEADER</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Advantage Summary Bento Cards */}
      <ScrollReveal delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="data-card p-6 border-l-4 border-l-primary border-surface-container-high/40">
            <span className="font-label-caps text-label-caps text-primary font-bold block mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">trending_up</span> PRIMARY ADVANTAGE
            </span>
            <h4 className="font-display text-2xl font-bold text-on-surface mb-1">
              {player1.market_value >= player2.market_value ? player1.name : player2.name}
            </h4>
            <p className="text-body-sm text-tertiary">
              Evaluated with total market valuation of {formatCurrency(Math.max(player1.market_value, player2.market_value))} in {player1.market_value >= player2.market_value ? player1.league : player2.league}.
            </p>
          </div>

          <div className="data-card p-6 border-l-4 border-l-secondary border-surface-container-high/40">
            <span className="font-label-caps text-label-caps text-secondary font-bold block mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">bolt</span> SECONDARY ADVANTAGE
            </span>
            <h4 className="font-display text-2xl font-bold text-on-surface mb-1">
              {player1.market_value < player2.market_value ? player1.name : player2.name}
            </h4>
            <p className="text-body-sm text-tertiary">
              Evaluated with total market valuation of {formatCurrency(Math.min(player1.market_value, player2.market_value))} in {player1.market_value < player2.market_value ? player1.league : player2.league}.
            </p>
          </div>

          <div className="data-card p-6 border border-surface-container-high/40">
            <span className="font-label-caps text-label-caps text-tertiary font-bold block mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">group_add</span> VALUATION PARITY
            </span>
            <h4 className="font-display text-2xl font-bold text-on-surface mb-1">
              {formatCurrency(Math.abs(player1.market_value - player2.market_value))}
            </h4>
            <p className="text-body-sm text-tertiary">
              Difference in evaluated transfer valuation between both athletes.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Athlete Selection Popover Modal */}
      <AnimatePresence>
        {selecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelecting(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-surface-container-high space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Select {selecting === 'p1' ? 'First' : 'Second'} Athlete
                </h3>
                <button
                  onClick={() => setSelecting(null)}
                  className="p-1 text-tertiary hover:text-on-surface rounded-full"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-tertiary">search</span>
                <input
                  type="text"
                  placeholder="Search player or club..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlayer(selecting, p.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-primary/10 transition-colors text-left border border-surface-container-high/30"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photo_url || 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-body-sm font-bold text-on-surface">{p.name}</p>
                        <p className="text-xs text-tertiary">{p.position} • {p.club}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      {formatCurrency(p.market_value)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
