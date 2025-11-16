'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  updateIncidentStatus, 
  addComment, 
  assignIncident, 
  listIncidentsByDepartment, 
  getIncidentEvents, 
  getStaffStats,
  listIncidents
} from '@/lib/api'
import { getAuth } from '@/lib/auth-context'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function TestApiPage() {
  const [auth, setAuth] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, any>>({})

  // Form states
  const [incidentId, setIncidentId] = useState('')
  const [status, setStatus] = useState('en_proceso')
  const [comment, setComment] = useState('')
  const [department, setDepartment] = useState('')

  useEffect(() => {
    const authData = getAuth()
    setAuth(authData)
  }, [])

  const handleTest = async (testName: string, apiCall: () => Promise<any>) => {
    setLoading(true)
    try {
      console.log(`[Test API] Starting test: ${testName}`)
      const result = await apiCall()
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }))
      console.log(`[Test API] ${testName} successful:`, result)
    } catch (error) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' } }))
      console.error(`[Test API] ${testName} failed:`, error)
    } finally {
      setLoading(false)
    }
  }

  if (!auth) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No autenticado. Por favor inicia sesión.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Test Panel</h1>
        <p className="text-muted-foreground mt-2">Prueba todos los endpoints de staff</p>
        <Badge className="mt-2">Token: {auth.token.substring(0, 20)}...</Badge>
      </div>

      {/* 1. Update Status */}
      <Card>
        <CardHeader>
          <CardTitle>1. PUT /staff/incidents/:id/status</CardTitle>
          <CardDescription>Actualizar estado de un incidente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Incident ID</Label>
              <Input
                placeholder="incident_id"
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
              />
            </div>
            <div>
              <Label>Nuevo Estado</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() => handleTest('updateStatus', () => updateIncidentStatus(auth.token, incidentId, status))}
            disabled={loading || !incidentId}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Update Status'}
          </Button>
          {results.updateStatus && (
            <div className={`p-3 rounded-lg ${results.updateStatus.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.updateStatus.success ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success! Check console for details</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.updateStatus.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Add Comment */}
      <Card>
        <CardHeader>
          <CardTitle>2. POST /staff/incidents/:id/comment</CardTitle>
          <CardDescription>Añadir comentario a un incidente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Incident ID</Label>
              <Input
                placeholder="incident_id"
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
              />
            </div>
            <div>
              <Label>Comentario</Label>
              <textarea
                className="w-full px-3 py-2 border-2 rounded-md"
                rows={3}
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => handleTest('addComment', () => addComment(auth.token, incidentId, comment))}
            disabled={loading || !incidentId || !comment}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Add Comment'}
          </Button>
          {results.addComment && (
            <div className={`p-3 rounded-lg ${results.addComment.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.addComment.success ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success! Check console for details</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.addComment.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Assign Incident */}
      <Card>
        <CardHeader>
          <CardTitle>3. POST /staff/incidents/:id/assign</CardTitle>
          <CardDescription>Asignar incidente a un departamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Incident ID</Label>
              <Input
                placeholder="incident_id"
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
              />
            </div>
            <div>
              <Label>Departamento</Label>
              <Input
                placeholder="Mantenimiento"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => handleTest('assignIncident', () => assignIncident(auth.token, incidentId, department))}
            disabled={loading || !incidentId || !department}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Assign Incident'}
          </Button>
          {results.assignIncident && (
            <div className={`p-3 rounded-lg ${results.assignIncident.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.assignIncident.success ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success! Check console for details</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.assignIncident.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. List by Department */}
      <Card>
        <CardHeader>
          <CardTitle>4. GET /staff/incidents/by-department</CardTitle>
          <CardDescription>Listar incidentes por departamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Departamento</Label>
            <Input
              placeholder="Mantenimiento"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleTest('listByDepartment', () => listIncidentsByDepartment(auth.token, department))}
            disabled={loading || !department}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test List by Department'}
          </Button>
          {results.listByDepartment && (
            <div className={`p-3 rounded-lg ${results.listByDepartment.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.listByDepartment.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success! Found {results.listByDepartment.data?.length || 0} incidents</span>
                  </div>
                  {results.listByDepartment.data?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Check console for full list
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.listByDepartment.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Get Events */}
      <Card>
        <CardHeader>
          <CardTitle>5. GET /staff/incidents/:id/events</CardTitle>
          <CardDescription>Obtener historial de eventos de un incidente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Incident ID</Label>
            <Input
              placeholder="incident_id"
              value={incidentId}
              onChange={(e) => setIncidentId(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleTest('getEvents', () => getIncidentEvents(auth.token, incidentId))}
            disabled={loading || !incidentId}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Get Events'}
          </Button>
          {results.getEvents && (
            <div className={`p-3 rounded-lg ${results.getEvents.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.getEvents.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success! Found {results.getEvents.data?.length || 0} events</span>
                  </div>
                  {results.getEvents.data?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Check console for full event list
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.getEvents.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Get Stats */}
      <Card>
        <CardHeader>
          <CardTitle>6. GET /staff/incidents/stats</CardTitle>
          <CardDescription>Obtener estadísticas globales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleTest('getStats', () => getStaffStats(auth.token))}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Get Stats'}
          </Button>
          {results.getStats && (
            <div className={`p-3 rounded-lg ${results.getStats.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {results.getStats.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success! Stats loaded</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Check console for full stats data
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span>{results.getStats.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
