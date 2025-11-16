'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface HistoryEntry {
  id: string
  timestamp: string
  action: string
  incidentId: string
  incidentTitle: string
  user: string
  details: string
  changeType: 'status' | 'priority' | 'assignment' | 'creation' | 'comment'
}

const historyData: HistoryEntry[] = [
  {
    id: 'HIS-001',
    timestamp: '2024-11-16 11:30',
    action: 'Estado actualizado',
    incidentId: 'INC-001',
    incidentTitle: 'Fuga de agua en el baño',
    user: 'Admin Usuario',
    details: 'Cambió de "Pendiente" a "En Atención"',
    changeType: 'status',
  },
  {
    id: 'HIS-002',
    timestamp: '2024-11-16 10:45',
    action: 'Prioridad cambiada',
    incidentId: 'INC-001',
    incidentTitle: 'Fuga de agua en el baño',
    user: 'Autoridad A',
    details: 'Cambió de "Media" a "Alta"',
    changeType: 'priority',
  },
  {
    id: 'HIS-003',
    timestamp: '2024-11-16 10:15',
    action: 'Asignado',
    incidentId: 'INC-002',
    incidentTitle: 'Luz no funciona',
    user: 'Admin Usuario',
    details: 'Asignado a "Técnico B"',
    changeType: 'assignment',
  },
  {
    id: 'HIS-004',
    timestamp: '2024-11-16 09:30',
    action: 'Incidente creado',
    incidentId: 'INC-001',
    incidentTitle: 'Fuga de agua en el baño',
    user: 'Juan Pérez',
    details: 'Nuevo reporte enviado',
    changeType: 'creation',
  },
]

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredHistory = historyData.filter((entry) => {
    const matchesSearch =
      entry.incidentId.toLowerCase().includes(search.toLowerCase()) ||
      entry.incidentTitle.toLowerCase().includes(search.toLowerCase()) ||
      entry.user.toLowerCase().includes(search.toLowerCase())

    const matchesType = filterType === 'all' || entry.changeType === filterType

    return matchesSearch && matchesType
  })

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case 'status':
        return <Badge variant="default">Estado</Badge>
      case 'priority':
        return <Badge variant="secondary">Prioridad</Badge>
      case 'assignment':
        return <Badge variant="accent">Asignación</Badge>
      case 'creation':
        return <Badge variant="outline">Creación</Badge>
      case 'comment':
        return <Badge variant="outline">Comentario</Badge>
      default:
        return <Badge>Otro</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historial Completo</h1>
        <p className="text-muted-foreground mt-1">Trazabilidad de todas las acciones en el sistema</p>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por incidente, usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
            >
              <option value="all">Todos los tipos</option>
              <option value="creation">Creación</option>
              <option value="status">Cambios de Estado</option>
              <option value="priority">Cambios de Prioridad</option>
              <option value="assignment">Asignaciones</option>
              <option value="comment">Comentarios</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Registro de Acciones</CardTitle>
          <CardDescription>{filteredHistory.length} acciones encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron registros</p>
              </div>
            ) : (
              filteredHistory.map((entry, index) => (
                <div
                  key={entry.id}
                  className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1.5"></div>
                      {index < filteredHistory.length - 1 && (
                        <div className="w-0.5 h-12 bg-border"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary">
                          {entry.incidentId}
                        </span>
                        {getChangeTypeBadge(entry.changeType)}
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground">
                        {entry.action}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.incidentTitle}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>👤 {entry.user}</span>
                        <span>{entry.details}</span>
                      </div>
                    </div>
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
