'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertTriangle } from 'lucide-react'

export function RealtimeUpdates() {
  const recentUpdates = [
    {
      id: 1,
      timestamp: 'Hace 2 minutos',
      incidentId: 'INC-001',
      title: 'Estado actualizado',
      message: 'Fuga de agua cambió a En Atención',
      type: 'status'
    },
    {
      id: 2,
      timestamp: 'Hace 5 minutos',
      incidentId: 'INC-003',
      title: 'Incidente crítico',
      message: 'Ventana rota - Requiere atención urgente',
      type: 'critical'
    },
    {
      id: 3,
      timestamp: 'Hace 8 minutos',
      incidentId: 'INC-002',
      title: 'Asignación',
      message: 'Asignado a Técnico B',
      type: 'assignment'
    }
  ]

  return (
    <Card className="border-2 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <CardTitle>Actualizaciones en Tiempo Real</CardTitle>
            <CardDescription>Últimas actividades del sistema</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentUpdates.map((update) => (
            <div
              key={update.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-primary">{update.incidentId}</span>
                  {update.type === 'critical' && (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{update.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{update.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
