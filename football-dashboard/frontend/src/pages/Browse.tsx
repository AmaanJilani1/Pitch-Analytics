import { useState, useMemo, useEffect, useRef } from 'react'
import { usePlayers } from '@/hooks/usePlayers'
import { useFilteredPlayers, Filters } from '@/hooks/useFilteredPlayers'
import FilterBar from '@/components/FilterBar'
import PlayerCard from '@/components/PlayerCard'
import AnimatedStatCounter from '@/components/AnimatedStatCounter'
import SEO from '@/components/SEO'

const PAGE_SIZE = 24

export default function Browse() {
  const { players, loading } = usePlayers()
  const [filters, setFilters] = useState<Filters>({
    search: '',
    leagues: [] as string[],
    positions: [] as string[],
    ageRange: [16, 40] as [number, number],
    clubs: [] as string[],
    sortBy: 'market_value',
  })

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const filtered = useFilteredPlayers(players, filters)
  const totalValue = useMemo(() => players.reduce((sum, p) => sum + p.market_value, 0), [players])

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters])

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: '200px' }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [filtered.length])

  const visiblePlayers = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-64 rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SEO
        title="Master Player Roster & Intelligence"
        description="Search, filter, and analyze 2,839+ professional football players across Europe's Top 5 leagues with market valuations and radar profiles."
      />
      {/* Stitch Hero Band */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 md:p-12 mb-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-high/40">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <span className="font-label-caps text-label-caps text-primary mb-3 block">PREMIUM SCOUTING PLATFORM</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-4 leading-tight">Master the Market</h2>
            <p className="font-body-lg text-body-lg text-tertiary max-w-md font-normal">
              Leverage advanced positional tracking and financial intelligence to identify undervalued talent across global top-flight leagues.
            </p>
          </div>

          {/* Stat Counters from Stitch JSON */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-surface-container-high">
            <div className="flex flex-col">
              <span className="font-stat-lg text-stat-lg text-primary font-bold">
                <AnimatedStatCounter value={players.length} />+
              </span>
              <span className="font-label-caps text-label-caps text-tertiary">Players Tracked</span>
            </div>
            <div className="flex flex-col">
              <span className="font-stat-lg text-stat-lg text-primary font-bold">5</span>
              <span className="font-label-caps text-label-caps text-tertiary font-bold">Leagues Covered</span>
            </div>
            <div className="flex flex-col col-span-2 md:col-span-1">
              <span className="font-stat-lg text-stat-lg text-primary font-bold">
                <AnimatedStatCounter value={totalValue / 1_000_000_000} suffix="B" prefix="€" decimals={1} />
              </span>
              <span className="font-label-caps text-label-caps text-tertiary font-bold">Total Valuation</span>
            </div>
          </div>
        </div>

        {/* Background Accent Gradient Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      </section>

      {/* Inline Filter Bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Roster Header Counter */}
      <div className="flex items-center justify-between px-1">
        <p className="font-body-sm text-body-sm text-tertiary">
          Showing <span className="text-on-surface font-stat-sm text-stat-sm font-bold">{visiblePlayers.length}</span> of <span className="text-on-surface font-stat-sm text-stat-sm font-bold">{filtered.length}</span> scouting profiles
        </p>
      </div>

      {/* Optimized Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {visiblePlayers.map((player, i) => (
          <PlayerCard key={player.id} player={player} index={i % 24} />
        ))}
      </div>

      {/* Infinite Scroll Trigger Sentinel */}
      {visibleCount < filtered.length && (
        <div ref={loaderRef} className="py-8 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length))}
            className="px-6 py-3 bg-surface-container-low border border-surface-container-high rounded-xl text-primary font-bold font-label-caps hover:bg-primary-container hover:text-white transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">expand_more</span>
            Load More Scouting Profiles ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
