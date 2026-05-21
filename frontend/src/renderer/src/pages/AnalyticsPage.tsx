import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  UserPlus,
  Video,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { api } from '@/api/client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type AnalyticsData = {
  sessions: number
  patients: number
  requests: number
  satisfaction: number
  serviceDistribution?: Record<string, number>
  growth?: {
    labels: string[]
    data: number[]
  }
  weeklySessions?: {
    labels: string[]
    data: number[]
  }
}

export function AnalyticsPage(): JSX.Element {
  const { t } = useTranslation()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      const res = await api.get<AnalyticsData>('/api/analytics/')
      if (res.ok) {
        setData({
          sessions: res.data.sessions || 0,
          patients: res.data.patients || 0,
          requests: res.data.requests || 0,
          satisfaction: res.data.satisfaction || 0,
          serviceDistribution: res.data.serviceDistribution,
          growth: res.data.growth,
          weeklySessions: res.data.weeklySessions
        })
      }
      setLoading(false)
    })()
  }, [])

  const stats = [
    {
      title: t('analytics.sessions'),
      value: data ? String(data.sessions) : '—',
      change: '+12%',
      trend: 'up',
      icon: CalendarCheck,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: t('analytics.patients'),
      value: data ? String(data.patients) : '—',
      change: '+6%',
      trend: 'up',
      icon: Users,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: t('analytics.requests'),
      value: data ? String(data.requests) : '—',
      change: '-4%',
      trend: 'down',
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      title: t('analytics.satisfaction'),
      value: data ? `${data.satisfaction}/5` : '—',
      change: '+0.2',
      trend: 'up',
      icon: BarChart3,
      color: "bg-emerald-500/10 text-emerald-500"
    }
  ]

  // Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(156, 163, 175, 0.8)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.8)', font: { size: 10 } }
      }
    }
  }

  const sessionsData = {
    labels: data?.weeklySessions?.labels || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: t('analytics.sessions'),
      data: data?.weeklySessions?.data || [12, 19, 15, 22, 28, 14, 10],
      borderColor: 'rgba(59, 130, 246, 0.8)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
    }]
  }

  const patientGrowthData = {
    labels: data?.growth?.labels || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: t('analytics.patients'),
      data: data?.growth?.data || [32, 35, 40, 44, 46, 48],
      backgroundColor: 'rgba(139, 92, 246, 0.7)',
      borderRadius: 6,
    }]
  }

  const distLabels = data?.serviceDistribution && Object.keys(data.serviceDistribution).length > 0
    ? Object.keys(data.serviceDistribution)
    : ['Terapia', 'Cursos', 'Conversatorios']
  const distValues = data?.serviceDistribution && Object.keys(data.serviceDistribution).length > 0
    ? Object.values(data.serviceDistribution)
    : [65, 20, 15]

  const distributionData = {
    labels: distLabels,
    datasets: [{
      data: distValues,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 0,
      cutout: '70%',
    }]
  }

  const recentActivities = [
    { id: 1, type: 'user', content: 'Nuevo paciente: Maria Garcia', time: 'Hace 5 min', icon: UserPlus, color: 'text-blue-500' },
    { id: 2, type: 'video', content: 'Video subido: Curso Hipnosis L1', time: 'Hace 2 horas', icon: Video, color: 'text-purple-500' },
    { id: 3, type: 'message', content: 'Nuevo comentario en el Foro', time: 'Hace 4 horas', icon: MessageSquare, color: 'text-emerald-500' },
    { id: 4, type: 'appointment', content: 'Cita agendada: Carlos Ruiz', time: 'Mañana 10:00 AM', icon: CalendarCheck, color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('analytics.title')}
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualiza el rendimiento y crecimiento de tu centro holístico.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border">
          <Clock className="h-3.5 w-3.5" />
          Actualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${stat.color} transition-colors group-hover:bg-opacity-20`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Weekly Sessions Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-8 rounded-2xl border bg-card p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t('analytics.weekly_sessions')}
            </h3>
            <select className="text-xs bg-muted border-none rounded-lg px-2 py-1 outline-none ring-1 ring-border">
              <option>Últimos 7 días</option>
              <option>Último mes</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <Line options={commonOptions} data={sessionsData} />
          </div>
        </motion.div>

        {/* Distribution Doughnut */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4 rounded-2xl border bg-card p-6 shadow-sm flex flex-col"
        >
          <h3 className="font-semibold text-lg mb-6">{t('analytics.service_distribution')}</h3>
          <div className="h-[220px] w-full relative">
            <Doughnut 
              data={distributionData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  legend: { display: false }
                }
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {distributionData.labels.map((label, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: distributionData.datasets[0].backgroundColor[i] }} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
                <span className="font-medium">{distributionData.datasets[0].data[i]}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Patient Growth Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-6">{t('analytics.patient_growth')}</h3>
          <div className="h-[280px] w-full">
            <Bar 
              options={{
                ...commonOptions,
                scales: {
                  ...commonOptions.scales,
                  y: { ...commonOptions.scales.y, beginAtZero: true }
                }
              }} 
              data={patientGrowthData} 
            />
          </div>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">{t('analytics.recent_activity')}</h3>
            <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Ver todo <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-5">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`p-2 rounded-xl bg-muted/50 ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
