import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Volunteers from './pages/Volunteers'
import Match from './pages/Match'
import ExtractSkills from './pages/ExtractSkills'
import ExplainMatch from './pages/ExplainMatch'
import Assignments from './pages/Assignments'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className={`flex h-screen overflow-hidden bg-surface-muted dark:bg-dark-bg`}>
      {/* Sidebar — 256px wide on lg+ */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area pushed right on lg+ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          darkMode={darkMode}
          toggleDark={() => setDarkMode(d => !d)}
        />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/tasks"       element={<Tasks />} />
            <Route path="/volunteers"  element={<Volunteers />} />
            <Route path="/match"       element={<Match />} />
            <Route path="/extract"     element={<ExtractSkills />} />
            <Route path="/explain"     element={<ExplainMatch />} />
            <Route path="/assignments" element={<Assignments />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
