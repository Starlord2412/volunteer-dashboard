import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckSquare, Users, AlertTriangle, UserCheck,
  TrendingUp, Activity, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import toast from 'react-hot-toast'
import { getTasks, getVolunteers, getUrgentMatches } from '../services/api'
import StatsCard from '../components/StatsCard'
import { Loader, EmptyState } from '../components/Loader'

const AREA_DATA = [
  { month: 'Jan', tasks: 12, volunteers: 8 },
  { month: 'Feb', tasks: 18, volunteers: 14 },
  { month: 'Mar', tasks: 22, volunteers: 19 },
  { month: 'Apr', tasks: 17, volunteers: 15 },
  { month: 'May', tasks: 28, volunteers: 24 },
  { month: 'Jun', tasks: 35, volunteers: 30 },
]

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#f43f5e']

export default function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [urgentMatches, setUrgentMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAll = async (showToast = false) => {
    try {
      setRefreshing(true)
      const [t, v, u] = await Promise.allSettled([
        getTasks(), getVolunteers(), getUrgentMatches()
      ])
      if (t.status === 'fulfilled') setTasks(t.value?.tasks || t.value || [])
      if (v.status === 'fulfilled') setVolunteers(v.value?.volunteers || v.value || [])
      if (u.status === 'fulfilled') setUrgentMatches(u.value?.matches || u.value || [])
      if (showToast) toast.success('Dashboard refreshed')
    } catch (e) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const urgentTasks = tasks.filter(t =>
    (t.urgency_level || t.urgency || '').toLowerCase() === 'urgent'
  )
  const assignedVols = volunteers.filter(v => v.assigned || v.is_assigned)

  const urgencyBreakdown = ['urgent', 'high', 'medium', 'low'].map(u => ({
    name: u.charAt(0).toUpperCase() + u.slice(1),
    value: tasks.filter(t => (t.urgency_level || t.urgency || '').toLowerCase() === u).length
  })).filter(d => d.value > 0)

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">
            Good morning 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's what's happening with your volunteer program today.
          </p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          icon={CheckSquare}
          color="blue"
          trend={12}
          trendLabel="vs last month"
          loading={loading}
        />
        <StatsCard
          title="Total Volunteers"
          value={volunteers.length}
          icon={Users}
          color="green"
          trend={8}
          trendLabel="vs last month"
          loading={loading}
        />
        <StatsCard
          title="Urgent Tasks"
          value={urgentTasks.length}
          icon={AlertTriangle}
          color="red"
          trend={-3}
          trendLabel="vs last month"
          loading={loading}
        />
        <StatsCard
          title="Assigned"
          value={assignedVols.length}
          icon={UserCheck}
          color="orange"
          trend={5}
          trendLabel="vs last month"
          loading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                Activity Overview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Tasks vs Volunteers over 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Tasks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" /> Volunteers
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={AREA_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVols" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgb(0 0 0 / 0.1)', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} fill="url(#gradTasks)" />
              <Area type="monotone" dataKey="volunteers" stroke="#4ade80" strokeWidth={2} fill="url(#gradVols)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm mb-1">
            Task Urgency
          </h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown by priority level</p>
          {loading ? (
            <div className="h-[160px] skeleton rounded-xl" />
          ) : urgencyBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-[160px] text-xs text-slate-400">
              No data yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={urgencyBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {urgencyBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {urgencyBreakdown.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {d.name}: <strong>{d.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Urgent Matches */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle size={14} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                Urgent Matches Needed
              </h3>
              <p className="text-xs text-slate-400">Tasks requiring immediate volunteer assignment</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/match')}
            className="btn-secondary text-xs py-2"
          >
            Match Now
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl skeleton" />
            ))}
          </div>
        ) : urgentMatches.length === 0 ? (
          <EmptyState
            title="No urgent matches"
            description="All critical tasks are currently covered."
          />
        ) : (
          <div className="space-y-2">
            {urgentMatches.slice(0, 5).map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-muted dark:bg-dark-bg border border-surface-border dark:border-dark-border hover:border-brand-200 transition-colors cursor-pointer"
                onClick={() => navigate('/match')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {match.task_title || match.title || 'Urgent Task'}
                    </p>
                    <p className="text-xs text-slate-400">{match.location || 'Location TBD'}</p>
                  </div>
                </div>
                <span className="badge badge-urgent">Urgent</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Match Rate', value: volunteers.length ? `${Math.round((assignedVols.length / volunteers.length) * 100)}%` : '0%', icon: Activity, color: 'text-brand-600' },
          { label: 'Tasks This Week', value: tasks.slice(0, 7).length, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Skill Gap Tasks', value: urgentTasks.length, icon: AlertTriangle, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-dark-bg flex items-center justify-center">
              <s.icon size={17} className={s.color} />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-slate-800 dark:text-white leading-tight">
                {loading ? '—' : s.value}
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
