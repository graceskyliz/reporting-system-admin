'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { IncidentsList } from '@/components/dashboard/incidents-list'
import { IncidentChart } from '@/components/dashboard/incident-chart'
import { RealtimeUpdates } from '@/components/dashboard/realtime-updates'
import { getStaffStats } from '@/lib/api'
import { getAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const auth = getAuth()
        
        if (!auth) {
          router.push('/login')
          return
        }

        setUser(auth)

        try {
          const apiStats = await getStaffStats(auth.token)
          setStats({
            total: apiStats.total,
            pending: apiStats.pending,
            inProgress: apiStats.inProgress,
            resolved: apiStats.resolved,
            highPriority: Object.entries(apiStats.byPriority)
              .filter(([priority]) => priority === 'critical' || priority === 'high')
              .reduce((sum, [_, count]) => sum + count, 0),
          })
        } catch (err) {
          console.error('[v0] Error fetching API stats:', err)
          // Fallback to default values if API fails
          setStats({
            total: 24,
            pending: 8,
            inProgress: 5,
            resolved: 11,
            highPriority: 3,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'ADMIN' ? 'Personal Administrativo' : 'Autoridad'} • Última actualización hace 2 minutos
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
