import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend, trendLabel, loading }) {
  const colors = {
    blue:   { bg: 'bg-brand-50',   text: 'text-brand-600',  icon: 'bg-brand-100'  },
    red:    { bg: 'bg-red-50',     text: 'text-red-600',    icon: 'bg-red-100'    },
    green:  { bg: 'bg-green-50',   text: 'text-green-600',  icon: 'bg-green-100'  },
    orange: { bg: 'bg-orange-50',  text: 'text-orange-600', icon: 'bg-orange-100' },
    purple: { bg: 'bg-purple-50',  text: 'text-purple-600', icon: 'bg-purple-100' },
  }
  const c = colors[color] || colors.blue

  if (loading) {
    return (
      <div className="card p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl skeleton" />
          <div className="w-16 h-5 rounded-lg skeleton" />
        </div>
        <div className="w-20 h-8 rounded-lg skeleton mb-1" />
        <div className="w-24 h-4 rounded skeleton" />
      </div>
    )
  }

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', c.icon)}>
          <Icon size={20} className={c.text} strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          )}>
            {trend >= 0
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />
            }
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-0.5">
        {value ?? '—'}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      {trendLabel && (
        <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>
      )}
    </div>
  )
}
