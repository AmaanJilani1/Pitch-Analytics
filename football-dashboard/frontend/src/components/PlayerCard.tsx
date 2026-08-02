import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlayerSummary } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PlayerCardProps {
  player: PlayerSummary
  index: number
}

export default function PlayerCard({ player, index }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      layout
    >
      <div className="group bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 border border-surface-container-high/40">
        <div className="flex items-start justify-between">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-low shrink-0 border border-surface-container-highest">
            <img
              src={player.photo_url}
              alt={player.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={e => {
                (e.target as HTMLImageElement).src = 'https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1'
              }}
            />
          </div>
          <div className="flex items-center justify-center h-10 px-2.5 bg-surface-container-low rounded-lg border border-surface-container-highest text-xs font-bold font-stat-sm text-primary">
            {formatCurrency(player.market_value)}
          </div>
        </div>

        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors">
            {player.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-body-sm text-body-sm text-tertiary font-semibold">{player.position} • {player.age} Yrs</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="font-body-sm text-body-sm text-tertiary truncate max-w-[120px]">{player.club}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="bg-primary-container/10 border border-primary/20 rounded-lg p-2 flex flex-col items-center">
            <span className="font-label-caps text-[10px] text-primary">GOALS</span>
            <span className="font-stat-sm text-stat-sm text-primary font-bold">{player.goals}</span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-2 flex flex-col items-center">
            <span className="font-label-caps text-[10px] text-tertiary">ASSISTS</span>
            <span className="font-stat-sm text-stat-sm text-on-surface font-bold">{player.assists}</span>
          </div>

          <div className="bg-primary-container/10 border border-primary/20 rounded-lg p-2 flex flex-col items-center">
            <span className="font-label-caps text-[10px] text-primary">MINS</span>
            <span className="font-stat-sm text-stat-sm text-primary font-bold">{player.minutes.toLocaleString()}</span>
          </div>
        </div>

        <Link
          to={`/player/${player.id}`}
          className="w-full mt-1 border border-outline-variant py-2.5 rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all text-center block"
        >
          View Scouting Report
        </Link>
      </div>
    </motion.div>
  )
}
