'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { IncidentsList } from '@/components/dashboard/incidents-list'
import { IncidentChart } from '@/components/dashboard/incident-chart'
import { RealtimeUpdates } from '@/components/dashboard/realtime-updates'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Simulación de datos de estadísticas
    setStats({
      total: 24,
      pending: 8,
      inProgress: 5,
      resolved: 11,
      highPriority: 3,
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'admin' ? 'Personal Administrativo' : 'Autoridad'} • Última actualización hace 2 minutos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Incidentes"
          value={stats.total}
          icon={AlertCircle}
          trend={2}
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          trend={-1}
          color="secondary"
        />
        <StatCard
          title="En Atención"
          value={stats.inProgress}
          icon={TrendingUp}
          trend={0}
          color="accent"
        />
        <StatCard
          title="Resueltos"
          value={stats.resolved}
          icon={CheckCircle}
          trend={3}
          color="primary"
        />
        <StatCard
          title="Alta Prioridad"
          value={stats.highPriority}
          icon={AlertCircle}
          trend={-2}
          color="destructive"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <IncidentChart />
        </div>

        {/* Summary Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Estado de Incidentes</CardTitle>
            <CardDescription>Resumen rápido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pendientes</span>
              <Badge variant="secondary">{stats.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">En Atención</span>
              <Badge variant="default">{stats.inProgress}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resueltos</span>
              <Badge variant="outline">{stats.resolved}</Badge>
            </div>
            <div className="border-t-2 border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-destructive">Críticos</span>
                <Badge variant="destructive">{stats.highPriority}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Realtime Updates */}
      <RealtimeUpdates />

      {/* Recent Incidents */}
      <IncidentsList />
    </div>
  )
}
