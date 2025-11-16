'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, BarChart3, Bell, Lock } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = localStorage.getItem('user')
    if (user) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b-2 border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Sistema de Incidentes</h1>
              <p className="text-xs text-muted-foreground">Gestión Institucional</p>
            </div>
          </div>
          <Button onClick={() => router.push('/login')}>Iniciar Sesión</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Gestión Eficiente de <span className="text-primary">Incidentes</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Plataforma integral para reportar, gestionar y resolver incidentes institucionales con actualizaciones en tiempo real
        </p>
        <div className="flex justify-center flex-wrap">
          <Button size="lg" onClick={() => router.push('/login')}>
            Acceder al Sistema
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Funcionalidades Principales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={AlertCircle}
              title="Reporte de Incidentes"
              description="Crea reportes detallados con tipo, ubicación, descripción y nivel de urgencia"
            />
            <FeatureCard
              icon={Clock}
              title="Seguimiento en Tiempo Real"
              description="Recibe notificaciones instantáneas cuando el estado de un incidente cambia"
            />
            <FeatureCard
              icon={BarChart3}
              title="Análisis y Reportes"
              description="Visualiza estadísticas detalladas y tendencias de incidentes"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Gestión de Estados"
              description="Actualiza el estado de incidentes: pendiente, en atención, resuelto"
            />
            <FeatureCard
              icon={Bell}
              title="Notificaciones Inteligentes"
              description="Alertas automáticas por email o SMS según gravedad"
            />
            <FeatureCard
              icon={Lock}
              title="Seguridad y Trazabilidad"
              description="Historial completo de acciones con auditoría integrada"
            />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Roles Disponibles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoleCard
              title="Personal Administrativo"
              description="Gestión completa de incidentes, seguimiento y actualización de estados"
              features={[
                'Ver todos los incidentes',
                'Actualizar estados y prioridades',
                'Asignar incidentes',
                'Generar reportes',
                'Acceso al historial completo'
              ]}
            />
            <RoleCard
              title="Autoridades"
              description="Supervisión, escalamientos y análisis estratégico de incidentes"
              features={[
                'Panel de supervisión',
                'Análisis de tendencias',
                'Escalamiento de incidentes',
                'Reportes ejecutivos',
                'Control de accesos'
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-4">¿Listo para empezar?</h3>
          <p className="text-lg mb-8 opacity-90">
            Inicia sesión con tus credenciales institucionales para acceder al sistema
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/login')}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Iniciar Sesión Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Sistema de Gestión de Incidentes. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <Card className="border-2 hover:border-primary transition-colors">
      <CardContent className="p-6">
        <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function RoleCard({ title, description, features }: any) {
  return (
    <Card className="border-2">
      <CardContent className="p-8">
        <h4 className="text-2xl font-bold text-foreground mb-2">{title}</h4>
        <p className="text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2 text-foreground">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
