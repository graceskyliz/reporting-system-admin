'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Lun', incidents: 4, resolved: 2 },
  { day: 'Mar', incidents: 6, resolved: 3 },
  { day: 'Mié', incidents: 5, resolved: 4 },
  { day: 'Jue', incidents: 8, resolved: 5 },
  { day: 'Vie', incidents: 7, resolved: 6 },
  { day: 'Sáb', incidents: 3, resolved: 3 },
  { day: 'Dom', incidents: 1, resolved: 1 },
]

export function IncidentChart() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Tendencia de Incidentes</CardTitle>
        <CardDescription>Últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--color-card))',
                border: '1px solid hsl(var(--color-border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--color-foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="hsl(var(--color-primary))"
              strokeWidth={2}
              dot={false}
              name="Nuevos"
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="hsl(var(--color-secondary))"
              strokeWidth={2}
              dot={false}
              name="Resueltos"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
