'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertTriangle, MessageSquare, Users, FileText } from 'lucide-react'
import { useWebSocket, type WebSocketMessage } from '@/lib/hooks/use-websocket'
import { getAuth } from '@/lib/auth-context'

interface DisplayUpdate {
  id: string
  timestamp: string
  incidentId: string
  title: string
  message: string
  type: 'status' | 'critical' | 'assignment' | 'comment' | 'created'
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
}

function messageToUpdate(msg: WebSocketMessage): DisplayUpdate {
  const baseId = `${msg.type}-${msg.timestamp}`
  
  switch (msg.type) {
    case 'notifyIncidentCreated':
      return {
        id: baseId,
        timestamp: formatTimestamp(msg.timestamp),
        incidentId: msg.incident?.incident_id || 'N/A',
        title: 'Nuevo Incidente',
        message: `${msg.incident?.tipo || 'Incidente'} - ${msg.incident?.ubicacion || 'Ubicación desconocida'}`,
        type: msg.incident?.urgencia === 'critica' || msg.incident?.urgencia === 'alta' ? 'critical' : 'created'
      }
      
    case 'notifyIncidentStatusChanged':
      const statusMap: Record<string, string> = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Atención',
        'resuelto': 'Resuelto'
      }
      return {
        id: baseId,
        timestamp: formatTimestamp(msg.timestamp),
        incidentId: msg.incident?.incident_id || 'N/A',
        title: 'Estado Actualizado',
        message: `${statusMap[msg.old_status] || msg.old_status} → ${statusMap[msg.incident?.estado] || msg.incident?.estado}`,
        type: 'status'
      }
      
    case 'notifyCommentAdded':
      return {
        id: baseId,
        timestamp: formatTimestamp(msg.timestamp),
        incidentId: msg.incident_id,
        title: 'Nuevo Comentario',
        message: `${msg.commenter_name}: ${msg.comment.substring(0, 50)}${msg.comment.length > 50 ? '...' : ''}`,
        type: 'comment'
      }
      
    case 'notifyDepartmentAssigned':
      return {
        id: baseId,
        timestamp: formatTimestamp(msg.timestamp),
        incidentId: msg.incident_id,
        title: 'Departamento Asignado',
        message: `Asignado a ${msg.department}`,
        type: 'assignment'
      }
      
    default:
      return {
        id: baseId,
        timestamp: formatTimestamp(msg.timestamp),
        incidentId: 'N/A',
        title: 'Actualización',
        message: 'Nueva actividad en el sistema',
        type: 'status'
      }
  }
}

export function RealtimeUpdates() {
  const auth = getAuth()
  const { isConnected, messages } = useWebSocket({ 
    token: auth?.token,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5
  })

  const displayUpdates = useMemo(() => {
    return messages.map(messageToUpdate).slice(0, 10) // Show last 10 updates
  }, [messages])

  const getIcon = (type: DisplayUpdate['type']) => {
    switch (type) {
      case 'created':
        return <FileText className="w-4 h-4 text-primary" />
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'assignment':
        return <Users className="w-4 h-4 text-purple-500" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <Card className="border-2 bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isConnected ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
            <div>
              <CardTitle>Actualizaciones en Tiempo Real</CardTitle>
              <CardDescription>
                {isConnected ? 'Conectado • Últimas actividades del sistema' : 'Desconectado • Esperando conexión...'}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'En vivo' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayUpdates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay actualizaciones recientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayUpdates.map((update) => (
              <div
                key={update.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/80 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-primary">{update.incidentId}</span>
                    {getIcon(update.type)}
                    <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{update.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{update.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
