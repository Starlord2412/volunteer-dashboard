import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Zap, Search, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { matchVolunteers, getTasks, updateAssignment } from '../services/api'
import MatchCard from '../components/MatchCard'
import { Loader, EmptyState } from '../components/Loader'

const URGENCY_LEVELS = ['low', 'medium', 'high', 'urgent']

export default function Match() {
  const { state } = useLocation()
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({
    task_id: '',
    task_description: state?.task?.description || '',
    urgency_level: state?.task?.urgency_level || state?.task?.urgency || 'medium',
    location: state?.task?.location || '',
  })
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    getTasks()
      .then(data => setTasks(data?.tasks || data || []))
      .catch(() => {})
  }, [])

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.task_id && !form.task_description.trim()) {
      toast.error('Please select a task or enter a description')
      return
    }
    setLoading(true)
    setHasSearched(true)
    try {
      const payload = {}
      if (form.task_id) payload.task_id = form.task_id
      if (form.task_description.trim()) payload.task_description = form.task_description.trim()
      if (form.urgency_level) payload.urgency_level = form.urgency_level
      if (form.location.trim()) payload.location = form.location.trim()

      const data = await matchVolunteers(payload)
      const list = data?.matches || data?.volunteers || data || []
      setMatches(list)
      if (list.length === 0) toast('No matches found — try broader criteria', { icon: '🔍' })
      else toast.success(`Found ${list.length} matching volunteer${list.length > 1 ? 's' : ''}`)
    } catch (err) {
      toast.error(err.message || 'Matching failed')
    } finally {
      setLoading(false)
    }
  }

  // const handleAssign = async (match) => {
  //   const volunteerId = match.volunteer_id || match.id
  //   if (!volunteerId) return toast.error('No volunteer ID found')
  //   setAssigning(volunteerId)
  //   try {
  //     await updateAssignment(volunteerId, {
  //       assigned: true,
  //       task_id: form.task_id || undefined,
  //     })
  //     toast.success(`${match.volunteer_name || match.name || 'Volunteer'} assigned successfully!`)
  //     setMatches(prev => prev.filter(m => (m.volunteer_id || m.id) !== volunteerId))
  //   } catch (err) {
  //     toast.error(err.message || 'Assignment failed')
  //   } finally {
  //     setAssigning(null)
  //   }
  // }




const handleAssign = async (match) => {
  const volunteerId = match.volunteer_id || match.id

  if (!volunteerId) {
    toast.error('No volunteer ID found')
    return
  }

  setAssigning(volunteerId)

  try {
    await updateAssignment(volunteerId, {
      is_assigned: true
    })

    toast.success(
      `${match.volunteer_name || match.name || 'Volunteer'} assigned successfully!`
    )

    // Remove from match list instantly
    setMatches(prev =>
      prev.filter(
        m => (m.volunteer_id || m.id) !== volunteerId
      )
    )

  } catch (err) {
    toast.error(err.message || 'Assignment failed')
  } finally {
    setAssigning(null)
  }
}


  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center">
                <Zap size={16} className="text-brand-600" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                  Find Matches
                </h2>
                <p className="text-xs text-slate-400">AI-powered volunteer matching</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Task selector */}
              <div>
                <label className="label">Select Existing Task</label>
                <div className="relative">
                  <select
                    value={form.task_id}
                    onChange={e => {
                      const t = tasks.find(t => (t.id || t._id) == e.target.value)
                      handleChange('task_id', e.target.value)
                      if (t) {
                        handleChange('task_description', t.description || '')
                        handleChange('urgency_level', t.urgency_level || t.urgency || 'medium')
                        handleChange('location', t.location || '')
                      }
                    }}
                    className="select pr-8"
                  >
                    <option value="">— Choose a task —</option>
                    {tasks.map(t => (
                      <option key={t.id || t._id} value={t.id || t._id}>
                        {t.title || t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
                or
                <div className="flex-1 h-px bg-surface-border dark:bg-dark-border" />
              </div>

              {/* Description */}
              <div>
                <label className="label">Task Description</label>
                <textarea
                  value={form.task_description}
                  onChange={e => handleChange('task_description', e.target.value)}
                  placeholder="Describe the task requirements, needed skills, context…"
                  rows={4}
                  className="input resize-none"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="label">Urgency Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {URGENCY_LEVELS.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleChange('urgency_level', u)}
                      className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                        form.urgency_level === u
                          ? u === 'urgent' ? 'bg-red-500 text-white'
                            : u === 'high' ? 'bg-orange-500 text-white'
                            : u === 'medium' ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                          : 'bg-surface-subtle dark:bg-dark-bg text-slate-500 hover:bg-surface-border'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">Location (optional)</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => handleChange('location', e.target.value)}
                  placeholder="e.g. New York, Remote…"
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Matching…
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    Find Matching Volunteers
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="card p-8">
              <Loader text="Finding best matches with AI…" />
            </div>
          ) : !hasSearched ? (
            <div className="card p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-4">
                  <Zap size={28} className="text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Ready to match
                </h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  Fill in the form and click "Find Matching Volunteers" to see AI-powered results.
                </p>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="card p-8">
              <EmptyState
                title="No matches found"
                description="Try broadening your search criteria or removing location filters."
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-slate-700 dark:text-slate-200 text-sm">
                  {matches.length} Volunteer{matches.length > 1 ? 's' : ''} Matched
                </h3>
                <span className="badge badge-blue">Sorted by score</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((m, i) => (
                  <MatchCard
                    key={m.volunteer_id || m.id || i}
                    match={m}
                    onAssign={handleAssign}
                    loading={assigning === (m.volunteer_id || m.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
