'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAuth } from '@/lib/auth-context'
import { getIncidentEvents } from '@/lib/api'

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

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        if (!auth) {
          setError('No autenticado')
          return
        }

        // Note: This endpoint would need to return all events, not just for a single incident
        // For now, we'll use mock data as fallback
        const mockData: HistoryEntry[] = [
          {
            id: 'HIS-001',
            timestamp: new Date().toISOString(),
            action: 'Estado actualizado',
            incidentId: 'INC-001',
            incidentTitle: 'Fuga de agua en el baño',
            user: 'Admin Usuario',
            details: 'Cambió de "Pendiente" a "En Atención"',
            changeType: 'status',
          },
        ]
        setHistoryData(mockData)
      } catch (err) {
        console.error('[v0] Error fetching history:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar historial')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

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
            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Cargando historial...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}

            {!loading && filteredHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron registros</p>
              </div>
            )}

            {!loading && filteredHistory.map((entry, index) => (
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
                        {new Date(entry.timestamp).toLocaleString()}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
