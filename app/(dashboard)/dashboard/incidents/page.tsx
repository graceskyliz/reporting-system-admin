'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { listIncidents, Incident } from '@/lib/api'
import { getAuth, clearAuth } from '@/lib/auth-context'

export default function IncidentsPage() {
  const router = useRouter()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true)
        console.log('[Incidents Page] Fetching incidents')
        const auth = getAuth()
        if (!auth) {
          console.log('[Incidents Page] No auth found')
          setError('No autenticado')
          return
        }

        const filters: any = {}
        if (filterStatus !== 'all') filters.estado = filterStatus
        if (filterPriority !== 'all') filters.urgencia = filterPriority

        console.log('[Incidents Page] Filters:', filters)
        const data = await listIncidents(auth.token, filters)
        console.log('[Incidents Page] Incidents received:', data)
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setIncidents(data)
        } else {
          console.error('[Incidents Page] Data is not an array:', data)
          setIncidents([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar incidentes')
        console.error('[Incidents Page] Error fetching incidents:', err)
        setIncidents([])
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [filterStatus, filterPriority])

  const filteredIncidents = Array.isArray(incidents) ? incidents.filter((incident) => {
    const matchesSearch =
      incident.tipo?.toLowerCase().includes(search.toLowerCase()) ||
      incident.incident_id?.toLowerCase().includes(search.toLowerCase()) ||
      incident.ubicacion?.toLowerCase().includes(search.toLowerCase()) ||
      incident.descripcion?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  }) : []

  const getPriorityColor = (urgencia: string) => {
    switch (urgencia) {
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'resuelto':
        return 'outline'
      case 'en_proceso':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_proceso':
        return 'En Proceso'
      case 'resuelto':
        return 'Resuelto'
      default:
        return estado
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
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground"
            >
              <option value="all">Todas las urgencias</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
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
            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Cargando incidentes...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Error al cargar incidentes</p>
                    <p className="text-sm">{error}</p>
                    {error.includes('Token inválido') && (
                      <p className="text-xs mt-2">Tu sesión ha expirado. Por favor inicia sesión nuevamente.</p>
                    )}
                  </div>
                  {error.includes('Token inválido') && (
                    <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Ir a Login
                    </Button>
                  )}
                </div>
              </div>
            )}

            {!loading && filteredIncidents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron incidentes</p>
              </div>
            )}

            {!loading && filteredIncidents.map((incident) => (
              <Link key={incident.incident_id} href={`/dashboard/incidents/${incident.incident_id}`}>
                <div className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="font-mono text-sm font-bold text-primary min-w-20">
                      {incident.incident_id.substring(0, 8)}
                    </div>
                    <div className="flex-1 min-w-40">
                      <h3 className="font-semibold text-foreground">{incident.tipo}</h3>
                      <p className="text-sm text-muted-foreground">📍 {incident.ubicacion}</p>
                      <p className="text-xs text-muted-foreground mt-1">{incident.descripcion?.substring(0, 80)}...</p>
                    </div>
                    <Badge variant={getPriorityColor(incident.urgencia)} className="text-xs">
                      {incident.urgencia.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(incident.estado)}>
                      {getStatusLabel(incident.estado)}
                    </Badge>
                    <div className="text-xs text-muted-foreground text-right">
                      <p>{new Date(incident.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
