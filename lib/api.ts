const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// Backend response wrapper
export interface ApiResponse<T> {
  statusCode: number
  body: T
}

// Register response
export interface RegisterResponse {
  message: string
  user_id: string
}

// Login response
export interface LoginResponse {
  token: string
  role: string
  department: string | null
}

// Auth response for client use
export interface AuthResponse {
  token: string
  user: {
    id: string
    role: string
    department: string | null
  }
}

export interface Incident {
  incident_id: string
  reporter_id: string
  tipo: string
  descripcion: string
  ubicacion: string
  urgencia: 'baja' | 'media' | 'alta' | 'critica'
  estado: 'pendiente' | 'en_proceso' | 'resuelto'
  created_at: string
  updated_at: string
  assigned_to?: string
  department?: string
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
  por_estado: {
    pendiente?: number
    en_proceso?: number
    resuelto?: number
  }
  por_departamento: Record<string, number>
}

// Auth Services
export async function registerUser(user_id: string, password: string, role: string = 'staff', department?: string) {
  console.log('[API] Register attempt:', { user_id, role, department, endpoint: `${API_BASE_URL}/auth/register` })
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, password, role, department })
  })
  
  console.log('[API] Register response status:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Registration failed:', error)
    throw new Error(error.body?.message || 'Registration failed')
  }
  
  const data = await response.json() as ApiResponse<RegisterResponse>
  console.log('[API] Registration successful:', data.body)
  return data.body
}

export async function login(user_id: string, password: string): Promise<AuthResponse> {
  console.log('[API] Login attempt:', { user_id, endpoint: `${API_BASE_URL}/auth/login` })
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, password })
  })
  
  console.log('[API] Login response status:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Login failed:', error)
    throw new Error(error.body?.message || 'Login failed')
  }
  
  const data = await response.json() as ApiResponse<LoginResponse>
  console.log('[API] Login successful:', { token: data.body.token, role: data.body.role, department: data.body.department })
  
  // Transform to client format
  const authResponse = {
    token: data.body.token,
    user: {
      id: user_id,
      role: data.body.role,
      department: data.body.department
    }
  }
  
  console.log('[API] Transformed auth response:', authResponse)
  return authResponse
}

// Incident Services (Staff endpoints - admin access to all incidents)
export async function listIncidents(token: string, filters?: { estado?: string; urgencia?: string; ubicacion?: string; department?: string }) {
  console.log('[API] List incidents by department:', { filters, endpoint: `${API_BASE_URL}/staff/incidents/by-department` })
  console.log('[API] Token being sent:', token)
  
  const params = new URLSearchParams()
  if (filters?.estado) params.append('estado', filters.estado)
  if (filters?.urgencia) params.append('urgencia', filters.urgencia)
  if (filters?.ubicacion) params.append('ubicacion', filters.ubicacion)
  if (filters?.department) params.append('department', filters.department)
  
  const url = `${API_BASE_URL}/staff/incidents/by-department${params.toString() ? '?' + params.toString() : ''}`
  console.log('[API] Full URL:', url)
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  console.log('[API] List incidents response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('[API] List incidents failed:', errorText)
    throw new Error('Failed to fetch incidents')
  }
  
  const rawData = await response.text()
  console.log('[API] Raw response:', rawData)
  
  const data = JSON.parse(rawData) as ApiResponse<Incident[]>
  console.log('[API] Parsed response:', data)
  
  // Check if response contains an error
  if (data.body && typeof data.body === 'object' && 'error' in data.body) {
    console.error('[API] Backend returned error:', data.body)
    throw new Error((data.body as any).error || 'Backend error')
  }
  
  console.log('[API] List incidents successful, count:', data.body?.length || 0)
  console.log('[API] First incident:', data.body?.[0])
  return data.body
}

export async function getIncident(token: string, id: string) {
  console.log('[API] Get incident:', { id, endpoint: `${API_BASE_URL}/student/incidents/${id}` })
  
  const response = await fetch(`${API_BASE_URL}/student/incidents/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  console.log('[API] Get incident response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('[API] Get incident failed:', errorText)
    throw new Error('Failed to fetch incident')
  }
  
  const data = await response.json() as ApiResponse<Incident>
  console.log('[API] Get incident successful:', data.body)
  return data.body
}

export async function updateIncidentStatus(token: string, id: string, estado: string) {
  console.log('[API] Update incident status:', { id, estado, endpoint: `${API_BASE_URL}/staff/incidents/${id}/status` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ estado })
  })
  
  console.log('[API] Update status response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Update status failed:', error)
    throw new Error('Failed to update incident status')
  }
  
  const data = await response.json() as ApiResponse<Incident>
  console.log('[API] Update status successful:', data.body)
  return data.body
}

export async function addComment(token: string, id: string, content: string) {
  console.log('[API] Add comment:', { id, content_length: content.length, endpoint: `${API_BASE_URL}/staff/incidents/${id}/comment` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  })
  
  console.log('[API] Add comment response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Add comment failed:', error)
    throw new Error('Failed to add comment')
  }
  
  const data = await response.json() as ApiResponse<Comment>
  console.log('[API] Add comment successful:', data.body)
  return data.body
}

export async function assignIncident(token: string, id: string, department: string) {
  console.log('[API] Assign incident:', { id, department, endpoint: `${API_BASE_URL}/staff/incidents/${id}/assign` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ department })
  })
  
  console.log('[API] Assign incident response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Assign incident failed:', error)
    throw new Error('Failed to assign incident')
  }
  
  const data = await response.json() as ApiResponse<Incident>
  console.log('[API] Assign incident successful:', data.body)
  return data.body
}

export async function listIncidentsByDepartment(token: string, department: string) {
  console.log('[API] List incidents by department:', { department, endpoint: `${API_BASE_URL}/staff/incidents/by-department` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/by-department?department=${department}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  console.log('[API] List by department response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] List by department failed:', error)
    throw new Error('Failed to fetch incidents')
  }
  
  const data = await response.json() as ApiResponse<Incident[]>
  console.log('[API] List by department successful, count:', data.body.length)
  return data.body
}

export async function getIncidentEvents(token: string, id: string) {
  console.log('[API] Get incident events:', { id, endpoint: `${API_BASE_URL}/staff/incidents/${id}/events` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/${id}/events`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  console.log('[API] Get events response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Get events failed:', error)
    throw new Error('Failed to fetch incident events')
  }
  
  const data = await response.json() as ApiResponse<any[]>
  console.log('[API] Get events successful, count:', data.body.length)
  return data.body
}

export async function getStaffStats(token: string) {
  console.log('[API] Get staff stats:', { endpoint: `${API_BASE_URL}/staff/incidents/stats` })
  
  const response = await fetch(`${API_BASE_URL}/staff/incidents/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  console.log('[API] Get stats response:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[API] Get stats failed:', error)
    throw new Error('Failed to fetch stats')
  }
  
  const data = await response.json() as ApiResponse<StatsResponse>
  console.log('[API] Get stats successful:', data.body)
  return data.body
}
