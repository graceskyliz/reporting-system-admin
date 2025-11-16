'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, TrendingDown, TrendingUp, Loader2 } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getStaffStats, StatsResponse } from '@/lib/api'
import { getAuth } from '@/lib/auth-context'

export default function ReportsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        if (!auth) {
          setError('No autenticado')
          return
        }

        const data = await getStaffStats(auth.token)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
        console.error('[v0] Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">{error || 'Error cargando reportes'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform data for charts
  const statusData = [
    { name: 'Resueltos', value: stats.resolved, fill: 'hsl(var(--color-primary))' },
    { name: 'En Atención', value: stats.inProgress, fill: 'hsl(var(--color-accent))' },
    { name: 'Pendientes', value: stats.pending, fill: 'hsl(var(--color-secondary))' },
  ]

  const priorityData = Object.entries(stats.byPriority).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }))

  const locationData = Object.entries(stats.byDepartment).map(([location, count]) => ({
    location,
    count,
  }))

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
  const avgResolutionTime = '2.5 días'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground mt-1">Análisis de incidentes en tiempo real</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Descargar Reportes
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total de Reportes</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">{stats.total}</h3>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% este mes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Tasa de Resolución</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">{resolutionRate}%</h3>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +5% vs mes anterior
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">{avgResolutionTime}</h3>
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                -0.5 días
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">En Atención</p>
              <h3 className="text-3xl font-bold text-accent mt-2">{stats.inProgress}</h3>
              <p className="text-xs text-secondary mt-2">Requieren atención</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution by Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <CardDescription>Porcentaje de incidentes por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents by Priority */}
        {priorityData.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Incidentes por Prioridad</CardTitle>
              <CardDescription>Cantidad de reportes por nivel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                  <YAxis stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--color-card))',
                      border: '1px solid hsl(var(--color-border))',
                    }}
                    labelStyle={{ color: 'hsl(var(--color-foreground))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--color-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Location Analytics */}
      {locationData.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Incidentes por Departamento</CardTitle>
            <CardDescription>Distribución de reportes por área</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationData.map((item) => {
                const maxCount = Math.max(...locationData.map(d => d.count))
                const percentage = (item.count / maxCount) * 100
                return (
                  <div key={item.location}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.location}</span>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
