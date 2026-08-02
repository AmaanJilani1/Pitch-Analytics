import { useEffect, useState } from 'react'
import { LeagueSummary } from '@/types'
import { formatCurrency } from '@/lib/utils'
import ScrollReveal from '@/components/ScrollReveal'
import SEO from '@/components/SEO'

export default function Insights() {
  const [data, setData] = useState<Record<string, LeagueSummary> | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<'performance' | 'financials' | 'overview'>('performance')

  useEffect(() => {
    fetch('/data/league_summaries.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)] animate-pulse" />
        ))}
      </div>
    )
  }

  const leagues = Object.keys(data)

  const topScorersData = leagues.map(league => ({
    league: league.toUpperCase(),
    goals: data[league].top_scorers[0]?.goals || 0,
    player: data[league].top_scorers[0]?.name || '',
    pct: Math.min(Math.round(((data[league].top_scorers[0]?.goals || 0) / 36) * 100), 100),
  }))

  const financialSummary = leagues.map(league => ({
    league: league.toUpperCase(),
    totalVal: data[league].total_market_value || 0,
    playersCount: data[league].total_players || 0,
    avgAge: data[league].avg_age || 0,
  }))

  return (
    <div className="flex gap-gutter">
      <SEO
        title="League Intelligence & Analytics"
        description="Comprehensive scouting insights, goal leader benchmarks, positional workloads, and financial valuation metrics across Europe's top 5 football leagues."
      />
      {/* Stitch Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col py-6 px-4 gap-3 bg-surface-container-lowest w-64 rounded-xl h-fit sticky top-28 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-surface-container-high/40 shrink-0">
        <div className="px-3 mb-2">
          <h3 className="font-label-caps text-label-caps text-tertiary">ANALYTICS ENGINE</h3>
        </div>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeSubTab === 'overview'
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-tertiary hover:bg-surface-container-high hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-caps text-label-caps uppercase">Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('performance')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeSubTab === 'performance'
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-tertiary hover:bg-surface-container-high hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            <span className="font-label-caps text-label-caps uppercase">Performance</span>
          </button>

          <button
            onClick={() => setActiveSubTab('financials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeSubTab === 'financials'
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-tertiary hover:bg-surface-container-high hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-label-caps text-label-caps uppercase">Financials</span>
          </button>
        </nav>
      </aside>

      {/* Main Insights Content */}
      <div className="flex-1 space-y-gutter">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-on-surface">League Intelligence & Performance Metrics</h1>
            <p className="text-on-surface-variant text-body-sm sm:text-body-lg mt-1 max-w-2xl">
              A comprehensive analysis of current trends across top-tier divisions, athlete age-performance curves, and positional efficiency benchmarks.
            </p>
          </div>

          {/* Subtab Pill Bar for Mobile */}
          <div className="flex lg:hidden bg-surface-container-low p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold font-label-caps ${
                activeSubTab === 'overview' ? 'bg-primary text-white' : 'text-tertiary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('performance')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold font-label-caps ${
                activeSubTab === 'performance' ? 'bg-primary text-white' : 'text-tertiary'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveSubTab('financials')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold font-label-caps ${
                activeSubTab === 'financials' ? 'bg-primary text-white' : 'text-tertiary'
              }`}
            >
              Financials
            </button>
          </div>
        </div>

        {/* Dynamic Subtab Rendering */}
        {activeSubTab === 'overview' && (
          <div className="space-y-gutter">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {financialSummary.slice(0, 3).map(f => (
                  <div key={f.league} className="data-card p-6 border border-surface-container-high/40">
                    <span className="font-label-caps text-label-caps text-primary font-bold block mb-1">{f.league}</span>
                    <span className="font-stat-lg text-3xl font-bold text-on-surface block">{formatCurrency(f.totalVal)}</span>
                    <p className="text-body-sm text-tertiary mt-2">{f.playersCount} Athletes • Avg Age {f.avgAge.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="data-card p-6 sm:p-8">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">League Macro Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm">
                    <thead>
                      <tr className="border-b border-surface-container-highest text-tertiary text-xs uppercase font-label-caps">
                        <th className="py-3 px-4">Division</th>
                        <th className="py-3 px-4">Active Players</th>
                        <th className="py-3 px-4">Average Age</th>
                        <th className="py-3 px-4">Total Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-mono">
                      {financialSummary.map(f => (
                        <tr key={f.league} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3.5 px-4 font-bold text-on-surface font-sans">{f.league}</td>
                          <td className="py-3.5 px-4 text-on-surface">{f.playersCount}</td>
                          <td className="py-3.5 px-4 text-on-surface">{f.avgAge.toFixed(1)} yrs</td>
                          <td className="py-3.5 px-4 font-bold text-primary">{formatCurrency(f.totalVal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {activeSubTab === 'performance' && (
          <div className="space-y-gutter">
            {/* Section 1: Top Scorers by League (Horizontal Progress Volume Bars) */}
            <ScrollReveal>
              <section className="data-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Top Goal Leader Benchmark by League</h2>
                    <p className="text-body-sm font-body-sm text-tertiary">Comparison of top goal production across the top 5 European divisions.</p>
                  </div>
                  <span className="bg-primary-container/10 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps font-bold shrink-0">
                    LIVE DATA
                  </span>
                </div>

                <div className="space-y-6">
                  {topScorersData.map(item => (
                    <div key={item.league} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-label-caps text-label-caps text-on-surface font-bold">{item.league} — {item.player}</span>
                        <span className="font-stat-sm text-stat-sm text-primary font-bold">{item.goals} GOALS</span>
                      </div>
                      <div className="h-9 bg-surface-container w-full rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000 flex items-center justify-end pr-4 text-white text-xs font-bold font-mono"
                          style={{ width: `${item.pct}%` }}
                        >
                          {item.goals}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-body-sm font-body-sm text-tertiary italic">
                    The Premier League and Bundesliga exhibit the highest scoring frequency per match, driven by high offensive tempo and top-tier clinical efficiency.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Section 2: Positional Workload Benchmark */}
            <ScrollReveal delay={0.1}>
              <section className="data-card p-6 sm:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Average Workload & Metrics by Position</h2>
                    <p className="text-body-sm font-body-sm text-tertiary">Positional workload metrics across distance covered and pass accuracy.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-sm" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant font-bold">DISTANCE (KM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary-container rounded-sm" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant font-bold">PASS ACCURACY (%)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                  {[
                    { pos: 'FORWARD', dist: '9.2 km', distPct: 65, pass: '78.5%', passPct: 78 },
                    { pos: 'MIDFIELDER', dist: '12.4 km', distPct: 95, pass: '88.2%', passPct: 88 },
                    { pos: 'DEFENDER', dist: '10.1 km', distPct: 72, pass: '85.4%', passPct: 85 },
                    { pos: 'GOALKEEPER', dist: '4.5 km', distPct: 35, pass: '74.1%', passPct: 74 },
                  ].map(item => (
                    <div key={item.pos} className="flex flex-col items-center">
                      <div className="flex items-end h-56 gap-3 w-full justify-center">
                        <div className="w-10 sm:w-12 bg-primary rounded-t-md relative group transition-all" style={{ height: `${item.distPct}%` }}>
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                            {item.dist}
                          </div>
                        </div>
                        <div className="w-10 sm:w-12 bg-secondary-container rounded-t-md relative group transition-all" style={{ height: `${item.passPct}%` }}>
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                            {item.pass}
                          </div>
                        </div>
                      </div>
                      <span className="mt-4 font-label-caps text-label-caps text-on-surface font-bold">{item.pos}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-surface-container-low rounded-lg">
                  <p className="text-body-sm font-body-sm text-tertiary">
                    Analysis indicates that modern <span className="font-bold text-on-surface">Midfielders</span> balance the highest combined volume of physical output and technical accuracy.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Section 3: Age Distribution & Peak Performance Histogram */}
            <ScrollReveal delay={0.15}>
              <section className="data-card p-6 sm:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Age Distribution & Peak Performance</h2>
                    <p className="text-body-sm font-body-sm text-tertiary">Frequency of elite-level performances categorized by athlete biological age.</p>
                  </div>
                  <div className="bg-surface-container-highest px-3 py-1 rounded-md">
                    <span className="font-label-caps text-label-caps text-on-surface font-bold">GLOBAL POOL: 2,839 ATHLETES</span>
                  </div>
                </div>

                <div className="flex items-end h-64 w-full gap-1 border-b border-outline-variant/30 pb-1">
                  {[15, 22, 35, 48, 62, 85, 95, 100, 92, 80, 65, 55, 45, 32, 25, 18, 12].map((height, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 transition-colors relative ${
                        idx === 7 ? 'bg-primary' : 'bg-primary/30 hover:bg-primary'
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      {idx === 7 && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded-full whitespace-nowrap">PEAK AGE</span>
                          <div className="w-0.5 h-3 bg-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-label-caps font-label-caps text-tertiary font-bold">
                  <span>18 YEARS</span>
                  <span>25 YEARS (PRIME OPTIMUM)</span>
                  <span>35+ YEARS</span>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-outline-variant/30 rounded-xl">
                    <span className="font-label-caps text-label-caps text-tertiary block mb-1">DEVELOPMENT PHASE</span>
                    <span className="font-stat-lg text-stat-lg text-on-surface font-bold">18 - 22</span>
                    <p className="text-body-sm font-body-sm text-tertiary mt-1">High physical plasticity and rapid metric progression.</p>
                  </div>

                  <div className="p-4 border-2 border-primary/30 bg-primary/5 rounded-xl">
                    <span className="font-label-caps text-label-caps text-primary block mb-1 font-bold">PRIME WINDOW</span>
                    <span className="font-stat-lg text-stat-lg text-primary font-bold">24 - 28</span>
                    <p className="text-body-sm font-body-sm text-tertiary mt-1">Convergence of physiological peak and tactical maturity.</p>
                  </div>

                  <div className="p-4 border border-outline-variant/30 rounded-xl">
                    <span className="font-label-caps text-label-caps text-tertiary block mb-1">VETERAN INFLUENCE</span>
                    <span className="font-stat-lg text-stat-lg text-on-surface font-bold">31+</span>
                    <p className="text-body-sm font-body-sm text-tertiary mt-1">Focus on positional efficiency and game management.</p>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </div>
        )}

        {activeSubTab === 'financials' && (
          <div className="space-y-gutter">
            <ScrollReveal>
              <section className="data-card p-6 sm:p-8">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Financial Valuation Intelligence</h2>
                <p className="text-body-sm text-tertiary mb-6">Total squad valuations and market capital distribution by league.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {financialSummary.map(f => {
                    const avgVal = f.playersCount > 0 ? f.totalVal / f.playersCount : 0
                    return (
                      <div key={f.league} className="p-5 bg-surface-container-low rounded-xl border border-surface-container-high/40">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-headline-md text-headline-md font-bold text-on-surface">{f.league}</h4>
                          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                            {formatCurrency(f.totalVal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-body-sm text-tertiary mt-4">
                          <span>Average Athlete Value</span>
                          <span className="font-mono font-bold text-on-surface">{formatCurrency(avgVal)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  )
}
