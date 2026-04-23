import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Health ──────────────────────────────────────────────
export const checkHealth = () => api.get('/health')

// ─── Tasks ───────────────────────────────────────────────
export const getTasks = () => api.get('/tasks')

// ─── Volunteers ──────────────────────────────────────────
export const getVolunteers = () => api.get('/volunteers')

export const updateAssignment = (volunteerId, payload) =>
  api.put(`/volunteers/${volunteerId}/assignment`, payload)

// ─── AI ──────────────────────────────────────────────────
export const extractSkills = (payload) => api.post('/extract-skills', payload)
// payload: { task_description: string }

export const matchVolunteers = (payload) => api.post('/match-volunteers', payload)
// payload: { task_id?, task_description?, urgency_level?, location? }

export const explainMatch = (payload) => api.post('/explain-match', payload)
// payload: { volunteer_id, task_id }

// ─── Dashboard ───────────────────────────────────────────
export const getUrgentMatches = () => api.get('/dashboard/urgent-matches')

export default api
