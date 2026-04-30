import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, BarChart3, Users, Video, Star, ArrowRight, BookOpen } from 'lucide-react'
import logo from '../assets/logo.png'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'

type DashboardCounts = {
  courses: number
  therapists: number
  services: number
  talks: number
  testimonials: number
  stories: number
}

export function DashboardPage(): JSX.Element {
  const { t } = useTranslation()
  const [counts, setCounts] = useState<DashboardCounts | null>(null)

  useEffect(() => {
    void (async () => {
      const res = await api.get<{ courses: number; therapists: number; services: number; talks: number; testimonials: number; stories: number }>(
        '/api/dashboard/'
      )
      if (!res.ok) return
      setCounts(res.data)
    })()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.section 
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/10 p-8 md:p-12 shadow-2xl"
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur-sm px-4 py-2 shadow-sm border">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground/80">{t('dashboard.badge')}</span>
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-foreground">
                  {t('dashboard.hero_title')}
                </span>
              </h2>
              <p className="mt-3 text-lg md:text-xl font-medium text-foreground/80">
                {t('dashboard.hero_subtitle')}
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
              {t('dashboard.hero_description')}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 rounded-full">
                <Link to="/terapeutas">
                  <Heart className="mr-2 h-5 w-5" />
                  {t('dashboard.cta_therapists')}
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="shadow-sm rounded-full">
                <Link to="/servicios">
                  {t('dashboard.cta_services')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-12 w-56 h-56 bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      </motion.section>

      <motion.div variants={container} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            title: t('dashboard.stat_1_title'),
            desc: t('dashboard.stat_1_desc'),
            icon: Users,
            color: "text-primary bg-primary/10",
            count: counts?.therapists ?? '—'
          },
          {
            title: t('dashboard.stat_2_title'),
            desc: t('dashboard.stat_2_desc'),
            icon: Video,
            color: "text-primary bg-primary/10",
            count: counts?.talks ?? '—'
          },
          {
            title: t('dashboard.stat_3_title'),
            desc: t('dashboard.stat_3_desc'),
            icon: Star,
            color: "text-primary bg-primary/10",
            count: counts?.testimonials ?? '—'
          },
          {
            title: 'Historias',
            desc: 'Historias compartidas',
            icon: BookOpen,
            color: "text-primary bg-primary/10",
            count: counts?.stories ?? '—'
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            variants={item}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-card/70 backdrop-blur-sm border shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 group cursor-default"
          >
            <div className="flex items-start justify-between gap-4">
              <div className={`size-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {feature.count}
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
        {[
          { title: t('dashboard.quick_analytics'), href: '/analitica', icon: BarChart3, desc: t('dashboard.quick_analytics_desc') },
          { title: t('dashboard.quick_talks'), href: '/conversatorios', icon: Video, desc: t('dashboard.quick_talks_desc') },
          { title: t('dashboard.quick_testimonials'), href: '/testimonios', icon: Star, desc: t('dashboard.quick_testimonials_desc') }
        ].map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="group rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-lg font-semibold">{card.title}</div>
                <div className="text-sm text-muted-foreground">{card.desc}</div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-border">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
              {t('dashboard.open')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
