'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import {
  validateIncidentTitle,
  validateIncidentDescription,
  validateIncidentPriority,
} from '@/lib/validators'

interface IncidentFormProps {
  onSubmit?: (data: any) => Promise<void>
  loading?: boolean
}

export function IncidentForm({ onSubmit, loading }: IncidentFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('medium')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    const titleError = validateIncidentTitle(title)
    if (titleError) newErrors.title = titleError.message

    const descError = validateIncidentDescription(description)
    if (descError) newErrors.description = descError.message

    if (!location) newErrors.location = 'La ubicación es requerida'

    const priorityError = validateIncidentPriority(priority)
    if (priorityError) newErrors.priority = priorityError.message

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      if (onSubmit) {
        await onSubmit({ title, description, location, priority })
      }
    } catch (err) {
      console.error('[v0] Form error:', err)
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Reportar Nuevo Incidente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Incidente</Label>
            <Input
              id="title"
              placeholder="Descripción breve del incidente"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.title ? 'border-destructive' : ''}`}
              maxLength={200}
            />
            <div className="flex items-center justify-between">
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {title.length}/200
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada</Label>
            <textarea
              id="description"
              placeholder="Proporciona todos los detalles del incidente"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              disabled={loading}
              className={`w-full px-3 py-2 border-2 rounded-lg bg-background text-foreground disabled:opacity-50 ${
                errors.description ? 'border-destructive' : 'border-input'
              }`}
              rows={5}
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {description.length}/2000
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ej: Edificio A - Piso 2"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                if (errors.location) setErrors({ ...errors, location: '' })
              }}
              disabled={loading}
              className={`border-2 ${errors.location ? 'border-destructive' : ''}`}
            />
            {errors.location && (
              <p className="text-xs text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value)
                if (errors.priority) setErrors({ ...errors, priority: '' })
              }}
              disabled={loading}
              className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground disabled:opacity-50"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
            {errors.priority && (
              <p className="text-xs text-destructive">{errors.priority}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Reportar Incidente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
