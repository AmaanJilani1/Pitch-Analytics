import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { PlayerDetail } from '@/types'

interface RadarChartProps {
  players: PlayerDetail[]
  colors?: string[]
}

const defaultColors = ['#006a36', '#ffa454', '#5a5c5e']

export default function PlayerRadarChart({ players, colors = defaultColors }: RadarChartProps) {
  const stats = Object.keys(players[0]?.radar || {})

  const data = stats.map(stat => {
    const entry: Record<string, number | string> = { stat: stat.toUpperCase() }
    players.forEach(p => {
      entry[p.name] = p.radar[stat] || 0
    })
    return entry
  })

  return (
    <div className="w-full h-[360px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis 
            dataKey="stat" 
            tick={{ fill: '#5a5c5e', fontSize: 11, fontWeight: 700, fontFamily: 'Inter' }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#6e7a6f', fontSize: 10 }}
            axisLine={false}
          />
          {players.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name}
              dataKey={p.name}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.18}
              strokeWidth={2.5}
            />
          ))}
          {players.length > 1 && (
            <Legend 
              wrapperStyle={{ paddingTop: '16px' }}
              formatter={(value: string) => <span className="text-on-surface text-xs font-bold font-body-sm">{value}</span>}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
