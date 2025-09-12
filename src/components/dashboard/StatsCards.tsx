import React from 'react'
import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

interface StatsCardsProps {
  stats: {
    total: number
    pending: number
    completed: number
    failed: number
    successRate: number
    count: number
  }
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Geral',
      value: formatCurrency(stats.total),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Pendentes',
      value: stats.pending.toString(),
      icon: Clock,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Sacadas',
      value: stats.completed.toString(),
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.successRate.toFixed(1)}%`,
      icon: AlertCircle,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            ${card.bgColor} ${card.borderColor}
            backdrop-filter backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border
            shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300
            animate-in fade-in-0 slide-in-from-bottom-4
          `}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${card.color}`}>
              <card.icon className="text-white" size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
              {card.title}
            </h3>
            <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}