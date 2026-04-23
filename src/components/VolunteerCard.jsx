import { MapPin, CheckCircle2, Circle, Mail, Phone } from 'lucide-react'
import clsx from 'clsx'

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
  'from-teal-400 to-teal-600',
]

export default function VolunteerCard({ volunteer }) {
  const name = volunteer.name || 'Unknown'
  const colorIdx = name.charCodeAt(0) % AVATAR_COLORS.length
  const assigned = volunteer.assigned || volunteer.is_assigned

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      {/* Top */}
      <div className="flex items-start gap-3 mb-3">
        <div className={clsx(
          'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0',
          AVATAR_COLORS[colorIdx]
        )}>
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm leading-tight">
            {name}
          </h3>
          {volunteer.email && (
            <p className="text-xs text-slate-400 truncate">{volunteer.email}</p>
          )}
        </div>
        <div className={clsx(
          'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
          assigned ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
        )}>
          {assigned
            ? <CheckCircle2 size={11} />
            : <Circle size={11} />
          }
          {assigned ? 'Assigned' : 'Available'}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-3">
        {volunteer.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={11} className="text-brand-400" />
            {volunteer.location}
          </div>
        )}
        {volunteer.availability !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 size={11} className="text-green-400" />
            {volunteer.availability ? 'Available' : 'Busy'}
          </div>
        )}
      </div>

      {/* Skills */}
      {volunteer.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {volunteer.skills.split(';').slice(0, 5).map((skill, i) => (
            <span key={i} className="skill-chip">{skill}</span>
          ))}
          {volunteer.skills.length > 5 && (
            <span className="skill-chip text-slate-400">+{volunteer.skills.length - 5}</span>
          )}
        </div>
      )}
    </div>
  )
}
