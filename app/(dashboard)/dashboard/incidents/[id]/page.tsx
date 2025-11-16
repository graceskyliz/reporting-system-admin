'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit2, Save, X, Loader2 } from 'lucide-react'
import { getIncident, updateIncidentStatus, addComment, getIncidentEvents, Incident } from '@/lib/api'
import { getAuth } from '@/lib/auth-context'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string
  
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('pending')
  const [priority, setPriority] = useState('medium')
  const [assignee, setAssignee] = useState('')
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        if (!auth) {
          setError('No autenticado')
          return
        }

        const incidentData = await getIncident(auth.token, incidentId)
        setIncident(incidentData)
        setStatus(incidentData.status)
        setPriority(incidentData.priority)
        setAssignee(incidentData.assignedTo || '')

        const eventsData = await getIncidentEvents(auth.token, incidentId)
        setEvents(eventsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar incidente')
        console.error('[v0] Error fetching incident:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidentData()
  }, [incidentId])

  const handleSave = async () => {
    try {
      setSaving(true)
      const auth = getAuth()
      if (!auth) return

      const updated = await updateIncidentStatus(auth.token, incidentId, status)
      setIncident(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      console.error('[v0] Error saving incident:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <Card className="border-2">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">{error || 'Incidente no encontrado'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Main Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded">
                  {incident.id}
                </span>
              </div>
              <CardTitle>{incident.title}</CardTitle>
              <CardDescription className="mt-2">
                Reportado por {incident.reportedBy} • {new Date(incident.createdAt).toLocaleString()}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Detalles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Descripción</label>
              <p className="text-foreground mt-1">{incident.description}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Ubicación</label>
              <p className="text-foreground mt-1">📍 {incident.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Editable Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {isEditing ? 'Actualizar Estado' : 'Estado Actual'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    Estado
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Atención</option>
                    <option value="resolved">Resuelto</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4 border-t-2 border-border">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    variant="outline"
                    className="gap-2 flex-1"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge
                      variant={status === 'resolved' ? 'outline' : status === 'in_progress' ? 'default' : 'secondary'}
                      className="text-base py-1 px-3"
                    >
                      {status === 'pending' ? 'Pendiente' : status === 'in_progress' ? 'En Atención' : 'Resuelto'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Prioridad</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-base py-1 px-3">
                      {priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Asignado a</label>
                  <p className="text-foreground mt-1">👤 {assignee || 'Sin asignar'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Historial de Actualizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay eventos registrados</p>
            ) : (
              events.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-foreground">{event.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()} - {event.actor}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
