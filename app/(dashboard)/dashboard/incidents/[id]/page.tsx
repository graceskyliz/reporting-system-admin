'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit2, Save, X } from 'lucide-react'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('in_progress')
  const [priority, setPriority] = useState('high')
  const [assignee, setAssignee] = useState('Técnico A')

  const incident = {
    id: incidentId,
    title: 'Fuga de agua en el baño',
    description: 'Se detectó una gotera en el techo del baño del segundo piso del edificio A. El agua gotea constantemente y ha mojado el piso, representando un riesgo.',
    location: 'Edif. A - Piso 2',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-11-16 09:30',
    updatedAt: '2024-11-16 10:45',
    reporter: 'Juan Pérez',
    type: 'Infraestructura',
  }

  const handleSave = () => {
    console.log('Guardando cambios:', { status, priority, assignee })
    setIsEditing(false)
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

      {/* Main Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded">
                  {incident.id}
                </span>
                <Badge variant="secondary">{incident.type}</Badge>
              </div>
              <CardTitle>{incident.title}</CardTitle>
              <CardDescription className="mt-2">
                Reportado por {incident.reporter} • {incident.createdAt}
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
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Tipo de Incidente</label>
              <p className="text-foreground mt-1">{incident.type}</p>
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
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    Asignado a
                  </label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t-2 border-border">
                  <Button
                    onClick={handleSave}
                    className="gap-2 flex-1"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
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
                  <p className="text-foreground mt-1">👤 {assignee}</p>
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
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground">Estado cambió a "En Atención"</p>
                <p className="text-sm text-muted-foreground">10:45 - Actualizado por Sistema</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-foreground">Incidente creado</p>
                <p className="text-sm text-muted-foreground">09:30 - Reportado por Juan Pérez</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
