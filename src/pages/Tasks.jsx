import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTasks } from '../services/api'
import TaskCard from '../components/TaskCard'
import { SearchBar } from '../components/Loader'
import { FilterBar } from '../components/Loader'
import { EmptyState, SkeletonGrid } from '../components/Loader'

const URGENCY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [urgency, setUrgency] = useState('all')
  const [location, setLocation] = useState('')

  useEffect(() => {
    getTasks()
      .then(data => setTasks(data?.tasks || data || []))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [])

  const locations = useMemo(() => {
    const locs = [...new Set(tasks.map(t => t.location).filter(Boolean))]
    return locs
  }, [tasks])

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.required_skills || []).some(s => s.toLowerCase().includes(q))
      const matchUrgency = urgency === 'all' || (t.urgency_level || t.urgency || '').toLowerCase() === urgency
      const matchLocation = !location || (t.location || '').toLowerCase().includes(location.toLowerCase())
      return matchSearch && matchUrgency && matchLocation
    })
  }, [tasks, search, urgency, location])

  const handleMatch = (task) => {
    navigate('/match', { state: { task } })
  }

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {loading ? '…' : `${filtered.length} of ${tasks.length} tasks`}
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tasks, skills…" />
          <div className="relative">
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="select pr-8"
            >
              <option value="">All Locations</option>
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <FilterBar filters={URGENCY_FILTERS} active={urgency} onFilter={setUrgency} />
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <button className="btn-secondary" onClick={() => { setSearch(''); setUrgency('all'); setLocation('') }}>
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task, i) => (
            <TaskCard key={task.id || task._id || i} task={task} onMatch={handleMatch} />
          ))}
        </div>
      )}
    </div>
  )
}
