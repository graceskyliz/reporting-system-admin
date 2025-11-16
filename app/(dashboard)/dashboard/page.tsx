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
    console.log('[Dashboard Page] Component mounted')
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('[Dashboard Page] Fetching auth')
        const auth = getAuth()
        console.log('[Dashboard Page] Auth retrieved:', auth)
        
        if (!auth) {
          console.log('[Dashboard Page] No auth, redirecting to login')
          router.push('/login')
          return
        }

        console.log('[Dashboard Page] Setting user state')
        setUser(auth)

        try {
          console.log('[Dashboard Page] Fetching staff stats with token:', auth.token)
          const apiStats = await getStaffStats(auth.token)
          console.log('[Dashboard Page] Stats received:', apiStats)
          
          const pending = apiStats.por_estado?.pendiente || 0
          const inProgress = apiStats.por_estado?.en_proceso || 0
          const resolved = apiStats.por_estado?.resuelto || 0
          const total = pending + inProgress + resolved
          
          // Calculate high priority from department stats if needed
          const highPriority = apiStats.por_departamento 
            ? Object.values(apiStats.por_departamento).reduce((sum, count) => sum + count, 0)
            : 0
          
          setStats({
            total,
            pending,
            inProgress,
            resolved,
            highPriority,
          })
        } catch (err) {
          console.error('[Dashboard Page] Error fetching API stats:', err)
          // Fallback to default values if API fails
          setStats({
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            highPriority: 0,
          })
        }
      } finally {
        setLoading(false)
        console.log('[Dashboard Page] Loading complete')
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
