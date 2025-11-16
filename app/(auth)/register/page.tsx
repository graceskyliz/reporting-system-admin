'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react'
import { registerUser } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [department, setDepartment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!userId.trim()) {
      newErrors.userId = 'El ID de usuario es requerido'
    }

    if (!password || password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!department.trim()) {
      newErrors.department = 'El departamento es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setGeneralError('')
    setLoading(true)

    try {
      console.log('[Register] Attempting registration:', { userId, role, department })
      
      const response = await registerUser(userId, password, role, department)
      
      console.log('[Register] Registration successful:', response)
      
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      console.error('[Register] Registration failed:', err)
      setGeneralError(
        err instanceof Error 
          ? err.message 
          : 'Error al registrar usuario. Intente nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">¡Registro Exitoso!</h3>
              <p className="text-muted-foreground mt-2">
                Tu cuenta ha sido creada correctamente.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Redirigiendo al inicio de sesión...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Registro de Personal</CardTitle>
            <CardDescription>Crea una nueva cuenta de staff</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">ID de Usuario</Label>
            <Input
              id="userId"
              type="text"
              placeholder="staff001"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value)
                if (errors.userId) setErrors({ ...errors, userId: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.userId ? 'border-destructive' : ''}`}
            />
            {errors.userId && (
              <p className="text-xs text-destructive">{errors.userId}</p>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.confirmPassword ? 'border-destructive' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              type="text"
              placeholder="Mantenimiento"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                if (errors.department) setErrors({ ...errors, department: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.department ? 'border-destructive' : ''}`}
            />
            {errors.department && (
              <p className="text-xs text-destructive">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border-2 rounded-md bg-background"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
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
            {loading ? 'Registrando...' : 'Registrar Cuenta'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary hover:underline font-medium"
              disabled={loading}
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
