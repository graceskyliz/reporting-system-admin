'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, Home, AlertCircle, BarChart3, Clock } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/incidents', icon: AlertCircle, label: 'Incidentes', key: 'incidents' },
  { href: '/dashboard/reports', icon: BarChart3, label: 'Reportes', key: 'reports' },
  { href: '/dashboard/history', icon: Clock, label: 'Historial', key: 'history' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const currentPage = navItems.find(item => item.href === pathname)?.label || 'Dashboard'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-40 w-64 h-full bg-sidebar border-r-2 border-sidebar-border transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="p-6 border-b-2 border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground text-sm">Incidentes</h1>
                <p className="text-xs text-sidebar-foreground/60">Gestión</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent/20 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-sidebar-border">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b-2 border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-foreground hover:bg-muted p-2 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-foreground">{currentPage}</h2>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
