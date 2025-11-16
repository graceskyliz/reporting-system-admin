import { AuthResponse } from './api'

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'AUTHORITY'
  name: string
  token: string
}

export function saveAuth(auth: AuthResponse) {
  const user: User = {
    ...auth.user,
    token: auth.accessToken
  }
  localStorage.setItem('auth', JSON.stringify(user))
  return user
}

export function getAuth(): User | null {
  const auth = localStorage.getItem('auth')
  return auth ? JSON.parse(auth) : null
}

export function clearAuth() {
  localStorage.removeItem('auth')
}

export function isAuthenticated(): boolean {
  return getAuth() !== null
}
