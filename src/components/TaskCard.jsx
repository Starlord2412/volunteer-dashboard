import { MapPin, Clock, Tag, ChevronRight, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const URGENCY_BADGE = {
  urgent: 'badge-urgent',
  high:   'badge-high',
  medium: 'badge-medium',
  low:    'badge-low',
}

export default function TaskCard({ task, onMatch }) {
  const urgency = (task.urgency_level || task.urgency || 'medium').toLowerCase()

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm leading-tight truncate group-hover:text-brand-600 transition-colors">
            {task.title || task.name || 'Untitled Task'}
          </h3>
        </div>
        <span className={clsx('badge shrink-0 capitalize', URGENCY_BADGE[urgency] || 'badge-medium')}>
          {urgency}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-3">
        {task.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="text-brand-400" />
            <span>{task.location}</span>
          </div>
        )}
        {task.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} className="text-orange-400" />
            <span>{task.deadline}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {task.required_skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.required_skills.split(';').slice(0, 4).map((skill, i) => (
            <span key={i} className="skill-chip">{skill}</span>
          ))}
          {task.required_skills.length > 4 && (
            <span className="skill-chip text-slate-400">+{task.required_skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => onMatch && onMatch(task)}
        className="btn-primary w-full justify-center text-xs py-2"
      >
        <Zap size={13} strokeWidth={2.5} />
        Match Volunteers
        <ChevronRight size={13} />
      </button>
    </div>
  )
}
