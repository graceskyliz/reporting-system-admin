import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  color?: 'primary' | 'secondary' | 'accent' | 'destructive'
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend = 0,
  color = 'primary',
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
  }

  const trendColor = trend > 0 ? 'text-destructive' : trend < 0 ? 'text-primary' : 'text-muted-foreground'

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend !== 0 && (
                <span className={`text-xs font-semibold ${trendColor}`}>
                  {trend > 0 ? '+' : ''}{trend}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
