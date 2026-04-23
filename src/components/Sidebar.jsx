import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, Users, Zap,
  BrainCircuit, MessageSquareText, ClipboardList,
  HeartHandshake, X, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',            icon: LayoutDashboard,    label: 'Dashboard' },
  { to: '/tasks',       icon: CheckSquare,         label: 'Tasks' },
  { to: '/volunteers',  icon: Users,               label: 'Volunteers' },
  { to: '/match',       icon: Zap,                 label: 'Match' },
  { to: '/extract',     icon: BrainCircuit,        label: 'Extract Skills' },
  { to: '/explain',     icon: MessageSquareText,   label: 'Explain Match' },
  { to: '/assignments', icon: ClipboardList,       label: 'Assignments' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-card border-r border-surface-border dark:border-dark-border z-30',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-border dark:border-dark-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-200">
              <HeartHandshake size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-slate-800 dark:text-white text-base tracking-tight">
              VolunteerAI
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Navigation
          </p>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                clsx('sidebar-link group', isActive && 'active')
              }
            >
              <Icon size={17} strokeWidth={2} />
              <span className="flex-1">{label}</span>
              <ChevronRight
                size={13}
                className="opacity-0 group-hover:opacity-60 transition-opacity -mr-1"
              />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border dark:border-dark-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-subtle cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 truncate">admin@volunteerai.org</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
