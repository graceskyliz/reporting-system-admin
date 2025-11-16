const API_BASE_URL = 'https://rwfwi3e0uk.execute-api.us-east-1.amazonaws.com/dev'

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    role: 'ADMIN' | 'AUTHORITY'
    name: string
  }
}

export interface Incident {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'critical'
  location: string
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  comments?: Comment[]
  attachments?: Attachment[]
}

export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface Attachment {
  id: string
  url: string
  name: string
  type: string
}

export interface StatsResponse {
  total: number
  pending: number
  inProgress: number
  resolved: number
  byPriority: Record<string, number>
  byDepartment: Record<string, number>
}

// Auth Services
export async function registerUser(email: string, password: string, role: 'ADMIN' | 'AUTHORITY') {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  })
  
  if (!response.ok) throw new Error('Registration failed')
  return response.json() as Promise<AuthResponse>
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (!response.ok) throw new Error('Login failed')
  return response.json() as Promise<AuthResponse>
}

// Incident Services
export async function listIncidents(token: string, filters?: { status?: string; priority?: string; location?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.location) params.append('location', filters.location)
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) throw new Error('Failed to fetch incidents')
  return response.json() as Promise<Incident[]>
}

export async function getIncident(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) throw new Error('Failed to fetch incident')
  return response.json() as Promise<Incident>
}

export async function updateIncidentStatus(token: string, id: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  
  if (!response.ok) throw new Error('Failed to update incident status')
  return response.json() as Promise<Incident>
}

export async function addComment(token: string, id: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  })
  
  if (!response.ok) throw new Error('Failed to add comment')
  return response.json() as Promise<Comment>
}

export async function assignIncident(token: string, id: string, departmentId: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ departmentId })
  })
  
  if (!response.ok) throw new Error('Failed to assign incident')
  return response.json() as Promise<Incident>
}

export async function listIncidentsByDepartment(token: string, departmentId: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/by-department?departmentId=${departmentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) throw new Error('Failed to fetch incidents')
  return response.json() as Promise<Incident[]>
}

export async function getIncidentEvents(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/events`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) throw new Error('Failed to fetch incident events')
  return response.json() as Promise<any[]>
}

export async function getStaffStats(token: string) {
  const response = await fetch(`${API_BASE_URL}/staff/incidents/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json() as Promise<StatsResponse>
}
