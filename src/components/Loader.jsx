// ─── Loader ─────────────────────────────────────────────
export function Loader({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-dark-border" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-slate-500 font-medium animate-pulse-soft">{text}</p>
    </div>
  )
}

// ─── SkeletonGrid ─────────────────────────────────────────
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded skeleton" />
              <div className="h-3 rounded skeleton w-3/4" />
            </div>
          </div>
          <div className="h-3 rounded skeleton" />
          <div className="h-3 rounded skeleton w-5/6" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-lg skeleton" />
            <div className="h-6 w-16 rounded-lg skeleton" />
          </div>
          <div className="h-8 rounded-xl skeleton mt-2" />
        </div>
      ))}
    </div>
  )
}

// ─── SearchBar ───────────────────────────────────────────
import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

// ─── FilterBar ───────────────────────────────────────────
import { SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'

export function FilterBar({ filters, active, onFilter }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <SlidersHorizontal size={14} className="text-slate-400" />
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onFilter(f.value)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
            active === f.value
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border border-surface-border dark:border-dark-border hover:border-brand-300 hover:text-brand-600'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

// ─── EmptyState ──────────────────────────────────────────
import { PackageSearch } from 'lucide-react'

export function EmptyState({ title = 'No results found', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-subtle dark:bg-dark-card flex items-center justify-center mb-4">
        <PackageSearch size={28} className="text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="font-display font-semibold text-slate-700 dark:text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
