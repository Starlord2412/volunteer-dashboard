import { Menu, Bell, Sun, Moon, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'

const TITLES = {
  '/':            { title: 'Dashboard',     sub: 'Overview & urgent matches' },
  '/tasks':       { title: 'Tasks',          sub: 'Browse and manage tasks' },
  '/volunteers':  { title: 'Volunteers',     sub: 'Manage volunteer roster' },
  '/match':       { title: 'Match Volunteers', sub: 'AI-powered task matching' },
  '/extract':     { title: 'Extract Skills', sub: 'Identify skills from descriptions' },
  '/explain':     { title: 'Explain Match',  sub: 'Understand match reasoning' },
  '/assignments': { title: 'Assignments',    sub: 'Manage volunteer assignments' },
}

export default function Navbar({ onMenuClick, darkMode, toggleDark }) {
  const { pathname } = useLocation()
  const info = TITLES[pathname] || { title: 'Page', sub: '' }

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-surface-border dark:border-dark-border flex items-center px-5 gap-4">
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-surface-subtle hover:text-slate-700 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1">
        <h1 className="font-display font-semibold text-slate-800 dark:text-white leading-tight">
          {info.title}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">{info.sub}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-slate-500 hover:bg-surface-subtle hover:text-slate-700 dark:hover:bg-dark-card dark:hover:text-slate-200 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-surface-subtle hover:text-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-surface-border dark:border-dark-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
