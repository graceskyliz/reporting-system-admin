'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus } from 'lucide-react'
import Link from 'next/link'

interface Incident {
  id: string
  title: string
  location: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
  updatedAt: string
  reporter: string
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  useEffect(() => {
    // Simulación de datos completos
    const allIncidents: Incident[] = [
      {
        id: 'INC-001',
        title: 'Fuga de agua en el baño',
        location: 'Edif. A - Piso 2',
        priority: 'high',
        status: 'in_progress',
        createdAt: '2024-11-16 09:30',
        updatedAt: '2024-11-16 10:45',
        reporter: 'Juan Pérez',
      },
      {
        id: 'INC-002',
        title: 'Luz no funciona',
        location: 'Entrada principal',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-11-16 10:15',
        updatedAt: '2024-11-16 10:15',
        reporter: 'María García',
      },
      {
        id: 'INC-003',
        title: 'Ventana rota',
        location: 'Lab 301',
        priority: 'critical',
        status: 'pending',
        createdAt: '2024-11-16 11:00',
        updatedAt: '2024-11-16 11:00',
        reporter: 'Carlos López',
      },
      {
        id: 'INC-004',
        title: 'Puerta dañada',
        location: 'Edif. B - Entrada',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-11-15 14:20',
        updatedAt: '2024-11-16 08:00',
        reporter: 'Ana Martínez',
      },
    ]
    setIncidents(allIncidents)
  }, [])

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.id.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Todos los Incidentes</h1>
          <p className="text-muted-foreground mt-1">{filteredIncidents.length} incidentes encontrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Reporte
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar incidente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Atención</option>
              <option value="resolved">Resuelto</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
            >
              <option value="all">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Lista de Incidentes</CardTitle>
          <CardDescription>Gestiona y actualiza el estado de cada incidente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron incidentes</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <Link key={incident.id} href={`/dashboard/incidents/${incident.id}`}>
                  <div className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="font-mono text-sm font-bold text-primary min-w-20">{incident.id}</div>
                      <div className="flex-1 min-w-40">
                        <h3 className="font-semibold text-foreground">{incident.title}</h3>
                        <p className="text-sm text-muted-foreground">📍 {incident.location}</p>
                      </div>
                      <Badge variant={getPriorityColor(incident.priority)} className="text-xs">
                        {incident.priority.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status)}>
                        {getStatusLabel(incident.status)}
                      </Badge>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>{incident.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
