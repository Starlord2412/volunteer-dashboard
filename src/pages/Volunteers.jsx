import { useState, useEffect, useMemo } from 'react'
import { Users, UserCheck, Circle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getVolunteers } from '../services/api'
import VolunteerCard from '../components/VolunteerCard'
import { SearchBar, FilterBar, EmptyState, SkeletonGrid } from '../components/Loader'

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Assigned', value: 'assigned' },
]

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [location, setLocation] = useState('')

  useEffect(() => {
    getVolunteers()
      .then(data => setVolunteers(data?.volunteers || data || []))
      .catch(() => toast.error('Failed to load volunteers'))
      .finally(() => setLoading(false))
  }, [])

  const locations = useMemo(() => (
    [...new Set(volunteers.map(v => v.location).filter(Boolean))]
  ), [volunteers])

  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        (v.name || '').toLowerCase().includes(q) ||
        (v.skills || []).some(s => s.toLowerCase().includes(q)) ||
        (v.location || '').toLowerCase().includes(q)
      const assigned = v.assigned || v.is_assigned
      const matchStatus =
        status === 'all' ||
        (status === 'assigned' && assigned) ||
        (status === 'available' && !assigned)
      const matchLoc = !location || (v.location || '').toLowerCase().includes(location.toLowerCase())
      return matchSearch && matchStatus && matchLoc
    })
  }, [volunteers, search, status, location])

  const assignedCount = volunteers.filter(v => v.assigned || v.is_assigned).length

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: volunteers.length, icon: Users, color: 'text-brand-600' },
          { label: 'Assigned', value: assignedCount, icon: UserCheck, color: 'text-green-600' },
          { label: 'Available', value: volunteers.length - assignedCount, icon: Circle, color: 'text-slate-500' },
        ].map(s => (
          <div key={s.label} className="card p-3 flex items-center gap-2.5">
            <s.icon size={15} className={s.color} />
            <div>
              <p className="font-display font-bold text-slate-800 dark:text-white text-base leading-tight">
                {loading ? '—' : s.value}
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, skills…" />
          <select value={location} onChange={e => setLocation(e.target.value)} className="select">
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <FilterBar filters={STATUS_FILTERS} active={status} onFilter={setStatus} />
      </div>

      {/* Showing count */}
      <p className="text-xs text-slate-500 px-0.5">
        Showing <strong>{filtered.length}</strong> of {volunteers.length} volunteers
      </p>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No volunteers found"
          description="Try adjusting your search or filters."
          action={
            <button className="btn-secondary" onClick={() => { setSearch(''); setStatus('all'); setLocation('') }}>
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <VolunteerCard key={v.id || v._id || i} volunteer={v} />
          ))}
        </div>
      )}
    </div>
  )
}
