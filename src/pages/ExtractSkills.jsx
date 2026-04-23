import { useState } from 'react'
import { BrainCircuit, Sparkles, X, Copy, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { extractSkills } from '../services/api'

const EXAMPLE_DESCRIPTIONS = [
  "We need volunteers to help organize a community food drive. Tasks include coordinating with local businesses, managing logistics, and using Excel to track donations.",
  "Looking for someone to teach basic coding to underprivileged youth. Must be comfortable with Python, JavaScript, and teaching/mentoring.",
  "Help needed for disaster relief coordination. Requires project management, first aid certification, and bilingual Spanish skills.",
]

export default function ExtractSkills() {
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)

  const handleExtract = async () => {
    if (!description.trim()) {
      toast.error('Please enter a task description')
      return
    }
    setLoading(true)
    try {
      const data = await extractSkills({description: description.trim() })
      // const extracted = data?.skills || data?.extracted_skills || data || []

    const extracted = data?.skills || ""

const skillArray = extracted
  .split(";")
  .map(s => s.trim())
  .filter(Boolean)

setSkills(skillArray)

      setHasResult(true)
      toast.success(`Extracted ${extracted.length} skill${extracted.length !== 1 ? 's' : ''}`)
    } catch (err) {
      toast.error(err.message || 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  const copySkills = () => {
    navigator.clipboard.writeText(skills.join(', '))
    toast.success('Skills copied to clipboard')
  }

  const reset = () => {
    setDescription('')
    setSkills([])
    setHasResult(false)
  }

  return (
    <div className="p-5 space-y-5 animate-fade-in max-w-3xl mx-auto">
      {/* Header card */}
      <div className="card p-5 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">AI Skill Extractor</h2>
            <p className="text-blue-100 text-sm mt-1 leading-relaxed">
              Paste any task description and our AI will automatically identify and extract the required skills.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="card p-5">
        <label className="label">Task Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Paste your task description here… The more detail you provide, the more accurate the skill extraction will be."
          rows={6}
          className="input resize-none mb-3"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">{description.length} characters</p>
          <div className="flex gap-2">
            {hasResult && (
              <button onClick={reset} className="btn-secondary text-xs py-2">
                <RotateCcw size={13} />
                Reset
              </button>
            )}
            <button
              onClick={handleExtract}
              disabled={loading || !description.trim()}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Extract Skills
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Examples */}
      {!hasResult && (
        <div className="card p-5">
          <p className="label mb-3">Try an example</p>
          <div className="space-y-2">
            {EXAMPLE_DESCRIPTIONS.map((ex, i) => (
              <button
                key={i}
                onClick={() => setDescription(ex)}
                className="w-full text-left px-4 py-3 rounded-xl bg-surface-muted dark:bg-dark-bg border border-surface-border dark:border-dark-border hover:border-brand-300 hover:bg-brand-50/40 dark:hover:border-brand-700 transition-all text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasResult && (
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500" />
              <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                Extracted Skills
              </h3>
              <span className="badge badge-blue ml-1">{skills.length}</span>
            </div>
            {skills.length > 0 && (
              <button onClick={copySkills} className="btn-ghost text-xs">
                <Copy size={12} />
                Copy all
              </button>
            )}
          </div>

          {skills.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No skills could be identified. Try a more detailed description.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Sparkles size={11} className="text-brand-400" />
                    {skill}
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="p-3 rounded-xl bg-surface-muted dark:bg-dark-bg border border-surface-border dark:border-dark-border">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-600 dark:text-slate-300">✓ {skills.length} skills identified.</strong>{' '}
                  These can be used to match volunteers with relevant expertise. Head to the{' '}
                  <strong>Match</strong> page to find volunteers with these skills.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
