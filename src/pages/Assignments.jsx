import { useState, useEffect, useMemo } from 'react'
import { CheckCircle2, Circle, MapPin, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { getVolunteers, updateAssignment } from '../services/api'
import { SearchBar, EmptyState } from '../components/Loader'
import clsx from 'clsx'

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const COLORS = [
  'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
  'from-green-400 to-green-600', 'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600', 'from-teal-400 to-teal-600',
]

export default function Assignments() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getVolunteers()
      .then(data => setVolunteers(data?.volunteers || data || []))
      .catch(() => toast.error('Failed to load volunteers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      const q = search.toLowerCase()
      const matchQ = !q || (v.name || '').toLowerCase().includes(q) || (v.location || '').toLowerCase().includes(q)
      const assigned = v.assigned || v.is_assigned
      const matchF = filter === 'all' || (filter === 'assigned' && assigned) || (filter === 'available' && !assigned)
      return matchQ && matchF
    })
  }, [volunteers, search, filter])

  const toggleAssignment = async (volunteer) => {
    const id = volunteer.id || volunteer._id
    const newVal = !(volunteer.assigned || volunteer.is_assigned)
    setUpdating(id)
    try {
      await updateAssignment(id, { assigned: newVal })
      setVolunteers(prev =>
        prev.map(v => (v.id || v._id) === id ? { ...v, assigned: newVal, is_assigned: newVal } : v)
      )
      toast.success(`${volunteer.name} marked as ${newVal ? 'assigned' : 'available'}`)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  const assignedCount = volunteers.filter(v => v.assigned || v.is_assigned).length

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: volunteers.length, color: 'text-slate-700' },
          { label: 'Assigned', value: assignedCount, color: 'text-green-600' },
          { label: 'Available', value: volunteers.length - assignedCount, color: 'text-brand-600' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className={clsx('font-display font-bold text-xl', s.color)}>
              {loading ? '—' : s.value}
            </p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search volunteers…" />
          </div>
          <div className="flex gap-2">
            {['all', 'assigned', 'available'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all',
                  filter === f
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-subtle dark:bg-dark-bg text-slate-600 dark:text-slate-400 border border-surface-border dark:border-dark-border hover:border-brand-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-surface-border dark:divide-dark-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-xl skeleton shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded skeleton w-1/3" />
                  <div className="h-3 rounded skeleton w-1/4" />
                </div>
                <div className="w-20 h-8 rounded-xl skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No volunteers found" description="Adjust your search or filter." />
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-surface-muted dark:bg-dark-bg border-b border-surface-border dark:border-dark-border">
              <p className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Volunteer</p>
              <p className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</p>
              <p className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Skills</p>
              <p className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Status</p>
            </div>

            <div className="divide-y divide-surface-border dark:divide-dark-border">
              {filtered.map((v, i) => {
                const id = v.id || v._id
                const assigned = v.assigned || v.is_assigned
                const colorIdx = (v.name || '').charCodeAt(0) % COLORS.length

                return (
                  <div
                    key={id || i}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 hover:bg-surface-muted/60 dark:hover:bg-dark-bg/60 transition-colors items-center"
                  >
                    {/* Name */}
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className={clsx(
                        'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0',
                        COLORS[colorIdx]
                      )}>
                        {getInitials(v.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{v.name}</p>
                        {v.email && <p className="text-xs text-slate-400 truncate">{v.email}</p>}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="sm:col-span-3 flex items-center gap-1.5 text-xs text-slate-500">
                      {v.location && <><MapPin size={11} className="text-brand-400 shrink-0" />{v.location}</>}
                    </div>

                    {/* Skills */}
                    <div className="sm:col-span-3 flex flex-wrap gap-1">
                      {(typeof v.skills === 'string'
  ? v.skills.split(';')
  : v.skills || []
).slice(0, 2).map((s, si) => (
                        <span key={si} className="skill-chip text-[10px] py-0.5">{s}</span>
                      ))}
                     {(typeof v.skills === 'string'
  ? v.skills.split(';')
  : v.skills || []
).length > 2 && (
                        <span className="skill-chip text-[10px] py-0.5 text-slate-400">
                   +{
 (typeof v.skills === 'string'
   ? v.skills.split(';').length
   : v.skills.length) - 2
}
                        </span>
                      )}
                    </div>

                    {/* Toggle */}
                    <div className="sm:col-span-2 flex sm:justify-end items-center gap-2">
                      <span className={clsx(
                        'text-xs font-medium hidden sm:inline',
                        assigned ? 'text-green-600' : 'text-slate-400'
                      )}>
                        {assigned ? 'Assigned' : 'Available'}
                      </span>
                      <button
                        onClick={() => toggleAssignment(v)}
                        disabled={updating === id}
                        className={clsx(
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none',
                          assigned ? 'bg-green-500' : 'bg-slate-200 dark:bg-dark-border',
                          updating === id && 'opacity-50 cursor-not-allowed'
                        )}
                        title={assigned ? 'Mark as available' : 'Mark as assigned'}
                      >
                        <span
                          className={clsx(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            assigned ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Toggle the switch to update assignment status. Changes are saved immediately.
      </p>
    </div>
  )
}
