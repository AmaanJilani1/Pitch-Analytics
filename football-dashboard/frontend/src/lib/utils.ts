import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `€${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(0)}M`
  }
  return `€${value.toLocaleString()}`
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toFixed(decimals)
}

export function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    FW: 'bg-[#006A36]/10 text-[#006A36] border-[#006A36]/20',
    MF: 'bg-[#904D00]/10 text-[#904D00] border-[#904D00]/20',
    DF: 'bg-[#3E4A3F]/10 text-[#3E4A3F] border-[#3E4A3F]/20',
    GK: 'bg-[#5A5C5E]/10 text-[#5A5C5E] border-[#5A5C5E]/20',
  }
  return colors[position] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export function getLeagueColor(league: string): string {
  const colors: Record<string, string> = {
    'Premier League': 'text-[#3D195B] font-medium',
    'La Liga': 'text-[#D9381E] font-medium',
    'Bundesliga': 'text-[#D20515] font-medium',
    'Serie A': 'text-[#024494] font-medium',
    'Ligue 1': 'text-[#B8860B] font-medium',
  }
  return colors[league] || 'text-[#6E7A6F]'
}
