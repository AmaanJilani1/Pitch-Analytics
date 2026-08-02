import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ValueHistoryPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface ValueTrendChartProps {
  history: ValueHistoryPoint[]
  color?: string
}

export default function ValueTrendChart({ history, color = '#006a36' }: ValueTrendChartProps) {
  const data = history.map(h => ({
    ...h,
    year: h.date.split('-')[0],
  }))

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#5a5c5e', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#E8E8E6' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#5a5c5e', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
            width={65}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.08)',
              padding: '12px',
            }}
            labelStyle={{ color: '#5a5c5e', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}
            formatter={(value: number) => [formatCurrency(value), 'Market Value']}
            itemStyle={{ color: '#1a1c1b', fontSize: '13px', fontWeight: 700 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill="url(#valueGradient)"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
