'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Edit2, Save, X, Loader2, MessageSquare, Users } from 'lucide-react'
import { getIncident, updateIncidentStatus, addComment, assignIncident, getIncidentEvents, Incident } from '@/lib/api'
import { getAuth } from '@/lib/auth-context'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string
  
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        console.log('[Incident Detail] 📋 Auth object:', auth)
        
        if (!auth) {
          setError('No autenticado')
          console.error('[Incident Detail] ❌ No auth found in localStorage')
          return
        }

        if (!auth.token) {
          setError('Token no encontrado')
          console.error('[Incident Detail] ❌ Auth exists but token is missing:', auth)
          return
        }

        console.log('[Incident Detail] ✅ Auth retrieved successfully')
        console.log('[Incident Detail] 🔑 Token length:', auth.token.length)
        console.log('[Incident Detail] 🔑 Token preview:', auth.token.substring(0, 50) + '...')
        console.log('[Incident Detail] 👤 User ID:', auth.id)
        console.log('[Incident Detail] 👔 Role:', auth.role)
        console.log('[Incident Detail] 📍 Fetching incident:', incidentId)
        
        const incidentData = await getIncident(auth.token, incidentId)
        console.log('[Incident Detail] Incident data:', incidentData)
        setIncident(incidentData)
        setNewStatus(incidentData.estado)

        try {
          const eventsData = await getIncidentEvents(auth.token, incidentId)
          setEvents(eventsData)
        } catch (err) {
          console.log('[Incident Detail] No events found or error fetching events')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidente'
        
        // Log error details for debugging
        if (err instanceof Error && err.message === 'INVALID_TOKEN') {
          console.error('[Incident Detail] ❌ Backend rejected token as invalid')
          const currentAuth = getAuth()
          if (currentAuth?.token) {
            console.error('[Incident Detail] Token that was rejected:', currentAuth.token.substring(0, 50) + '...')
          }
          setError('Token inválido - El backend rechazó la autenticación')
        } else {
          setError(errorMessage)
        }
        
        console.error('[Incident Detail] Error fetching incident:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidentData()
  }, [incidentId])

  const handleUpdateStatus = async () => {
    try {
      setSaving(true)
      setError('') // Clear previous errors
      const auth = getAuth()
      if (!auth) return

      console.log('[Incident Detail] Updating status to:', newStatus)
      
      await updateIncidentStatus(auth.token, incidentId, newStatus)
      
      // Success - refetch to get server state
      const updated = await getIncident(auth.token, incidentId)
      setIncident(updated)
      setIsEditingStatus(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado')
      console.error('[Incident Detail] Error updating status:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    try {
      setSaving(true)
      setError('') // Clear previous errors
      const auth = getAuth()
      if (!auth) return

      console.log('[Incident Detail] Adding comment:', newComment)
      
      try {
        await addComment(auth.token, incidentId, newComment)
        setNewComment('')
        setShowCommentForm(false)
        
        // Refetch incident and events
        const updated = await getIncident(auth.token, incidentId)
        setIncident(updated)
        
        try {
          const eventsData = await getIncidentEvents(auth.token, incidentId)
          setEvents(eventsData)
        } catch (err) {
          console.log('[Incident Detail] Error fetching events after comment')
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('CORS_ERROR')) {
          // CORS error - show warning but clear form
          setError('⚠️ Advertencia: El comentario puede no haberse guardado en el servidor debido a problemas de CORS en el backend.')
          setNewComment('')
          setShowCommentForm(false)
          console.warn('[Incident Detail] CORS error on add comment')
        } else {
          throw err
        }
      }
    } catch (err) {
      if (!(err instanceof Error && err.message.includes('CORS_ERROR'))) {
        setError(err instanceof Error ? err.message : 'Error al añadir comentario')
        console.error('[Incident Detail] Error adding comment:', err)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleAssignDepartment = async () => {
    if (!newDepartment.trim()) return
    
    try {
      setSaving(true)
      setError('') // Clear previous errors
      const auth = getAuth()
      if (!auth) return

      console.log('[Incident Detail] Assigning to department:', newDepartment)
      
      // Optimistic update
      const previousIncident = incident
      if (incident) {
        setIncident({ ...incident, department: newDepartment })
        setNewDepartment('')
        setShowDepartmentForm(false)
      }
      
      try {
        await assignIncident(auth.token, incidentId, newDepartment)
        // Refetch incident data
        const updated = await getIncident(auth.token, incidentId)
        setIncident(updated)
      } catch (err) {
        if (err instanceof Error && err.message.includes('CORS_ERROR')) {
          // CORS error - show warning but keep optimistic update
          setError('⚠️ Advertencia: El departamento se asignó localmente pero puede no haberse guardado en el servidor debido a problemas de CORS en el backend.')
          console.warn('[Incident Detail] CORS error on assign department')
        } else {
          // Revert optimistic update
          setIncident(previousIncident)
          setShowDepartmentForm(true)
          throw err
        }
      }
    } catch (err) {
      if (!(err instanceof Error && err.message.includes('CORS_ERROR'))) {
        setError(err instanceof Error ? err.message : 'Error al asignar departamento')
        console.error('[Incident Detail] Error assigning department:', err)
      }
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
        <div className={`p-4 rounded-lg ${
          error.includes('⚠️') 
            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20' 
            : 'bg-destructive/10 text-destructive'
        }`}>
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
                  {incident.incident_id}
                </span>
                <Badge variant={incident.urgencia === 'critica' ? 'destructive' : incident.urgencia === 'alta' ? 'secondary' : 'outline'}>
                  {incident.urgencia.toUpperCase()}
                </Badge>
              </div>
              <CardTitle>{incident.tipo}</CardTitle>
              <CardDescription className="mt-2">
                Reportado por {incident.reporter_id} • {new Date(incident.created_at).toLocaleString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Info */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Detalles del Incidente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Descripción</label>
              <p className="text-foreground mt-1">{incident.descripcion}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Ubicación</label>
              <p className="text-foreground mt-1">📍 {incident.ubicacion}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Estado Actual</label>
              <div className="mt-1">
                <Badge variant={incident.estado === 'resuelto' ? 'outline' : incident.estado === 'en_proceso' ? 'default' : 'secondary'}>
                  {incident.estado === 'pendiente' ? 'Pendiente' : incident.estado === 'en_proceso' ? 'En Proceso' : 'Resuelto'}
                </Badge>
              </div>
            </div>
            {incident.department && (
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Departamento Asignado</label>
                <p className="text-foreground mt-1">🏢 {incident.department}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          {/* Update Status Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                Actualizar Estado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingStatus ? (
                <>
                  <div>
                    <Label>Nuevo Estado</Label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 mt-1 border-2 border-input rounded-lg bg-background"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="resuelto">Resuelto</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateStatus} disabled={saving} className="flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                    </Button>
                    <Button onClick={() => setIsEditingStatus(false)} variant="outline" disabled={saving}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setIsEditingStatus(true)} className="w-full gap-2">
                  <Edit2 className="w-4 h-4" />
                  Cambiar Estado
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Add Comment Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Añadir Comentario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCommentForm ? (
                <>
                  <div>
                    <Label>Comentario</Label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full px-3 py-2 mt-1 border-2 border-input rounded-lg bg-background resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddComment} disabled={saving || !newComment.trim()} className="flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
                    </Button>
                    <Button onClick={() => { setShowCommentForm(false); setNewComment('') }} variant="outline" disabled={saving}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setShowCommentForm(true)} variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Agregar Comentario
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Assign Department Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Asignar Departamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showDepartmentForm ? (
                <>
                  <div>
                    <Label>Departamento</Label>
                    <Input
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="Mantenimiento, Seguridad, TI..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAssignDepartment} disabled={saving || !newDepartment.trim()} className="flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Asignar'}
                    </Button>
                    <Button onClick={() => { setShowDepartmentForm(false); setNewDepartment('') }} variant="outline" disabled={saving}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setShowDepartmentForm(true)} variant="outline" className="w-full gap-2">
                  <Users className="w-4 h-4" />
                  {incident.department ? 'Reasignar' : 'Asignar'} Departamento
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Historial de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay eventos registrados</p>
            ) : (
              events.map((event, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{event.description || event.type || 'Evento'}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Fecha desconocida'}
                      {event.actor && ` - ${event.actor}`}
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
