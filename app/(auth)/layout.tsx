'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from '@/lib/auth-context'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    if (auth) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
