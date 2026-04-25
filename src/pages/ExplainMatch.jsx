// import { useState, useEffect } from 'react'
// import { MessageSquareText, Sparkles, ChevronDown, CheckCircle2, AlertCircle, Minus } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { explainMatch, getVolunteers, getTasks } from '../services/api'

// export default function ExplainMatch() {
//   const [volunteers, setVolunteers] = useState([])
//   const [tasks, setTasks] = useState([])
//   const [form, setForm] = useState({ volunteer_id: '', task_id: '' })
//   const [result, setResult] = useState(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     Promise.allSettled([getVolunteers(), getTasks()]).then(([v, t]) => {
//       if (v.status === 'fulfilled') setVolunteers(v.value?.volunteers || v.value || [])
//       if (t.status === 'fulfilled') setTasks(t.value?.tasks || t.value || [])
//     })


 
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!form.volunteer_id || !form.task_id) {
//       toast.error('Please select both a volunteer and a task')
//       return
//     }
//     setLoading(true)
//     try {
//       const data = await explainMatch(form)
//       setResult(data)
//       toast.success('Match explanation generated')
//     } catch (err) {
//       toast.error(err.message || 'Failed to explain match')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const volName = volunteers.find(v => (v.id || v._id) == form.volunteer_id)?.name || ''
//   const taskTitle = tasks.find(t => (t.id || t._id) == form.task_id)?.title || ''

//   return (
//     <div className="p-5 space-y-5 animate-fade-in max-w-3xl mx-auto">
//       {/* Header */}
//       <div className="card p-5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
//             <MessageSquareText size={24} />
//           </div>
//           <div>
//             <h2 className="font-display font-bold text-lg">Explain Match</h2>
//             <p className="text-purple-100 text-sm mt-1 leading-relaxed">
//               Get a detailed AI explanation of why a volunteer is or isn't a good fit for a specific task.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="card p-5">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="label">Volunteer</label>
//               <div className="relative">
//                 <select
//                   value={form.volunteer_id}
//                   onChange={e => setForm(f => ({ ...f, volunteer_id: e.target.value }))}
//                   className="select pr-8"
//                 >
//                   <option value="">— Select volunteer —</option>
//                   {volunteers.map(v => (
//                     <option key={v.id || v._id} value={v.id || v._id}>{v.name}</option>
//                   ))}
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </div>
//             <div>
//               <label className="label">Task</label>
//               <div className="relative">
//                 <select
//                   value={form.task_id}
//                   onChange={e => setForm(f => ({ ...f, task_id: e.target.value }))}
//                   className="select pr-8"
//                 >
//                   <option value="">— Select task —</option>
//                   {tasks.map(t => (
//                     <option key={t.id || t._id} value={t.id || t._id}>{t.title || t.name}</option>
//                   ))}
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary w-full justify-center py-3"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Analyzing match…
//               </>
//             ) : (
//               <>
//                 <Sparkles size={15} />
//                 Explain This Match
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Result */}
//       {result && (
//         <div className="space-y-4 animate-slide-up">
//           {/* Match header */}
//           <div className="card p-5 border-l-4 border-l-purple-500">
//             <div className="flex items-center gap-2 mb-2">
//               <Sparkles size={15} className="text-purple-500" />
//               <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">AI Analysis</span>
//             </div>
//             {volName && taskTitle && (
//               <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
//                 <strong>{volName}</strong> → <strong>{taskTitle}</strong>
//               </p>
//             )}
//             {result.explanation && (
//               <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//                 {result.explanation}
//               </p>
//             )}
//             {result.match_score !== undefined && (
//               <div className="mt-4">
//                 <div className="flex justify-between text-xs mb-1.5">
//                   <span className="text-slate-500">Overall Match Score</span>
//                   <span className="font-bold text-purple-600">{Math.round(result.match_score * 100)}%</span>
//                 </div>
//                 <div className="h-2.5 bg-surface-subtle dark:bg-dark-border rounded-full overflow-hidden">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
//                     style={{ width: `${result.match_score * 100}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Skill gap analysis */}
//           {result.skill_gap_analysis && (
//             <div className="card p-5">
//               <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
//                 <div className="w-6 h-6 rounded-lg bg-surface-subtle flex items-center justify-center">
//                   <Sparkles size={12} className="text-slate-500" />
//                 </div>
//                 Skill Gap Analysis
//               </h3>
//               <div className="space-y-2">
//                 {/* Matched skills */}
//                 {result.skill_gap_analysis.matching_skills?.map((s, i) => (
//                   <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
//                     <CheckCircle2 size={14} className="text-green-500 shrink-0" />
//                     <span className="text-sm text-green-700 dark:text-green-400 font-medium">{s}</span>
//                     <span className="ml-auto text-xs text-green-500">Matched</span>
//                   </div>
//                 ))}
//                 {/* Missing skills */}
//                 {result.skill_gap_analysis.missing_skills?.map((s, i) => (
//                   <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
//                     <AlertCircle size={14} className="text-red-400 shrink-0" />
//                     <span className="text-sm text-red-600 dark:text-red-400 font-medium">{s}</span>
//                     <span className="ml-auto text-xs text-red-400">Missing</span>
//                   </div>
//                 ))}
//                 {/* Partial skills */}
//                 {result.skill_gap_analysis.partial_skills?.map((s, i) => (
//                   <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30">
//                     <Minus size={14} className="text-yellow-500 shrink-0" />
//                     <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">{s}</span>
//                     <span className="ml-auto text-xs text-yellow-500">Partial</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Recommendation */}
//           {result.recommendation && (
//             <div className="card p-4 bg-brand-50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30">
//               <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">Recommendation</p>
//               <p className="text-sm text-brand-800 dark:text-brand-300 leading-relaxed">{result.recommendation}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
























import { useState, useEffect } from 'react'
import {
  MessageSquareText,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Minus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { explainMatch, getVolunteers, getTasks } from '../services/api'

export default function ExplainMatch() {
  const [volunteers, setVolunteers] = useState([])
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({
    volunteer_id: '',
    task_id: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.allSettled([getVolunteers(), getTasks()]).then(([v, t]) => {
      if (v.status === 'fulfilled') {
        setVolunteers(v.value?.volunteers || v.value || [])
      }

      if (t.status === 'fulfilled') {
        setTasks(t.value?.tasks || t.value || [])
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.volunteer_id || !form.task_id) {
      toast.error('Please select both a volunteer and a task')
      return
    }

    setLoading(true)

    try {
      const selectedVolunteer = volunteers.find(
        (v) => (v.id || v._id) == form.volunteer_id
      )

      const selectedTask = tasks.find(
        (t) => (t.id || t._id) == form.task_id
      )

      if (!selectedVolunteer || !selectedTask) {
        toast.error('Invalid volunteer or task selected')
        setLoading(false)
        return
      }

      const payload = {
        volunteer: {
          id: Number(selectedVolunteer.id || selectedVolunteer._id),
          name: selectedVolunteer.name || '',
          skills: selectedVolunteer.skills || '',
          location: selectedVolunteer.location || '',
          availability: selectedVolunteer.availability || '',
          past_experience:
            selectedVolunteer.past_experience || '',
          is_assigned:
            selectedVolunteer.is_assigned || false
        },

        task: {
          id: Number(selectedTask.id || selectedTask._id),
          title:
            selectedTask.title ||
            selectedTask.name ||
            '',
          description:
            selectedTask.description || '',
          required_skills:
            selectedTask.required_skills || '',
          location:
            selectedTask.location || '',
          urgency_level:
            selectedTask.urgency_level || ''
        }
      }

      const data = await explainMatch(payload)

      setResult(data)
      toast.success('Match explanation generated')
    } catch (err) {
      toast.error(
        err.message || 'Failed to explain match'
      )
    } finally {
      setLoading(false)
    }
  }

  const volName =
    volunteers.find(
      (v) => (v.id || v._id) == form.volunteer_id
    )?.name || ''

  const taskTitle =
    tasks.find(
      (t) => (t.id || t._id) == form.task_id
    )?.title ||
    tasks.find(
      (t) => (t.id || t._id) == form.task_id
    )?.name ||
    ''

  return (
    <div className="p-5 space-y-5 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <MessageSquareText size={24} />
          </div>

          <div>
            <h2 className="font-display font-bold text-lg">
              Explain Match
            </h2>

            <p className="text-purple-100 text-sm mt-1 leading-relaxed">
              Get a detailed AI explanation of why a
              volunteer is or isn't a good fit for a
              specific task.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Volunteer */}
            <div>
              <label className="label">
                Volunteer
              </label>

              <div className="relative">
                <select
                  value={form.volunteer_id}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      volunteer_id:
                        e.target.value
                    }))
                  }
                  className="select pr-8"
                >
                  <option value="">
                    — Select volunteer —
                  </option>

                  {volunteers.map((v) => (
                    <option
                      key={v.id || v._id}
                      value={
                        v.id || v._id
                      }
                    >
                      {v.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Task */}
            <div>
              <label className="label">
                Task
              </label>

              <div className="relative">
                <select
                  value={form.task_id}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      task_id:
                        e.target.value
                    }))
                  }
                  className="select pr-8"
                >
                  <option value="">
                    — Select task —
                  </option>

                  {tasks.map((t) => (
                    <option
                      key={t.id || t._id}
                      value={
                        t.id || t._id
                      }
                    >
                      {t.title ||
                        t.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing match...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Explain This Match
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Analysis */}
          <div className="card p-5 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles
                size={15}
                className="text-purple-500"
              />

              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                AI Analysis
              </span>
            </div>

            {volName && taskTitle && (
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
                <strong>
                  {volName}
                </strong>{' '}
                →{' '}
                <strong>
                  {taskTitle}
                </strong>
              </p>
            )}

            {result.explanation && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {
                  result.explanation
                }
              </p>
            )}

            {result.match_score !==
              undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">
                    Overall Match
                    Score
                  </span>

                  <span className="font-bold text-purple-600">
                    {Math.round(
                      result.match_score *
                        100
                    )}
                    %
                  </span>
                </div>

                <div className="h-2.5 bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                    style={{
                      width: `${result.match_score * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {result.skill_gap_analysis && (
            <div className="card p-5">
              <h3 className="font-display font-semibold text-sm mb-4">
                Skill Gap
                Analysis
              </h3>

              <div className="space-y-2">
                {result.skill_gap_analysis.matching_skills?.map(
                  (s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-green-50 border border-green-100"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-green-500"
                      />
                      <span className="text-sm text-green-700">
                        {s}
                      </span>
                    </div>
                  )
                )}

                {result.skill_gap_analysis.missing_skills?.map(
                  (s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100"
                    >
                      <AlertCircle
                        size={14}
                        className="text-red-500"
                      />
                      <span className="text-sm text-red-700">
                        {s}
                      </span>
                    </div>
                  )
                )}

                {result.skill_gap_analysis.partial_skills?.map(
                  (s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100"
                    >
                      <Minus
                        size={14}
                        className="text-yellow-500"
                      />
                      <span className="text-sm text-yellow-700">
                        {s}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="card p-4 bg-brand-50 border-brand-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">
                Recommendation
              </p>

              <p className="text-sm text-brand-800 leading-relaxed">
                {
                  result.recommendation
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}