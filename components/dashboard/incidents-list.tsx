'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { listIncidents, Incident } from '@/lib/api'
import { getAuth } from '@/lib/auth-context'
import { formatUbicacion } from '@/lib/utils'

export function IncidentsList() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const auth = getAuth()
        if (!auth) return
        
        const data = await listIncidents(auth.token)
        // Show only the 5 most recent incidents
        setIncidents(data.slice(0, 5))
      } catch (error) {
        console.error('Error fetching incidents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'destructive'
      case 'alta':
        return 'secondary'
      case 'media':
        return 'accent'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelto':
        return 'outline'
      case 'en_proceso':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_proceso':
        return 'En Atención'
      case 'resuelto':
        return 'Resuelto'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Incidentes Recientes</CardTitle>
          <CardDescription>Últimos reportes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Incidentes Recientes</CardTitle>
            <CardDescription>Últimos reportes registrados</CardDescription>
          </div>
          <Link href="/dashboard/incidents">
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay incidentes recientes</p>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <Link key={incident.incident_id} href={`/dashboard/incidents/${incident.incident_id}`}>
                <div className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{incident.tipo}</h3>
                        <Badge variant={getPriorityColor(incident.urgencia)} className="text-xs">
                          {incident.urgencia.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incident.descripcion?.substring(0, 80)}...</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📍 {formatUbicacion(incident.ubicacion)}</span>
                        <span>🕐 {new Date(incident.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(incident.estado)}>
                        {getStatusLabel(incident.estado)}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

