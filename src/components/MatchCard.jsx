import { MapPin, Star, UserCheck, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
  'from-green-400 to-green-600', 'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600', 'from-teal-400 to-teal-600',
]

function ScoreBar({ score }) {
  const pct = Math.round((score || 0) * 100)
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-brand-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-400'

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Match Score</span>
        <span className={clsx(
          'text-xs font-bold',
          pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-brand-600' : 'text-yellow-600'
        )}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-surface-subtle dark:bg-dark-border rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function MatchCard({ match, onAssign, loading }) {
  const name = match.volunteer_name || match.name || 'Volunteer'
  const colorIdx = name.charCodeAt(0) % AVATAR_COLORS.length

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-start gap-3 mb-4">
        <div className={clsx(
          'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0',
          AVATAR_COLORS[colorIdx]
        )}>
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
              {name}
            </h3>
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <Star size={11} fill="currentColor" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {match.match_score ? (match.match_score * 5).toFixed(1) : '—'}
              </span>
            </div>
          </div>
          {match.location && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin size={10} />
              {match.location}
            </div>
          )}
        </div>
      </div>

      {/* Matched skills */}
      {match.matching_skills?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1.5">Matching skills</p>
          <div className="flex flex-wrap gap-1">
            {match.matching_skills.slice(0, 4).map((s, i) => (
              <span key={i} className="skill-chip">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Score */}
      <div className="mb-4">
        <ScoreBar score={match.match_score} />
      </div>

      {/* Assign */}
      <button
        onClick={() => onAssign && onAssign(match)}
        disabled={loading}
        className="btn-primary w-full justify-center text-xs py-2"
      >
        <UserCheck size={13} />
        {loading ? 'Assigning…' : 'Assign Volunteer'}
        <ChevronRight size={13} />
      </button>
    </div>
  )
}
