'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, getAuth, clearAuth } from '@/lib/auth-context'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    if (!auth) {
      setUser(null)
      setLoading(false)
      return
    }
    setUser(auth)
    setLoading(false)
  }, [])

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/login')
  }

  return { user, loading, logout, isAuthenticated: !!user }
}
