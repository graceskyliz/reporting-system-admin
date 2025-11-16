'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulación de autenticación - Reemplazar con API real
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({
          email,
          role,
          name: email.split('@')[0],
          id: Date.now()
        }))
        router.push('/dashboard')
      } else {
        setError('Por favor ingrese sus credenciales')
      }
    } catch (err) {
      setError('Error al iniciar sesión')
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
            <Label htmlFor="email">Correo Institucional</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@institucion.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground disabled:opacity-50"
            >
              <option value="admin">Personal Administrativo</option>
              <option value="authority">Autoridad</option>
            </select>
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Credenciales de prueba: cualquier email y contraseña
        </p>
      </CardContent>
    </Card>
  )
}
