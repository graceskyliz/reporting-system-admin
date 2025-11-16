import { AuthResponse } from './api'

export interface User {
  id: string
  role: string
  department: string | null
  token: string
}

export function saveAuth(auth: AuthResponse) {
  console.log('[Auth Context] Saving auth:', auth)
  const user: User = {
    id: auth.user.id,
    role: auth.user.role,
    department: auth.user.department,
    token: auth.token
  }
  console.log('[Auth Context] User object created:', user)
  
  // Save to localStorage for client access
  localStorage.setItem('auth', JSON.stringify(user))
  
  // Save to cookies for middleware access
  document.cookie = `auth=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`
  
  console.log('[Auth Context] Auth saved to localStorage and cookies')
  return user
}

export function getAuth(): User | null {
  console.log('[Auth Context] Getting auth from localStorage')
  const auth = localStorage.getItem('auth')
  console.log('[Auth Context] Raw auth string:', auth)
  const parsed = auth ? JSON.parse(auth) : null
  console.log('[Auth Context] Parsed auth:', parsed)
  return parsed
}

export function clearAuth() {
  console.log('[Auth Context] Clearing auth')
  localStorage.removeItem('auth')
  // Remove cookie
  document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  console.log('[Auth Context] Auth cleared from localStorage and cookies')
}

export function isAuthenticated(): boolean {
  return getAuth() !== null
}
