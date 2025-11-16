'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const statusData = [
  { name: 'Resueltos', value: 45, fill: 'hsl(var(--color-primary))' },
  { name: 'En Atención', value: 30, fill: 'hsl(var(--color-accent))' },
  { name: 'Pendientes', value: 25, fill: 'hsl(var(--color-secondary))' },
]

const priorityData = [
  { name: 'Baja', count: 12 },
  { name: 'Media', count: 28 },
  { name: 'Alta', count: 32 },
  { name: 'Crítica', count: 8 },
]

const locationData = [
  { location: 'Edif. A', count: 18 },
  { location: 'Edif. B', count: 16 },
  { location: 'Lab 1', count: 12 },
  { location: 'Lab 2', count: 10 },
  { location: 'Otros', count: 14 },
]

export default function ReportsPage() {
  const avgResolutionTime = '2.5 días'
  const totalReports = 100
  const resolutionRate = 45
  const criticalCount = 8

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground mt-1">Análisis de incidentes generados por Airflow</p>
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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Reportes</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{totalReports}</h3>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% este mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Resolución</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{resolutionRate}%</h3>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +5% vs mes anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{avgResolutionTime}</h3>
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -0.5 días
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidentes Críticos</p>
                <h3 className="text-3xl font-bold text-destructive mt-2">{criticalCount}</h3>
                <p className="text-xs text-secondary mt-2">Requieren atención urgente</p>
              </div>
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
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents by Priority */}
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
      </div>

      {/* Location Analytics */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Incidentes por Ubicación</CardTitle>
          <CardDescription>Zonas con mayor actividad de reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locationData.map((item) => {
              const percentage = (item.count / 70) * 100
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
    </div>
  )
}
