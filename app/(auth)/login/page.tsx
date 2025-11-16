'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogIn } from 'lucide-react'
import { login } from '@/lib/api'
import { saveAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }

    if (!password || password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('[Login Page] Form submitted')
    
    if (!validate()) {
      console.log('[Login Page] Validation failed')
      return
    }

    setGeneralError('')
    setLoading(true)

    try {
      console.log('[Login Page] Calling login API with username:', username)
      const response = await login(username, password)
      console.log('[Login Page] Login successful, saving auth')
      saveAuth(response)
      console.log('[Login Page] Auth saved, redirecting to dashboard')
      console.log('[Login Page] Current pathname:', window.location.pathname)
      console.log('[Login Page] Calling router.push("/dashboard")')
      router.push('/dashboard')
      console.log('[Login Page] router.push called successfully')
    } catch (err) {
      console.error('[Login Page] Login error:', err)
      setGeneralError(
        err instanceof Error 
          ? err.message 
          : 'Error al iniciar sesión. Verifique sus credenciales.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Sistema de Incidentes</CardTitle>
            <CardDescription>Gestión institucional</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="staff001"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) setErrors({ ...errors, username: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.username ? 'border-destructive' : ''}`}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.password ? 'border-destructive' : ''}`}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {generalError && (
            <div className="flex gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{generalError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-primary hover:underline font-medium"
            >
              Registrarse
            </button>
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Ingresa tus credenciales institucionales
        </p>
      </CardContent>
    </Card>
  )
}
