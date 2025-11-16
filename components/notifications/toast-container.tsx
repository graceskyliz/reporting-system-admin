'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  title: string
  description?: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Simulación de notificaciones en tiempo real
    const interval = setInterval(() => {
      const messages = [
        {
          title: 'Incidente actualizado',
          description: 'INC-001 cambió a "En Atención"',
          type: 'info' as const
        },
        {
          title: 'Incidente resuelto',
          description: 'INC-004 ha sido marcado como resuelto',
          type: 'success' as const
        },
        {
          title: 'Incidente crítico',
          description: 'Nuevo incidente crítico reportado',
          type: 'warning' as const
        }
      ]

      // Random 30% chance to show a notification
      if (Math.random() < 0.1) {
        const random = messages[Math.floor(Math.random() * messages.length)]
        const id = Date.now().toString()
        setToasts(prev => [...prev, { ...random, id }])

        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id))
        }, 5000)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-primary border-primary/30 text-primary-foreground'
      case 'error':
        return 'bg-destructive border-destructive/30 text-destructive-foreground'
      case 'warning':
        return 'bg-secondary border-secondary/30 text-secondary-foreground'
      default:
        return 'bg-card border-border text-foreground'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg border-2 flex items-start gap-3 animate-in slide-in-from-bottom-4 ${getColor(toast.type)}`}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{toast.title}</p>
            {toast.description && (
              <p className="text-xs opacity-90 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
