import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BarChart, TrendingUp, Users, CalendarCheck } from 'lucide-react'
import { api } from '@/api/client'

type AnalyticsData = {
  sessions: number
  patients: number
  requests: number
  satisfaction: number
}

export function AnalyticsPage(): JSX.Element {
  const { t } = useTranslation()
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    void (async () => {
      const res = await api.get<AnalyticsData>('/api/analytics/')
      if (!res.ok) return
      setData(res.data)
    })()
  }, [])

  const stats = [
    {
      title: t('analytics.sessions'),
      value: data ? String(data.sessions) : '—',
      change: t('analytics.change_up', { value: '12%' }),
      icon: CalendarCheck,
      color: "text-primary"
    },
    {
      title: t('analytics.patients'),
      value: data ? String(data.patients) : '—',
      change: t('analytics.change_up', { value: '6%' }),
      icon: Users,
      color: "text-primary"
    },
    {
      title: t('analytics.requests'),
      value: data ? String(data.requests) : '—',
      change: t('analytics.change_down', { value: '4%' }),
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: t('analytics.satisfaction'),
      value: data && data.satisfaction ? `${data.satisfaction}/5` : '—',
      change: t('analytics.change_up', { value: '0.2' }),
      icon: BarChart,
      color: "text-primary"
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card text-card-foreground shadow p-6"
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">{stat.title}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-4 rounded-xl border bg-card p-6"
        >
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <span className="text-muted-foreground">{t('analytics.chart_placeholder')}</span>
          </div>
        </motion.div>
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="col-span-3 rounded-xl border bg-card p-6"
        >
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <span className="text-muted-foreground">{t('analytics.activity_placeholder')}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
