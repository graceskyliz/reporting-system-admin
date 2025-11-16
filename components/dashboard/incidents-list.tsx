'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Incident {
  id: string
  title: string
  description: string
  location: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
  reporter: string
}

export function IncidentsList() {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    // Simulación de datos
    setIncidents([
      {
        id: 'INC-001',
        title: 'Fuga de agua en el baño',
        description: 'Gotera en el techo del baño del segundo piso',
        location: 'Edif. A - Piso 2',
        priority: 'high',
        status: 'in_progress',
        createdAt: '2024-11-16 09:30',
        reporter: 'Juan Pérez',
      },
      {
        id: 'INC-002',
        title: 'Luz no funciona',
        description: 'Alumbrado exterior no enciende por las noches',
        location: 'Entrada principal',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-11-16 10:15',
        reporter: 'María García',
      },
      {
        id: 'INC-003',
        title: 'Ventana rota',
        description: 'Cristal roto en el laboratorio 301',
        location: 'Lab 301',
        priority: 'critical',
        status: 'pending',
        createdAt: '2024-11-16 11:00',
        reporter: 'Carlos López',
      },
    ])
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'secondary'
      case 'medium':
        return 'accent'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'outline'
      case 'in_progress':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'in_progress':
        return 'En Atención'
      case 'resolved':
        return 'Resuelto'
      default:
        return status
    }
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
        <div className="space-y-3">
          {incidents.map((incident) => (
            <Link key={incident.id} href={`/dashboard/incidents/${incident.id}`}>
              <div className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{incident.title}</h3>
                      <Badge variant={getPriorityColor(incident.priority)} className="text-xs">
                        {incident.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📍 {incident.location}</span>
                      <span>🕐 {incident.createdAt}</span>
                      <span>👤 {incident.reporter}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(incident.status)}>
                      {getStatusLabel(incident.status)}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
